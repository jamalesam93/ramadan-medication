import type { PrayerTimes, Location, CalculationMethod } from '../types/index.ts';
import { ALADHAN_API_BASE, CALCULATION_METHODS } from './constants.ts';
import { getCurrentDate } from './helpers.ts';

const PRAYER_TIMES_STORAGE_PREFIX = 'ramadan_prayer_times_';
const CACHE_DISTANCE_THRESHOLD = 0.1; // Approx 11km tolerance for cache hits

// In-memory cache for current session
const prayerTimesCache: Record<string, PrayerTimes> = {};

function getStorageKey(lat: number, lng: number, method: CalculationMethod, date: string): string {
  return `${PRAYER_TIMES_STORAGE_PREFIX}${lat.toFixed(4)}-${lng.toFixed(4)}-${method}-${date}`;
}

function getPersistedPrayerTimes(key: string): PrayerTimes | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as PrayerTimes;
    if (parsed?.maghrib && parsed?.fajr && parsed?.date) return parsed;
    return null;
  } catch {
    return null;
  }
}

function setPersistedPrayerTimes(key: string, data: PrayerTimes): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage errors (quota, private mode)
  }
}

function findCachedPrayerTimes(
  targetLat: number,
  targetLng: number,
  method: CalculationMethod,
  date: string
): PrayerTimes | null {
  const suffix = `-${method}-${date}`;
  const coordRegex = /^(-?\d+\.\d{4})-(-?\d+\.\d{4})$/;

  // 1. Check in-memory cache with fuzzy matching
  for (const key in prayerTimesCache) {
    if (key.endsWith(suffix)) {
      const coordsPart = key.slice(0, -suffix.length);
      const match = coordsPart.match(coordRegex);
      if (match) {
        const lat = parseFloat(match[1]);
        const lng = parseFloat(match[2]);
        if (Math.abs(lat - targetLat) < CACHE_DISTANCE_THRESHOLD &&
            Math.abs(lng - targetLng) < CACHE_DISTANCE_THRESHOLD) {
          console.log('PrayerTimes: Fuzzy cache hit (memory)', { targetLat, targetLng, cachedLat: lat, cachedLng: lng });
          return prayerTimesCache[key];
        }
      }
    }
  }

  // 2. Check localStorage with fuzzy matching
  if (typeof window !== 'undefined') {
    try {
      const prefix = PRAYER_TIMES_STORAGE_PREFIX;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(prefix) && key.endsWith(suffix)) {
          const middle = key.substring(prefix.length, key.length - suffix.length);
          const match = middle.match(coordRegex);
          if (match) {
            const lat = parseFloat(match[1]);
            const lng = parseFloat(match[2]);
            if (Math.abs(lat - targetLat) < CACHE_DISTANCE_THRESHOLD &&
                Math.abs(lng - targetLng) < CACHE_DISTANCE_THRESHOLD) {
              const stored = localStorage.getItem(key);
              if (stored) {
                const parsed = JSON.parse(stored) as PrayerTimes;
                if (parsed?.maghrib && parsed?.fajr && parsed?.date) {
                  console.log('PrayerTimes: Fuzzy cache hit (storage)', { targetLat, targetLng, cachedLat: lat, cachedLng: lng });
                  return parsed;
                }
              }
            }
          }
        }
      }
    } catch {
      // Ignore storage errors
    }
  }

  return null;
}

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  method: CalculationMethod = 'MuslimWorldLeague',
  date?: string
): Promise<PrayerTimes | null> {
  console.log('PrayerTimes: fetchPrayerTimes called', { latitude, longitude, method, date });
  try {
    const targetDate = date || getCurrentDate();

    // Create exact cache key for O(1) lookup
    const exactCacheKey = `${latitude.toFixed(4)}-${longitude.toFixed(4)}-${method}-${targetDate}`;

    // 1. Try exact match first (fastest)
    if (prayerTimesCache[exactCacheKey]) {
      console.log('PrayerTimes: Exact cache hit (memory)');
      return prayerTimesCache[exactCacheKey];
    }

    // 2. Try fuzzy match (smart caching)
    const cached = findCachedPrayerTimes(latitude, longitude, method, targetDate);
    if (cached) {
      // Store under exact key for next time
      prayerTimesCache[exactCacheKey] = cached;
      return cached;
    }

    const [year, month, day] = targetDate.split('-');
    const methodValue = CALCULATION_METHODS[method].value;
    
    const url = `${ALADHAN_API_BASE}/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${methodValue}`;
    
    // 3. Fetch from API with timeout and retry
    let response: Response | null = null;
    let lastError: unknown = null;
    const maxRetries = 1;
    const timeoutMs = 5000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`PrayerTimes: Fetching API (attempt ${attempt + 1}/${maxRetries + 1})`, url);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.warn(`PrayerTimes: Request timed out (attempt ${attempt + 1})`);
            controller.abort();
        }, timeoutMs);

        try {
          response = await fetch(url, { signal: controller.signal });
        } finally {
          clearTimeout(timeoutId);
        }

        if (response.ok) {
            console.log('PrayerTimes: API success');
            break;
        }

        console.warn(`PrayerTimes: API returned status ${response.status}`);
        // Don't retry client errors (4xx) except maybe 429
        if (response.status >= 400 && response.status < 500 && response.status !== 429) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        throw new Error(`API request failed with status ${response.status}`);
      } catch (err) {
        lastError = err;
        console.error(`PrayerTimes: Attempt ${attempt + 1} failed`, err);
        if (attempt === maxRetries) break;
        // Wait 1s before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    if (!response || !response.ok) {
      console.error('PrayerTimes: All retries failed', lastError);
      throw lastError || new Error('Failed to fetch prayer times');
    }
    
    const data = await response.json();
    
    if (data.code !== 200 || data.status !== 'OK') {
      throw new Error('Invalid API response');
    }
    
    const timings = data.data.timings;
    
    const extractTime = (timeStr: string): string => {
      return timeStr.split(' ')[0];
    };
    
    const result: PrayerTimes = {
      fajr: extractTime(timings.Fajr),
      sunrise: extractTime(timings.Sunrise),
      dhuhr: extractTime(timings.Dhuhr),
      asr: extractTime(timings.Asr),
      maghrib: extractTime(timings.Maghrib),
      isha: extractTime(timings.Isha),
      date: targetDate,
    };

    // Store in memory and persist to disk
    // We store using the EXACT requested coordinates to ensure cache hits next time
    // even if we used fuzzy logic to find a similar one earlier.
    prayerTimesCache[exactCacheKey] = result;

    // Also persist to localStorage
    const storageKey = getStorageKey(latitude, longitude, method, targetDate);
    setPersistedPrayerTimes(storageKey, result);

    return result;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

export async function getCurrentLocation(): Promise<Location | null> {
  console.log('PrayerTimes: Getting current location...');
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      console.warn('PrayerTimes: Geolocation not supported');
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        console.log('PrayerTimes: Got coordinates', position.coords);
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        // Try to get city/country using reverse geocoding
        try {
          console.log('PrayerTimes: Starting reverse geocoding');
          // Add timeout for reverse geocoding too
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3000);

          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          const data = await response.json();
          if (data.address) {
            location.city = data.address.city || data.address.town || data.address.village;
            location.country = data.address.country;
            console.log('PrayerTimes: Reverse geocoding success', { city: location.city, country: location.country });
          }
        } catch (err) {
          console.warn('PrayerTimes: Reverse geocoding failed', err);
          // Ignore geocoding errors
        }
        
        resolve(location);
      },
      (err) => {
        console.error('PrayerTimes: Geolocation error', err);
        resolve(null);
      },
      { enableHighAccuracy: false, timeout: 10000 }
    );
  });
}

export function getIftarTime(prayerTimes: PrayerTimes): string {
  return prayerTimes.maghrib;
}

export function getSuhoorEndTime(prayerTimes: PrayerTimes): string {
  return prayerTimes.fajr;
}

export function getRecommendedSuhoorTime(prayerTimes: PrayerTimes, minutesBefore: number = 10): string {
  const [hours, minutes] = prayerTimes.fajr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes - minutesBefore;
  const adjustedHours = Math.floor(totalMinutes / 60);
  const adjustedMinutes = totalMinutes % 60;
  return `${adjustedHours.toString().padStart(2, '0')}:${adjustedMinutes.toString().padStart(2, '0')}`;
}

export function isDuringFastingHours(prayerTimes: PrayerTimes): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [fajrHours, fajrMins] = prayerTimes.fajr.split(':').map(Number);
  const fajrMinutes = fajrHours * 60 + fajrMins;
  
  const [maghribHours, maghribMins] = prayerTimes.maghrib.split(':').map(Number);
  const maghribMinutes = maghribHours * 60 + maghribMins;
  
  return currentMinutes >= fajrMinutes && currentMinutes < maghribMinutes;
}

export function getTimeUntilIftar(prayerTimes: PrayerTimes): { hours: number; minutes: number } | null {
  if (!isDuringFastingHours(prayerTimes)) {
    return null;
  }
  
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [maghribHours, maghribMins] = prayerTimes.maghrib.split(':').map(Number);
  const maghribMinutes = maghribHours * 60 + maghribMins;
  
  const diff = maghribMinutes - currentMinutes;
  
  return {
    hours: Math.floor(diff / 60),
    minutes: diff % 60,
  };
}

export function getTimeUntilSuhoorEnds(prayerTimes: PrayerTimes): { hours: number; minutes: number } | null {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [fajrHours, fajrMins] = prayerTimes.fajr.split(':').map(Number);
  const fajrMinutes = fajrHours * 60 + fajrMins;
  
  if (currentMinutes >= fajrMinutes) {
    return null;
  }
  
  const diff = fajrMinutes - currentMinutes;
  
  return {
    hours: Math.floor(diff / 60),
    minutes: diff % 60,
  };
}

import type { PrayerTimes, Location, CalculationMethod } from '../types/index.ts';
import { ALADHAN_API_BASE, CALCULATION_METHODS } from './constants.ts';
import { getCurrentDate } from './helpers.ts';

const PRAYER_TIMES_STORAGE_PREFIX = 'ramadan_prayer_times_';

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

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  method: CalculationMethod = 'MuslimWorldLeague',
  date?: string
): Promise<PrayerTimes | null> {
  try {
    const targetDate = date || getCurrentDate();

    // Create a cache key based on parameters
    const cacheKey = `${latitude.toFixed(4)}-${longitude.toFixed(4)}-${method}-${targetDate}`;

    // 1. Check in-memory cache
    if (prayerTimesCache[cacheKey]) {
      return prayerTimesCache[cacheKey];
    }

    // 2. Check persisted cache (localStorage)
    const storageKey = getStorageKey(latitude, longitude, method, targetDate);
    const persisted = getPersistedPrayerTimes(storageKey);
    if (persisted) {
      prayerTimesCache[cacheKey] = persisted;
      return persisted;
    }

    const [year, month, day] = targetDate.split('-');
    const methodValue = CALCULATION_METHODS[method].value;
    
    const url = `${ALADHAN_API_BASE}/timings/${day}-${month}-${year}?latitude=${latitude}&longitude=${longitude}&method=${methodValue}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
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

    // Store in memory and persist to disk for fast cold-start
    prayerTimesCache[cacheKey] = result;
    setPersistedPrayerTimes(storageKey, result);

    return result;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

export async function getCurrentLocation(): Promise<Location | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location: Location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        // Try to get city/country using reverse geocoding
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${location.latitude}&lon=${location.longitude}&format=json`
          );
          const data = await response.json();
          if (data.address) {
            location.city = data.address.city || data.address.town || data.address.village;
            location.country = data.address.country;
          }
        } catch {
          // Ignore geocoding errors
        }
        
        resolve(location);
      },
      () => {
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

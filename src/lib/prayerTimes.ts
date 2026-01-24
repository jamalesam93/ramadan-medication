import { PrayerTimes, Location, CalculationMethod } from '@/types';
import { ALADHAN_API_BASE, CALCULATION_METHODS } from './constants';
import { getCurrentDate } from './helpers';

export async function fetchPrayerTimes(
  latitude: number,
  longitude: number,
  method: CalculationMethod = 'MuslimWorldLeague',
  date?: string
): Promise<PrayerTimes | null> {
  try {
    const targetDate = date || getCurrentDate();
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
    
    return {
      fajr: extractTime(timings.Fajr),
      sunrise: extractTime(timings.Sunrise),
      dhuhr: extractTime(timings.Dhuhr),
      asr: extractTime(timings.Asr),
      maghrib: extractTime(timings.Maghrib),
      isha: extractTime(timings.Isha),
      date: targetDate,
    };
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

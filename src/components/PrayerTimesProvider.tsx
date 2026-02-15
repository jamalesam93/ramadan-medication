'use client';

import { useEffect } from 'react';
import { useSettingsStore } from '@/stores/settingsStore';
import { useMedicationStore } from '@/stores/medicationStore';
import { fetchPrayerTimes } from '@/lib/prayerTimes';
import { getCurrentDate } from '@/lib/helpers';

/**
 * Fetches prayer times as early as possible when location and Ramadan mode are set.
 * Stores result in medication store so Home and other pages can use it without re-fetching.
 * Prefetches tomorrow's times in background for faster next-day load.
 */
export function PrayerTimesProvider({ children }: { children: React.ReactNode }) {
  const { location, isRamadanMode, calculationMethod } = useSettingsStore();
  const setPrayerTimes = useMedicationStore((s) => s.setPrayerTimes);
  const setPrayerTimesLoading = useMedicationStore((s) => s.setPrayerTimesLoading);

  useEffect(() => {
    console.log('PrayerTimesProvider: Effect triggered', { location, isRamadanMode });

    if (!isRamadanMode) {
      console.log('PrayerTimesProvider: Ramadan mode disabled');
      setPrayerTimes(null);
      setPrayerTimesLoading(false);
      return;
    }

    if (!location) {
        console.log('PrayerTimesProvider: Location not set');
        // If we expect a location but don't have it, we are not loading prayer times *yet*,
        // or we are waiting for user input. For the purpose of "loading prayer times",
        // we can say we are done (result is null).
        // However, the Home page logic "isLoading = isRamadanMode && !!location && prayerTimes === null"
        // handles the "no location" case separately (showing the location prompt).
        setPrayerTimes(null);
        setPrayerTimesLoading(false);
        return;
    }

    console.log('PrayerTimesProvider: Starting fetch');
    setPrayerTimesLoading(true);
    let cancelled = false;

    fetchPrayerTimes(
      location.latitude,
      location.longitude,
      calculationMethod
    ).then((times) => {
      console.log('PrayerTimesProvider: Fetch complete', { success: !!times, cancelled });
      if (!cancelled) {
        setPrayerTimes(times); // This also sets isPrayerTimesLoading to false in the store
      }
      // Prefetch tomorrow's times for faster next-day load
      if (!cancelled && times) {
        const today = getCurrentDate();
        const [y, m, d] = today.split('-').map(Number);
        const tomorrow = new Date(y, m - 1, d + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];
        fetchPrayerTimes(
          location.latitude,
          location.longitude,
          calculationMethod,
          tomorrowStr
        ).catch(() => {});
      }
    }).catch(err => {
        console.error('PrayerTimesProvider: Fetch failed', err);
        if (!cancelled) {
            setPrayerTimes(null); // Ensure loading state is cleared even on error
            setPrayerTimesLoading(false);
        }
    });

    return () => {
      cancelled = true;
    };
  }, [location, isRamadanMode, calculationMethod, setPrayerTimes, setPrayerTimesLoading]);

  return <>{children}</>;
}

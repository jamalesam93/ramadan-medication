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

  useEffect(() => {
    if (!isRamadanMode || !location) {
      setPrayerTimes(null);
      return;
    }

    let cancelled = false;
    fetchPrayerTimes(
      location.latitude,
      location.longitude,
      calculationMethod
    ).then((times) => {
      if (!cancelled && times) setPrayerTimes(times);
      // Prefetch tomorrow's times for faster next-day load
      if (!cancelled) {
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
    });

    return () => {
      cancelled = true;
    };
  }, [location, isRamadanMode, calculationMethod, setPrayerTimes]);

  return <>{children}</>;
}

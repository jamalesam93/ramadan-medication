'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useMedicationStore } from '@/stores/medicationStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { fetchPrayerTimes } from '@/lib/prayerTimes';
import { generateDosesForDate } from '@/lib/doseMapper';
import { getCurrentDate } from '@/lib/helpers';
import { PrayerTimeBar, DoseCard, CountdownTimer } from '@/components';
import { PrayerTimes, ScheduledDose, Medication } from '@/types';
import { Pill, MapPin, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const { t, isRTL } = useTranslation();
  const { medications, doses, setDoses, updateDoseStatus, loadMedications, loadDoses } = useMedicationStore();
  const { location, isRamadanMode } = useSettingsStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadMedications();
    loadDoses();
  }, [loadMedications, loadDoses]);

  useEffect(() => {
    const loadPrayerTimes = async () => {
      // Only fetch prayer times if Ramadan mode is enabled and location is set
      if (!isRamadanMode || !location) {
        setIsLoading(false);
        return;
      }

      try {
        const times = await fetchPrayerTimes(
          location.latitude,
          location.longitude
        );
        setPrayerTimes(times);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPrayerTimes();
  }, [location, isRamadanMode]);

  // Generate scheduled doses when prayer times and medications are available
  useEffect(() => {
    if (medications.length === 0) return;
    
    // Only require prayer times if Ramadan mode is enabled
    if (isRamadanMode && !prayerTimes) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = getCurrentDate();

    const existingTodaysDoses = doses.filter((dose) => {
      const doseDate = new Date(dose.scheduledTime);
      doseDate.setHours(0, 0, 0, 0);
      return doseDate.getTime() === today.getTime();
    });

    if (existingTodaysDoses.length === 0) {
      const newDoses: ScheduledDose[] = [];
      medications.forEach((med) => {
        const generatedDoses = generateDosesForDate(med, prayerTimes, todayStr, isRamadanMode);
        
        generatedDoses.forEach((dose, index) => {
          newDoses.push({
            id: `${med.id}-${todayStr}-${index}`,
            ...dose,
          });
        });
      });

      if (newDoses.length > 0) {
        setDoses(newDoses);
      }
    }
  }, [prayerTimes, medications, doses, setDoses, isRamadanMode]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (location) {
        const times = await fetchPrayerTimes(
          location.latitude,
          location.longitude
        );
        setPrayerTimes(times);
      }
      await loadMedications();
      await loadDoses();
    } finally {
      setIsRefreshing(false);
    }
  };

  // Get today's doses sorted by time
  const todaysDoses = useMemo(() => {
    const today = new Date();
    const todayDay = today.getDate();
    const todayMonth = today.getMonth();
    const todayYear = today.getFullYear();

    return doses
      .filter((dose) => {
        const doseDate = new Date(dose.scheduledTime);
        return (
          doseDate.getDate() === todayDay &&
          doseDate.getMonth() === todayMonth &&
          doseDate.getFullYear() === todayYear
        );
      })
      .sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
  }, [doses]);

  // Find next pending dose
  const nextDose = useMemo(() => {
    const nowIso = new Date().toISOString();
    return todaysDoses.find(
      (dose) => dose.status === 'pending' && dose.scheduledTime > nowIso
    );
  }, [todaysDoses]);

  const getMedicationForDose = (dose: ScheduledDose): Medication | undefined => {
    return medications.find((med) => med.id === dose.medicationId);
  };

  // Stats
  const { completedCount, pendingCount, missedCount } = useMemo(() => {
    return {
      completedCount: todaysDoses.filter((d) => d.status === 'taken').length,
      pendingCount: todaysDoses.filter((d) => d.status === 'pending').length,
      missedCount: todaysDoses.filter((d) => d.status === 'missed').length,
    };
  }, [todaysDoses]);

  const nextDoseTargetTime = useMemo(() =>
    nextDose ? new Date(nextDose.scheduledTime) : null
  , [nextDose]);

  // Only require location if Ramadan mode is enabled
  if (isRamadanMode && !location) {
    return (
      <div className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{t.home.locationRequired}</h2>
            <p className="text-gray-500 mb-6">{t.home.couldNotDetermineLocation}</p>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              {t.nav.settings}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold text-gray-800">🌙 {t.home.title}</h1>
            <p className="text-gray-500">{t.home.subtitle}</p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Prayer Times Bar */}
        <PrayerTimeBar prayerTimes={prayerTimes} isLoading={isLoading} />

        {/* Stats */}
        {todaysDoses.length > 0 && (
          <div className={`grid grid-cols-3 gap-4 ${isRTL ? 'direction-rtl' : ''}`}>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{completedCount}</p>
              <p className="text-xs text-green-700">{t.home.completed}</p>
            </div>
            <div className="bg-amber-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
              <p className="text-xs text-amber-700">{t.home.pending}</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{missedCount}</p>
              <p className="text-xs text-red-700">{t.home.missed}</p>
            </div>
          </div>
        )}

        {/* Countdown to Next Dose */}
        {nextDose && (
          <CountdownTimer
            targetTime={nextDoseTargetTime}
            label={t.home.untilNextDose}
          />
        )}

        {/* Today's Schedule */}
        <div>
          <h2 className={`text-lg font-semibold text-gray-800 mb-4 ${isRTL ? 'text-right' : ''}`}>
            {t.home.todaySchedule}
          </h2>

          {medications.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">{t.home.noMedications}</h3>
              <Link
                href="/medications"
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Pill className="w-4 h-4" />
                {t.home.addFirstMedication}
              </Link>
            </div>
          ) : todaysDoses.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <p className="text-gray-500">{t.common.loading}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaysDoses.map((dose) => {
                const medication = getMedicationForDose(dose);
                if (!medication) return null;

                return (
                  <DoseCard
                    key={dose.id}
                    dose={dose}
                    medication={medication}
                    isNext={nextDose?.id === dose.id}
                    onMarkTaken={(id) => updateDoseStatus(id, 'taken')}
                    onSkip={(id) => updateDoseStatus(id, 'skipped')}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

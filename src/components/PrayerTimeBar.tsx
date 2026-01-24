'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Sun, Moon } from 'lucide-react';
import { PrayerTimes } from '@/types';
import { formatTime12h, parseTimeToDate } from '@/lib/helpers';

interface PrayerTimeBarProps {
  prayerTimes: PrayerTimes | null;
  isLoading?: boolean;
}

export function PrayerTimeBar({ prayerTimes, isLoading }: PrayerTimeBarProps) {
  const { t, isRTL } = useTranslation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-xl p-4 text-white">
        <div className="animate-pulse flex justify-around">
          <div className="h-12 w-24 bg-white/20 rounded"></div>
          <div className="h-12 w-24 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!prayerTimes) {
    return (
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-600 rounded-xl p-4 text-white text-center">
        <p>{t.prayer.loadingPrayerTimes}</p>
      </div>
    );
  }

  // Parse time strings to Date objects for today
  const iftarTime = parseTimeToDate(prayerTimes.maghrib);
  const suhoorEndTime = parseTimeToDate(prayerTimes.fajr);
  
  // Adjust suhoor end for next day if we're past fajr
  if (currentTime > suhoorEndTime) {
    suhoorEndTime.setDate(suhoorEndTime.getDate() + 1);
  }

  const isBeforeIftar = currentTime < iftarTime;
  const targetTime = isBeforeIftar ? iftarTime : suhoorEndTime;
  const targetLabel = isBeforeIftar ? t.prayer.untilIftar : t.prayer.untilSuhoorEnds;

  const timeDiff = targetTime.getTime() - currentTime.getTime();
  const hours = Math.floor(timeDiff / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return (
    <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 rounded-xl p-4 text-white shadow-lg">
      <div className={`flex justify-around items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Iftar */}
        <div className={`flex flex-col items-center ${isRTL ? 'flex-col' : ''}`}>
          <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Sun className="w-5 h-5 text-amber-300" />
            <span className="text-sm font-medium opacity-90">{t.prayer.iftar}</span>
          </div>
          <span className="text-lg font-bold">{formatTime12h(prayerTimes.maghrib)}</span>
        </div>

        {/* Countdown */}
        <div className="flex flex-col items-center px-4 border-x border-white/20">
          <span className="text-xs opacity-75 mb-1">{targetLabel}</span>
          <div className={`flex items-center gap-1 text-xl font-bold ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span>{String(hours).padStart(2, '0')}</span>
            <span className="animate-pulse">:</span>
            <span>{String(minutes).padStart(2, '0')}</span>
            <span className="animate-pulse">:</span>
            <span>{String(seconds).padStart(2, '0')}</span>
          </div>
        </div>

        {/* Suhoor */}
        <div className="flex flex-col items-center">
          <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Moon className="w-5 h-5 text-cyan-300" />
            <span className="text-sm font-medium opacity-90">{t.prayer.suhoorEnds}</span>
          </div>
          <span className="text-lg font-bold">{formatTime12h(prayerTimes.fajr)}</span>
        </div>
      </div>

      {/* Non-fasting hours indicator */}
      <div className="mt-3 pt-3 border-t border-white/20 text-center">
        <span className="text-xs opacity-75">{t.prayer.nonFastingHours}: </span>
        <span className="text-sm font-medium">
          {formatTime12h(prayerTimes.maghrib)} - {formatTime12h(prayerTimes.fajr)}
        </span>
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { Clock, CheckCircle } from 'lucide-react';

interface CountdownTimerProps {
  targetTime: Date | null;
  label?: string;
}

export function CountdownTimer({ targetTime, label }: CountdownTimerProps) {
  const { t, isRTL } = useTranslation();
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number } | null>(null);

  useEffect(() => {
    if (!targetTime) {
      setTimeLeft(null);
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = targetTime.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  if (!targetTime || !timeLeft) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 text-center border border-emerald-100">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-emerald-700">{t.home.allDone}</h3>
        <p className="text-sm text-gray-500">{t.home.noMoreDoses}</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border border-amber-200">
      <div className={`flex items-center gap-2 mb-3 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
        <Clock className="w-5 h-5 text-amber-600" />
        <span className="text-sm font-medium text-amber-700">
          {label || t.home.untilNextDose}
        </span>
      </div>

      <div className={`flex justify-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-800">
            {String(timeLeft.hours).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500">{t.time.hours}</span>
        </div>
        <span className="text-3xl font-bold text-gray-400">:</span>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-800">
            {String(timeLeft.minutes).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500">{t.time.minutes}</span>
        </div>
        <span className="text-3xl font-bold text-gray-400">:</span>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold text-gray-800">
            {String(timeLeft.seconds).padStart(2, '0')}
          </span>
          <span className="text-xs text-gray-500">{t.time.seconds}</span>
        </div>
      </div>
    </div>
  );
}

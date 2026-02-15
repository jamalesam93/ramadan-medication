'use client';

import { useEffect, useState, useMemo } from 'react';
import { useTranslation, useLanguage } from '@/contexts/LanguageContext';
import { useMedicationStore } from '@/stores/medicationStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { ChevronLeft, ChevronRight, Check, X, Clock } from 'lucide-react';
import { formatTime } from '@/lib/helpers';

export default function CalendarPage() {
  const { t, isRTL } = useTranslation();
  const { language } = useLanguage();
  const { medications, doses, loadMedications, loadDoses } = useMedicationStore();
  const { timeFormat } = useSettingsStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  useEffect(() => {
    loadMedications();
    loadDoses();
  }, [loadMedications, loadDoses]);

  const monthNames = useMemo(() => {
    if (language === 'ar') {
      return [
        t.months.january, t.months.february, t.months.march, t.months.april,
        t.months.may, t.months.june, t.months.july, t.months.august,
        t.months.september, t.months.october, t.months.november, t.months.december
      ];
    }
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  }, [language, t]);

  const dayNames = useMemo(() => {
    if (language === 'ar') {
      return [t.days.sundayShort, t.days.mondayShort, t.days.tuesdayShort, t.days.wednesdayShort, t.days.thursdayShort, t.days.fridayShort, t.days.saturdayShort];
    }
    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  }, [language, t]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days: (Date | null)[] = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getDosesForDate = (date: Date) => {
    return doses.filter((dose) => {
      const doseDate = new Date(dose.scheduledTime);
      return (
        doseDate.getDate() === date.getDate() &&
        doseDate.getMonth() === date.getMonth() &&
        doseDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const getDayStatus = (date: Date): 'all-taken' | 'has-missed' | 'pending' | 'none' => {
    const dayDoses = getDosesForDate(date);
    if (dayDoses.length === 0) return 'none';

    const hasMissed = dayDoses.some((d) => d.status === 'missed');
    if (hasMissed) return 'has-missed';

    const allTaken = dayDoses.every((d) => d.status === 'taken' || d.status === 'skipped');
    if (allTaken) return 'all-taken';

    return 'pending';
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const days = getDaysInMonth(currentDate);
  const selectedDayDoses = selectedDate ? getDosesForDate(selectedDate) : [];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className={isRTL ? 'text-right' : ''}>
          <h1 className="text-2xl font-bold text-gray-800">{t.calendar.title}</h1>
          <p className="text-gray-500">{t.calendar.subtitle}</p>
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          {/* Month Navigation */}
          <div className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <button
              onClick={isRTL ? goToNextMonth : goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={isRTL ? goToPreviousMonth : goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Day Headers */}
          <div className={`grid grid-cols-7 gap-1 mb-2 ${isRTL ? 'direction-rtl' : ''}`}>
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className={`grid grid-cols-7 gap-1 ${isRTL ? 'direction-rtl' : ''}`}>
            {days.map((date, index) => {
              if (!date) {
                return <div key={`empty-${index}`} className="aspect-square" />;
              }

              const status = getDayStatus(date);
              const today = isToday(date);
              const selected = isSelected(date);

              return (
                <button
                  key={date.toISOString()}
                  onClick={() => setSelectedDate(date)}
                  className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all relative ${
                    selected
                      ? 'bg-emerald-600 text-white'
                      : today
                      ? 'bg-emerald-50 text-emerald-700 font-semibold'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <span>{date.getDate()}</span>
                  {status !== 'none' && (
                    <div
                      className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                        selected
                          ? 'bg-white'
                          : status === 'all-taken'
                          ? 'bg-green-500'
                          : status === 'has-missed'
                          ? 'bg-red-500'
                          : 'bg-amber-500'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className={`flex justify-center gap-6 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-gray-600">{t.calendar.legend.taken}</span>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-gray-600">{t.calendar.legend.missed}</span>
          </div>
          <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-gray-600">{t.calendar.legend.pending}</span>
          </div>
        </div>

        {/* Selected Day Doses */}
        {selectedDate && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <h3 className={`font-semibold text-gray-800 mb-4 ${isRTL ? 'text-right' : ''}`}>
              {selectedDate.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </h3>

            {selectedDayDoses.length === 0 ? (
              <p className={`text-gray-500 text-center py-4 ${isRTL ? 'text-right' : ''}`}>
                {t.calendar.noDosesScheduled}
              </p>
            ) : (
              <div className="space-y-3">
                {selectedDayDoses
                  .sort((a, b) => new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime())
                  .map((dose) => {
                    const medication = medications.find((m) => m.id === dose.medicationId);
                    if (!medication) return null;

                    return (
                      <div
                        key={dose.id}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          dose.status === 'taken'
                            ? 'bg-green-50'
                            : dose.status === 'missed'
                            ? 'bg-red-50'
                            : 'bg-gray-50'
                        } ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          {dose.status === 'taken' ? (
                            <Check className="w-5 h-5 text-green-600" />
                          ) : dose.status === 'missed' ? (
                            <X className="w-5 h-5 text-red-600" />
                          ) : (
                            <Clock className="w-5 h-5 text-gray-400" />
                          )}
                          <div className={isRTL ? 'text-right' : ''}>
                            <p className="font-medium text-gray-800">{medication.name}</p>
                            <p className="text-sm text-gray-500">{medication.dosage}</p>
                          </div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {formatTime(new Date(dose.scheduledTime), isRTL, timeFormat)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useTranslation } from '@/contexts/LanguageContext';
import { Check, X, Clock, AlertCircle, Pill } from 'lucide-react';
import { ScheduledDose, Medication } from '@/types';
import { formatTime12h, formatTime } from '@/lib/helpers';
import { PILL_COLORS_ARRAY as PILL_COLORS } from '@/lib/constants';

interface DoseCardProps {
  dose: ScheduledDose;
  medication: Medication;
  onMarkTaken?: (doseId: string) => void;
  onSkip?: (doseId: string) => void;
  isNext?: boolean;
}

export function DoseCard({ dose, medication, onMarkTaken, onSkip, isNext }: DoseCardProps) {
  const { t, isRTL } = useTranslation();
  const scheduledTime = new Date(dose.scheduledTime);
  const now = new Date();
  const isPast = scheduledTime < now && dose.status === 'pending';

  const getStatusColor = () => {
    switch (dose.status) {
      case 'taken':
        return 'border-l-green-500 bg-green-50';
      case 'missed':
        return 'border-l-red-500 bg-red-50';
      case 'skipped':
        return 'border-l-gray-400 bg-gray-50';
      default:
        return isPast
          ? 'border-l-amber-500 bg-amber-50'
          : isNext
          ? 'border-l-emerald-600 bg-emerald-50'
          : 'border-l-gray-300 bg-white';
    }
  };

  const getStatusIcon = () => {
    switch (dose.status) {
      case 'taken':
        return <Check className="w-5 h-5 text-green-600" />;
      case 'missed':
        return <X className="w-5 h-5 text-red-600" />;
      case 'skipped':
        return <X className="w-5 h-5 text-gray-400" />;
      default:
        return isPast ? (
          <AlertCircle className="w-5 h-5 text-amber-600" />
        ) : (
          <Clock className="w-5 h-5 text-gray-400" />
        );
    }
  };

  const pillColor = medication.pillColor
    ? PILL_COLORS.find((c) => c.value === medication.pillColor)
    : null;

  return (
    <div
      className={`rounded-lg p-4 border-l-4 shadow-sm transition-all hover:shadow-md ${getStatusColor()}`}
    >
      <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Pill Icon */}
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: pillColor?.color || '#e0e0e0' }}
        >
          <Pill className={`w-6 h-6 ${pillColor?.color === '#FFFFFF' ? 'text-gray-600' : 'text-white'}`} />
        </div>

        {/* Details */}
        <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
          <div className={`flex items-center gap-2 mb-1 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            {isNext && dose.status === 'pending' && (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded">
                {t.doseStatus.nextDose}
              </span>
            )}
            <h3 className="font-semibold text-gray-800">{medication.name}</h3>
          </div>
          <p className="text-sm text-gray-600 mb-1">{medication.dosage}</p>
          <div className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
            <Clock className="w-4 h-4 text-gray-400" />
            <span className={isPast && dose.status === 'pending' ? 'text-amber-600 font-medium' : 'text-gray-500'}>
              {formatTime(scheduledTime)}
              {isPast && dose.status === 'pending' && ` (${t.doseStatus.overdue})`}
            </span>
          </div>
          {medication.notes && (
            <p className="text-xs text-gray-500 mt-1 italic">{medication.notes}</p>
          )}
        </div>

        {/* Status / Actions */}
        <div className={`flex flex-col items-center gap-2 ${isRTL ? 'order-first' : ''}`}>
          {getStatusIcon()}
          {dose.status === 'pending' && (
            <div className="flex flex-col gap-1">
              {onMarkTaken && (
                <button
                  onClick={() => onMarkTaken(dose.id)}
                  className="text-xs bg-emerald-500 text-white px-3 py-1 rounded-full hover:bg-emerald-600 transition-colors"
                >
                  {t.doseStatus.markTaken}
                </button>
              )}
              {onSkip && (
                <button
                  onClick={() => onSkip(dose.id)}
                  className="text-xs text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {t.doseStatus.skip}
                </button>
              )}
            </div>
          )}
          {dose.status !== 'pending' && (
            <span className="text-xs text-gray-500">
              {dose.status === 'taken' && t.doseStatus.taken}
              {dose.status === 'missed' && t.doseStatus.missed}
              {dose.status === 'skipped' && t.doseStatus.skipped}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

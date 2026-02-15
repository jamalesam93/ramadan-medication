import { Medication, ScheduledDose, PrayerTimes, MedicationFrequency, TimePreference } from '@/types';
import { parseTimeToDate, addMinutesToTime, subtractMinutesFromTime, timeToMinutes, minutesToTime } from './helpers';
import { getIftarTime, getRecommendedSuhoorTime } from './prayerTimes';

interface DoseMapping {
  times: string[];
  warnings: string[];
}

export function mapMedicationToRamadanSchedule(
  medication: Medication,
  prayerTimes: PrayerTimes
): DoseMapping {
  const iftarTime = getIftarTime(prayerTimes);
  const recommendedSuhoor = getRecommendedSuhoorTime(prayerTimes, 15);
  
  const warnings: string[] = [];
  let times: string[] = [];
  
  switch (medication.frequency) {
    case 'once':
      times = mapOnceDailyDose(medication.timePreference, iftarTime, recommendedSuhoor);
      break;
    case 'twice':
      times = mapTwiceDailyDose(medication.timePreference, iftarTime, recommendedSuhoor, medication.withFood);
      break;
    case 'thrice':
      const thriceResult = mapThriceDailyDose(iftarTime, recommendedSuhoor, medication.withFood);
      times = thriceResult.times;
      warnings.push(...thriceResult.warnings);
      break;
    case 'four_times':
      const fourResult = mapFourTimesDailyDose(iftarTime, recommendedSuhoor);
      times = fourResult.times;
      warnings.push(...fourResult.warnings);
      break;
    case 'custom':
      if (medication.customTimes && medication.customTimes.length > 0) {
        times = medication.customTimes;
      }
      break;
  }
  
  if (medication.withFood && times.length > 0) {
    warnings.push('This medication should be taken with food during Iftar or Suhoor.');
  }
  
  return { times, warnings };
}

function mapOnceDailyDose(
  timePreference: TimePreference,
  iftarTime: string,
  suhoorTime: string
): string[] {
  switch (timePreference) {
    case 'morning':
      return [suhoorTime];
    case 'evening':
      return [iftarTime];
    case 'with_food':
      return [iftarTime];
    case 'empty_stomach':
      return [subtractMinutesFromTime(suhoorTime, 60)];
    case 'any':
    default:
      return [iftarTime];
  }
}

export function mapTwiceDailyDose(
  timePreference: TimePreference,
  iftarTime: string,
  suhoorTime: string,
  withFood: boolean
): string[] {
  if (withFood || timePreference === 'with_food') {
    return [iftarTime, suhoorTime];
  }
  
  if (timePreference === 'empty_stomach') {
    return [
      addMinutesToTime(iftarTime, 120),
      subtractMinutesFromTime(suhoorTime, 60)
    ];
  }
  
  return [iftarTime, suhoorTime];
}

function mapThriceDailyDose(
  iftarTime: string,
  suhoorTime: string,
  withFood: boolean
): { times: string[]; warnings: string[] } {
  const warnings: string[] = [];
  
  const iftarMinutes = timeToMinutes(iftarTime);
  const suhoorMinutes = timeToMinutes(suhoorTime);
  
  let midnightMinutes: number;
  if (suhoorMinutes < iftarMinutes) {
    const totalMinutes = (24 * 60 - iftarMinutes) + suhoorMinutes;
    midnightMinutes = (iftarMinutes + Math.floor(totalMinutes / 2)) % (24 * 60);
  } else {
    midnightMinutes = Math.floor((iftarMinutes + suhoorMinutes) / 2);
  }
  
  const midnightTime = minutesToTime(midnightMinutes);
  
  warnings.push(
    '⚠️ Three doses in the non-fasting window may be challenging. Consult your doctor about adjustments.'
  );
  
  if (withFood) {
    return {
      times: [iftarTime, midnightTime, suhoorTime],
      warnings
    };
  }
  
  return {
    times: [iftarTime, midnightTime, suhoorTime],
    warnings
  };
}

function mapFourTimesDailyDose(
  iftarTime: string,
  suhoorTime: string
): { times: string[]; warnings: string[] } {
  const warnings: string[] = [];
  
  const iftarMinutes = timeToMinutes(iftarTime);
  const suhoorMinutes = timeToMinutes(suhoorTime);
  
  let totalWindow: number;
  if (suhoorMinutes < iftarMinutes) {
    totalWindow = (24 * 60 - iftarMinutes) + suhoorMinutes;
  } else {
    totalWindow = suhoorMinutes - iftarMinutes;
  }
  
  warnings.push(
    '⚠️ CRITICAL: Four doses in the non-fasting window is very difficult. You MUST consult your doctor.'
  );
  
  const interval = Math.floor(totalWindow / 4);
  const dose1 = iftarTime;
  const dose2 = minutesToTime((iftarMinutes + interval) % (24 * 60));
  const dose3 = minutesToTime((iftarMinutes + interval * 2) % (24 * 60));
  const dose4 = minutesToTime((iftarMinutes + interval * 3) % (24 * 60));
  
  return {
    times: [dose1, dose2, dose3, dose4],
    warnings
  };
}

export function generateDosesForDate(
  medication: Medication,
  prayerTimes: PrayerTimes,
  date: string
): Omit<ScheduledDose, 'id'>[] {
  const mapping = mapMedicationToRamadanSchedule(medication, prayerTimes);
  
  return mapping.times.map(time => ({
    medicationId: medication.id,
    scheduledTime: parseTimeToDate(time, date).toISOString(),
    status: 'pending' as const,
    date,
  }));
}

export function generateAllDosesForDate(
  medications: Medication[],
  prayerTimes: PrayerTimes,
  date: string
): Omit<ScheduledDose, 'id'>[] {
  const allDoses: Omit<ScheduledDose, 'id'>[] = [];
  
  for (const medication of medications) {
    const doses = generateDosesForDate(medication, prayerTimes, date);
    allDoses.push(...doses);
  }
  
  return allDoses.sort((a, b) => 
    new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
  );
}

export function getMedicationWarnings(
  medication: Medication,
  prayerTimes: PrayerTimes
): string[] {
  const mapping = mapMedicationToRamadanSchedule(medication, prayerTimes);
  return mapping.warnings;
}

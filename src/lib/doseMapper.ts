import type { Medication, ScheduledDose, PrayerTimes, MedicationFrequency, TimePreference } from '../types/index.ts';
import { parseTimeToDate, addMinutesToTime, subtractMinutesFromTime, timeToMinutes, minutesToTime } from './helpers.ts';
import { getIftarTime, getRecommendedSuhoorTime } from './prayerTimes.ts';

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

function mapTwiceDailyDose(
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

// Non-Ramadan scheduling function
export function mapMedicationToStandardSchedule(
  medication: Medication
): DoseMapping {
  const warnings: string[] = [];
  let times: string[] = [];
  
  switch (medication.frequency) {
    case 'once':
      times = mapOnceDailyStandard(medication.timePreference);
      break;
    case 'twice':
      times = mapTwiceDailyStandard(medication.timePreference, medication.withFood);
      break;
    case 'thrice':
      times = mapThriceDailyStandard(medication.timePreference, medication.withFood);
      break;
    case 'four_times':
      times = mapFourTimesDailyStandard(medication.timePreference, medication.withFood);
      break;
    case 'custom':
      if (medication.customTimes && medication.customTimes.length > 0) {
        times = medication.customTimes;
      }
      break;
  }
  
  if (medication.withFood && times.length > 0) {
    warnings.push('This medication should be taken with food.');
  }
  
  return { times, warnings };
}

// Standard scheduling functions
function mapOnceDailyStandard(timePreference: TimePreference): string[] {
  switch (timePreference) {
    case 'morning':
      return ['08:00'];
    case 'evening':
      return ['20:00'];
    case 'with_food':
      return ['12:00'];
    case 'empty_stomach':
      return ['07:00'];
    case 'any':
    default:
      return ['09:00'];
  }
}

function mapTwiceDailyStandard(timePreference: TimePreference, withFood: boolean): string[] {
  if (withFood || timePreference === 'with_food') {
    return ['08:00', '20:00'];
  }
  
  if (timePreference === 'empty_stomach') {
    return ['07:00', '19:00'];
  }
  
  if (timePreference === 'morning') {
    return ['08:00', '14:00'];
  }
  
  if (timePreference === 'evening') {
    return ['14:00', '20:00'];
  }
  
  return ['09:00', '21:00'];
}

function mapThriceDailyStandard(timePreference: TimePreference, withFood: boolean): string[] {
  if (withFood || timePreference === 'with_food') {
    return ['08:00', '14:00', '20:00'];
  }
  
  if (timePreference === 'empty_stomach') {
    return ['07:00', '13:00', '19:00'];
  }
  
  return ['08:00', '14:00', '20:00'];
}

function mapFourTimesDailyStandard(timePreference: TimePreference, withFood: boolean): string[] {
  if (withFood || timePreference === 'with_food') {
    return ['08:00', '12:00', '16:00', '20:00'];
  }
  
  if (timePreference === 'empty_stomach') {
    return ['07:00', '11:00', '15:00', '19:00'];
  }
  
  return ['08:00', '12:00', '16:00', '20:00'];
}

export function generateDosesForDate(
  medication: Medication,
  prayerTimes: PrayerTimes | null,
  date: string,
  isRamadanMode: boolean = true
): Omit<ScheduledDose, 'id'>[] {
  let mapping: DoseMapping;
  
  if (isRamadanMode && prayerTimes) {
    mapping = mapMedicationToRamadanSchedule(medication, prayerTimes);
  } else {
    mapping = mapMedicationToStandardSchedule(medication);
  }
  
  return mapping.times.map(time => ({
    medicationId: medication.id,
    scheduledTime: parseTimeToDate(time, date).toISOString(),
    status: 'pending' as const,
    date,
  }));
}

export function generateAllDosesForDate(
  medications: Medication[],
  prayerTimes: PrayerTimes | null,
  date: string,
  isRamadanMode: boolean = true
): Omit<ScheduledDose, 'id'>[] {
  const allDoses: Omit<ScheduledDose, 'id'>[] = [];
  
  for (const medication of medications) {
    const doses = generateDosesForDate(medication, prayerTimes, date, isRamadanMode);
    allDoses.push(...doses);
  }
  
  return allDoses.sort((a, b) => 
    new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
  );
}

export function getMedicationWarnings(
  medication: Medication,
  prayerTimes: PrayerTimes | null,
  isRamadanMode: boolean = true
): string[] {
  let mapping: DoseMapping;
  
  if (isRamadanMode && prayerTimes) {
    mapping = mapMedicationToRamadanSchedule(medication, prayerTimes);
  } else {
    mapping = mapMedicationToStandardSchedule(medication);
  }
  
  return mapping.warnings;
}

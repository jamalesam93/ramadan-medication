// Medication types
export type MedicationFrequency = 'once' | 'twice' | 'thrice' | 'four_times' | 'custom';
export type TimePreference = 'morning' | 'evening' | 'any' | 'with_food' | 'empty_stomach';
export type DoseStatus = 'pending' | 'taken' | 'missed' | 'skipped';
export type PillShape = 'round' | 'oval' | 'capsule' | 'square' | 'triangle' | 'other';
export type PillColor = 'white' | 'blue' | 'red' | 'yellow' | 'green' | 'orange' | 'pink' | 'purple' | 'brown' | 'other';

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: MedicationFrequency;
  timePreference: TimePreference;
  withFood: boolean;
  pillColor?: PillColor;
  pillShape?: PillShape;
  notes?: string;
  customTimes?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ScheduledDose {
  id: string;
  medicationId: string;
  scheduledTime: string;
  actualTime?: string;
  status: DoseStatus;
  date: string;
}

export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  date: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
}

export type CalculationMethod = 
  | 'MuslimWorldLeague'
  | 'Egyptian'
  | 'Karachi'
  | 'UmmAlQura'
  | 'Dubai'
  | 'MoonsightingCommittee'
  | 'NorthAmerica'
  | 'Kuwait'
  | 'Qatar'
  | 'Singapore'
  | 'Tehran'
  | 'Turkey';

export interface AppSettings {
  calculationMethod: CalculationMethod;
  preAlertMinutes: number;
  suhoorAlertMinutes: number;
  notificationsEnabled: boolean;
  location: Location | null;
  isRamadanMode: boolean;
}

export interface TodaySchedule {
  medication: Medication;
  dose: ScheduledDose;
}

export interface DashboardData {
  todaysDoses: TodaySchedule[];
  nextDose: TodaySchedule | null;
  prayerTimes: PrayerTimes | null;
  completedCount: number;
  pendingCount: number;
  missedCount: number;
}

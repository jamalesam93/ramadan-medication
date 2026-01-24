import { CalculationMethod, PillColor, PillShape } from '@/types';

export const APP_NAME = 'Ramadan Medication';
export const ALADHAN_API_BASE = 'https://api.aladhan.com/v1';

export const CALCULATION_METHODS: Record<CalculationMethod, { name: string; value: number }> = {
  MuslimWorldLeague: { name: 'Muslim World League', value: 3 },
  Egyptian: { name: 'Egyptian General Authority', value: 5 },
  Karachi: { name: 'University of Islamic Sciences, Karachi', value: 1 },
  UmmAlQura: { name: 'Umm Al-Qura University, Makkah', value: 4 },
  Dubai: { name: 'Dubai', value: 12 },
  MoonsightingCommittee: { name: 'Moonsighting Committee', value: 15 },
  NorthAmerica: { name: 'Islamic Society of North America', value: 2 },
  Kuwait: { name: 'Kuwait', value: 9 },
  Qatar: { name: 'Qatar', value: 10 },
  Singapore: { name: 'Singapore', value: 11 },
  Tehran: { name: 'Tehran', value: 7 },
  Turkey: { name: 'Turkey', value: 13 },
};

export const DEFAULT_SETTINGS = {
  calculationMethod: 'MuslimWorldLeague' as CalculationMethod,
  preAlertMinutes: 15,
  suhoorAlertMinutes: 30,
  notificationsEnabled: true,
  location: null,
  isRamadanMode: true,
};

export const PILL_COLORS: Record<PillColor, { name: string; hex: string; tailwind: string }> = {
  white: { name: 'White', hex: '#FFFFFF', tailwind: 'bg-white border border-gray-300' },
  blue: { name: 'Blue', hex: '#2196F3', tailwind: 'bg-blue-500' },
  red: { name: 'Red', hex: '#F44336', tailwind: 'bg-red-500' },
  yellow: { name: 'Yellow', hex: '#FFEB3B', tailwind: 'bg-yellow-400' },
  green: { name: 'Green', hex: '#4CAF50', tailwind: 'bg-green-500' },
  orange: { name: 'Orange', hex: '#FF9800', tailwind: 'bg-orange-500' },
  pink: { name: 'Pink', hex: '#E91E63', tailwind: 'bg-pink-500' },
  purple: { name: 'Purple', hex: '#9C27B0', tailwind: 'bg-purple-500' },
  brown: { name: 'Brown', hex: '#795548', tailwind: 'bg-amber-800' },
  other: { name: 'Other', hex: '#9E9E9E', tailwind: 'bg-gray-400' },
};

export const PILL_SHAPES: Record<PillShape, { name: string }> = {
  round: { name: 'Round' },
  oval: { name: 'Oval' },
  capsule: { name: 'Capsule' },
  square: { name: 'Square' },
  triangle: { name: 'Triangle' },
  other: { name: 'Other' },
};

// Array format for UI components
export const PILL_COLORS_ARRAY = [
  { value: 'white' as PillColor, color: '#FFFFFF' },
  { value: 'blue' as PillColor, color: '#2196F3' },
  { value: 'red' as PillColor, color: '#F44336' },
  { value: 'yellow' as PillColor, color: '#FFEB3B' },
  { value: 'green' as PillColor, color: '#4CAF50' },
  { value: 'orange' as PillColor, color: '#FF9800' },
  { value: 'pink' as PillColor, color: '#E91E63' },
  { value: 'purple' as PillColor, color: '#9C27B0' },
  { value: 'brown' as PillColor, color: '#795548' },
  { value: 'other' as PillColor, color: '#9E9E9E' },
];

export const PILL_SHAPES_ARRAY = [
  { value: 'round' as PillShape },
  { value: 'oval' as PillShape },
  { value: 'capsule' as PillShape },
  { value: 'square' as PillShape },
  { value: 'triangle' as PillShape },
  { value: 'other' as PillShape },
];

// For settings UI
export const PRAYER_CALCULATION_METHODS = [
  { value: 3, label: 'MuslimWorldLeague' },
  { value: 5, label: 'Egyptian' },
  { value: 1, label: 'Karachi' },
  { value: 4, label: 'UmmAlQura' },
  { value: 12, label: 'Dubai' },
  { value: 15, label: 'MoonsightingCommittee' },
  { value: 2, label: 'NorthAmerica' },
  { value: 9, label: 'Kuwait' },
  { value: 10, label: 'Qatar' },
  { value: 11, label: 'Singapore' },
  { value: 7, label: 'Tehran' },
  { value: 13, label: 'Turkey' },
];

export const FREQUENCY_OPTIONS = [
  { value: 'once', label: 'Once daily', description: 'Take once per day' },
  { value: 'twice', label: 'Twice daily', description: 'Take twice per day' },
  { value: 'thrice', label: 'Three times daily', description: 'Take three times per day' },
  { value: 'four_times', label: 'Four times daily', description: 'Take four times per day' },
] as const;

export const TIME_PREFERENCE_OPTIONS = [
  { value: 'morning', label: 'Morning', description: 'Prefer taking in the morning' },
  { value: 'evening', label: 'Evening', description: 'Prefer taking in the evening' },
  { value: 'any', label: 'Any time', description: 'No specific time preference' },
  { value: 'with_food', label: 'With food', description: 'Must be taken with meals' },
  { value: 'empty_stomach', label: 'Empty stomach', description: 'Must be taken on empty stomach' },
] as const;

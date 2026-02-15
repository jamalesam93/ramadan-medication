import { describe, it } from 'node:test';
import assert from 'node:assert';
import { mapMedicationToRamadanSchedule } from './doseMapper.ts';
import type { Medication, PrayerTimes } from '../types/index.ts';

describe('Dose Mapper', () => {
  const mockPrayerTimes: PrayerTimes = {
    fajr: '04:30',
    sunrise: '06:00',
    dhuhr: '12:30',
    asr: '16:00',
    maghrib: '18:30',
    isha: '20:00',
    date: '2024-03-15'
  };

  it('should map once daily dose to Iftar if preference is evening', () => {
    const medication: Medication = {
      id: '1',
      name: 'Test Med',
      dosage: '10mg',
      frequency: 'once',
      timePreference: 'evening',
      withFood: false,
      createdAt: '',
      updatedAt: ''
    };

    const result = mapMedicationToRamadanSchedule(medication, mockPrayerTimes);
    assert.deepStrictEqual(result.times, ['18:30']);
  });

  it('should map once daily dose to Suhoor if preference is morning', () => {
    const medication: Medication = {
      id: '1',
      name: 'Test Med',
      dosage: '10mg',
      frequency: 'once',
      timePreference: 'morning',
      withFood: false,
      createdAt: '',
      updatedAt: ''
    };

    const result = mapMedicationToRamadanSchedule(medication, mockPrayerTimes);
    // Suhoor recommended is Fajr - 15 mins = 04:15
    assert.deepStrictEqual(result.times, ['04:15']);
  });

  it('should map twice daily dose to Iftar and Suhoor', () => {
    const medication: Medication = {
      id: '1',
      name: 'Test Med',
      dosage: '10mg',
      frequency: 'twice',
      timePreference: 'any',
      withFood: false,
      createdAt: '',
      updatedAt: ''
    };

    const result = mapMedicationToRamadanSchedule(medication, mockPrayerTimes);
    assert.deepStrictEqual(result.times, ['18:30', '04:15']);
  });

  it('should warn about three times daily dose', () => {
    const medication: Medication = {
      id: '1',
      name: 'Test Med',
      dosage: '10mg',
      frequency: 'thrice',
      timePreference: 'any',
      withFood: false,
      createdAt: '',
      updatedAt: ''
    };

    const result = mapMedicationToRamadanSchedule(medication, mockPrayerTimes);
    assert.strictEqual(result.times.length, 3);
    assert.ok(result.warnings.length > 0);
  });
});

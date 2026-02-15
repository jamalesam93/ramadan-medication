import { Medication, ScheduledDose, DoseStatus } from '@/types';
import { generateId, getCurrentDate } from './helpers';
import { encrypt, decrypt } from './crypto';

const MEDICATIONS_KEY = 'ramadan_medications';
const DOSES_KEY = 'ramadan_doses';
const SETTINGS_KEY = 'ramadan-medication-settings';

// Generic helper for retrieving and decrypting data
async function getStoredData<T>(key: string): Promise<T[]> {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(key);
  if (!data) return [];

  try {
    // Try to decrypt first
    const decrypted = await decrypt(data);
    return JSON.parse(decrypted);
  } catch (e) {
    // Fallback for existing plaintext data or if it's the first time using the new key
    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error(`Failed to parse data for key ${key}:`, parseError);
      return [];
    }
  }
}

// Generic helper for encrypting and saving data
async function setStoredData<T>(key: string, data: T[]): Promise<void> {
  if (typeof window === 'undefined') return;
  try {
    const jsonString = JSON.stringify(data);
    const encrypted = await encrypt(jsonString);
    localStorage.setItem(key, encrypted);
  } catch (error) {
    console.error(`Failed to save data for key ${key}:`, error);
    // As a fallback, we could save as plaintext, but that defeats the purpose.
    // Given this is a security fix, we prefer failing over insecure storage.
  }
}

// Medications

export async function getAllMedications(): Promise<Medication[]> {
  return getStoredData<Medication>(MEDICATIONS_KEY);
}

export async function saveMedications(medications: Medication[]): Promise<void> {
  return setStoredData(MEDICATIONS_KEY, medications);
}

export async function createMedication(
  medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Medication> {
  const medications = await getAllMedications();
  const now = new Date().toISOString();
  
  const newMedication: Medication = {
    ...medication,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  
  medications.push(newMedication);
  await saveMedications(medications);
  
  return newMedication;
}

export async function getMedicationById(id: string): Promise<Medication | null> {
  const medications = await getAllMedications();
  return medications.find(m => m.id === id) || null;
}

export async function updateMedication(
  id: string,
  updates: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Medication | null> {
  const medications = await getAllMedications();
  const index = medications.findIndex(m => m.id === id);
  
  if (index === -1) return null;
  
  medications[index] = {
    ...medications[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await saveMedications(medications);
  return medications[index];
}

export async function deleteMedication(id: string): Promise<boolean> {
  const medications = await getAllMedications();
  const filtered = medications.filter(m => m.id !== id);
  
  if (filtered.length === medications.length) return false;
  
  await saveMedications(filtered);
  
  // Also delete associated doses
  const doses = await getAllDoses();
  const filteredDoses = doses.filter(d => d.medicationId !== id);
  await saveDoses(filteredDoses);
  
  return true;
}

// Doses

export async function getAllDoses(): Promise<ScheduledDose[]> {
  return getStoredData<ScheduledDose>(DOSES_KEY);
}

export async function saveDoses(doses: ScheduledDose[]): Promise<void> {
  return setStoredData(DOSES_KEY, doses);
}

export async function getDosesByDate(date: string): Promise<ScheduledDose[]> {
  const doses = await getAllDoses();
  return doses.filter(d => d.date === date).sort((a, b) => 
    new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
  );
}

export async function getTodaysDoses(): Promise<ScheduledDose[]> {
  return getDosesByDate(getCurrentDate());
}

export async function createScheduledDose(dose: Omit<ScheduledDose, 'id'>): Promise<ScheduledDose> {
  const doses = await getAllDoses();
  
  const newDose: ScheduledDose = {
    ...dose,
    id: generateId(),
  };
  
  doses.push(newDose);
  await saveDoses(doses);
  
  return newDose;
}

export async function updateDoseStatus(
  id: string,
  status: DoseStatus,
  actualTime?: string
): Promise<ScheduledDose | null> {
  const doses = await getAllDoses();
  const index = doses.findIndex(d => d.id === id);
  
  if (index === -1) return null;
  
  doses[index] = {
    ...doses[index],
    status,
    actualTime,
  };
  
  await saveDoses(doses);
  return doses[index];
}

export async function deleteDosesByDate(date: string): Promise<void> {
  const doses = await getAllDoses();
  const filtered = doses.filter(d => d.date !== date);
  await saveDoses(filtered);
}

export async function dosesExistForDate(date: string): Promise<boolean> {
  const doses = await getDosesByDate(date);
  return doses.length > 0;
}

export async function getDoseStatistics(startDate: string, endDate: string): Promise<{
  taken: number;
  missed: number;
  pending: number;
  skipped: number;
}> {
  const allDoses = await getAllDoses();
  const doses = allDoses.filter(d => d.date >= startDate && d.date <= endDate);
  
  return {
    taken: doses.filter(d => d.status === 'taken').length,
    missed: doses.filter(d => d.status === 'missed').length,
    pending: doses.filter(d => d.status === 'pending').length,
    skipped: doses.filter(d => d.status === 'skipped').length,
  };
}

// Data Management

export function exportData(): string {
  if (typeof window === 'undefined') return '{}';

  const data: Record<string, any> = {};
  const keys = [MEDICATIONS_KEY, DOSES_KEY, SETTINGS_KEY];

  keys.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      try {
        data[key] = JSON.parse(value);
      } catch (e) {
        data[key] = value;
      }
    }
  });

  return JSON.stringify(data, null, 2);
}

export function importData(jsonString: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const data = JSON.parse(jsonString);
    if (!data || typeof data !== 'object') return false;

    const validKeys = [MEDICATIONS_KEY, DOSES_KEY, SETTINGS_KEY];
    let importedCount = 0;

    Object.keys(data).forEach(key => {
      if (validKeys.includes(key)) {
        const value = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
        localStorage.setItem(key, value);
        importedCount++;
      }
    });

    return importedCount > 0;
  } catch (error) {
    console.error('Failed to import data:', error);
    return false;
  }
}

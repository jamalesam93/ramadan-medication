import { Medication, ScheduledDose, DoseStatus } from '@/types';
import { generateId, getCurrentDate } from './helpers';

const MEDICATIONS_KEY = 'ramadan_medications';
const DOSES_KEY = 'ramadan_doses';

// Medications

export function getAllMedications(): Medication[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MEDICATIONS_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveMedications(medications: Medication[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(MEDICATIONS_KEY, JSON.stringify(medications));
}

export function createMedication(
  medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>
): Medication {
  const medications = getAllMedications();
  const now = new Date().toISOString();
  
  const newMedication: Medication = {
    ...medication,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
  
  medications.push(newMedication);
  saveMedications(medications);
  
  return newMedication;
}

export function getMedicationById(id: string): Medication | null {
  const medications = getAllMedications();
  return medications.find(m => m.id === id) || null;
}

export function updateMedication(
  id: string,
  updates: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>>
): Medication | null {
  const medications = getAllMedications();
  const index = medications.findIndex(m => m.id === id);
  
  if (index === -1) return null;
  
  medications[index] = {
    ...medications[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  saveMedications(medications);
  return medications[index];
}

export function deleteMedication(id: string): boolean {
  const medications = getAllMedications();
  const filtered = medications.filter(m => m.id !== id);
  
  if (filtered.length === medications.length) return false;
  
  saveMedications(filtered);
  
  // Also delete associated doses
  const doses = getAllDoses();
  const filteredDoses = doses.filter(d => d.medicationId !== id);
  saveDoses(filteredDoses);
  
  return true;
}

// Doses

export function getAllDoses(): ScheduledDose[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(DOSES_KEY);
  return data ? JSON.parse(data) : [];
}

export function saveDoses(doses: ScheduledDose[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DOSES_KEY, JSON.stringify(doses));
}

export function getDosesByDate(date: string): ScheduledDose[] {
  const doses = getAllDoses();
  return doses.filter(d => d.date === date).sort((a, b) => 
    new Date(a.scheduledTime).getTime() - new Date(b.scheduledTime).getTime()
  );
}

export function getTodaysDoses(): ScheduledDose[] {
  return getDosesByDate(getCurrentDate());
}

export function createScheduledDose(dose: Omit<ScheduledDose, 'id'>): ScheduledDose {
  const doses = getAllDoses();
  
  const newDose: ScheduledDose = {
    ...dose,
    id: generateId(),
  };
  
  doses.push(newDose);
  saveDoses(doses);
  
  return newDose;
}

export function updateDoseStatus(
  id: string,
  status: DoseStatus,
  actualTime?: string
): ScheduledDose | null {
  const doses = getAllDoses();
  const index = doses.findIndex(d => d.id === id);
  
  if (index === -1) return null;
  
  doses[index] = {
    ...doses[index],
    status,
    actualTime,
  };
  
  saveDoses(doses);
  return doses[index];
}

export function deleteDosesByDate(date: string): void {
  const doses = getAllDoses();
  const filtered = doses.filter(d => d.date !== date);
  saveDoses(filtered);
}

export function dosesExistForDate(date: string): boolean {
  const doses = getDosesByDate(date);
  return doses.length > 0;
}

export function getDoseStatistics(startDate: string, endDate: string): {
  taken: number;
  missed: number;
  pending: number;
  skipped: number;
} {
  const doses = getAllDoses().filter(d => d.date >= startDate && d.date <= endDate);
  
  return {
    taken: doses.filter(d => d.status === 'taken').length,
    missed: doses.filter(d => d.status === 'missed').length,
    pending: doses.filter(d => d.status === 'pending').length,
    skipped: doses.filter(d => d.status === 'skipped').length,
  };
}

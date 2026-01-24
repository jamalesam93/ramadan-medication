'use client';

import { create } from 'zustand';
import { Medication, ScheduledDose, PrayerTimes, DoseStatus, TodaySchedule } from '@/types';
import {
  getAllMedications,
  createMedication as storageCreateMedication,
  updateMedication as storageUpdateMedication,
  deleteMedication as storageDeleteMedication,
  getTodaysDoses,
  getDosesByDate,
  createScheduledDose,
  updateDoseStatus as storageUpdateDoseStatus,
  deleteDosesByDate,
  dosesExistForDate,
  getAllDoses,
  saveDoses,
} from '@/lib/storage';
import { generateAllDosesForDate } from '@/lib/doseMapper';
import { getCurrentDate } from '@/lib/helpers';

interface MedicationState {
  medications: Medication[];
  doses: ScheduledDose[];
  todaysDoses: ScheduledDose[];
  prayerTimes: PrayerTimes | null;
  isLoading: boolean;

  // Medication methods
  loadMedications: () => Promise<void>;
  addMedication: (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Medication>;
  updateMedication: (id: string, updates: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Medication | null>;
  deleteMedication: (id: string) => Promise<boolean>;
  clearMedications: () => void;
  
  // Dose methods
  loadDoses: () => Promise<void>;
  setDoses: (doses: ScheduledDose[]) => void;
  updateDoseStatus: (doseId: string, status: DoseStatus) => void;
  loadTodaysDoses: () => void;
  loadDosesForDate: (date: string) => ScheduledDose[];
  generateDoses: (date: string, prayerTimes: PrayerTimes) => void;
  
  // Prayer times
  setPrayerTimes: (prayerTimes: PrayerTimes | null) => void;
  
  // Dashboard
  getDashboardData: () => {
    todaysDoses: TodaySchedule[];
    nextDose: TodaySchedule | null;
    prayerTimes: PrayerTimes | null;
    completedCount: number;
    pendingCount: number;
    missedCount: number;
  };
}

export const useMedicationStore = create<MedicationState>((set, get) => ({
  medications: [],
  doses: [],
  todaysDoses: [],
  prayerTimes: null,
  isLoading: false,

  loadMedications: async () => {
    const medications = getAllMedications();
    set({ medications });
  },

  addMedication: async (medicationData) => {
    const newMedication = storageCreateMedication(medicationData);
    set((state) => ({
      medications: [...state.medications, newMedication],
    }));
    return newMedication;
  },

  updateMedication: async (id, updates) => {
    const updatedMedication = storageUpdateMedication(id, updates);
    if (updatedMedication) {
      set((state) => ({
        medications: state.medications.map((m) =>
          m.id === id ? updatedMedication : m
        ),
      }));
    }
    return updatedMedication;
  },

  deleteMedication: async (id) => {
    const success = storageDeleteMedication(id);
    if (success) {
      set((state) => ({
        medications: state.medications.filter((m) => m.id !== id),
        doses: state.doses.filter((d) => d.medicationId !== id),
        todaysDoses: state.todaysDoses.filter((d) => d.medicationId !== id),
      }));
    }
    return success;
  },

  clearMedications: () => {
    set({ medications: [], doses: [], todaysDoses: [] });
  },

  loadDoses: async () => {
    const doses = getAllDoses();
    set({ doses });
  },

  setDoses: (doses) => {
    saveDoses(doses);
    set({ doses });
  },

  updateDoseStatus: (doseId, status) => {
    const now = status === 'taken' ? new Date().toISOString() : undefined;
    storageUpdateDoseStatus(doseId, status, now);
    set((state) => ({
      doses: state.doses.map((d) =>
        d.id === doseId ? { ...d, status, actualTime: now } : d
      ),
      todaysDoses: state.todaysDoses.map((d) =>
        d.id === doseId ? { ...d, status, actualTime: now } : d
      ),
    }));
  },

  loadTodaysDoses: () => {
    const doses = getTodaysDoses();
    set({ todaysDoses: doses });
  },

  loadDosesForDate: (date) => {
    return getDosesByDate(date);
  },

  generateDoses: (date, prayerTimes) => {
    set({ isLoading: true });
    
    const { medications } = get();
    
    if (dosesExistForDate(date)) {
      deleteDosesByDate(date);
    }
    
    const dosesToCreate = generateAllDosesForDate(medications, prayerTimes, date);
    
    const createdDoses: ScheduledDose[] = [];
    for (const doseData of dosesToCreate) {
      const dose = createScheduledDose(doseData);
      createdDoses.push(dose);
    }
    
    if (date === getCurrentDate()) {
      set({ todaysDoses: createdDoses });
    }
    
    set({ isLoading: false });
  },

  setPrayerTimes: (prayerTimes) => {
    set({ prayerTimes });
  },

  getDashboardData: () => {
    const { medications, todaysDoses, prayerTimes } = get();
    
    const medicationMap = new Map(medications.map((m) => [m.id, m]));
    
    const todaysSchedule: TodaySchedule[] = todaysDoses
      .map((dose) => {
        const medication = medicationMap.get(dose.medicationId);
        if (!medication) return null;
        return { medication, dose };
      })
      .filter((item): item is TodaySchedule => item !== null);
    
    const now = new Date();
    const nextDose = todaysSchedule
      .filter((item) => item.dose.status === 'pending')
      .find((item) => new Date(item.dose.scheduledTime) > now) || null;
    
    const completedCount = todaysDoses.filter((d) => d.status === 'taken').length;
    const pendingCount = todaysDoses.filter((d) => d.status === 'pending').length;
    const missedCount = todaysDoses.filter((d) => d.status === 'missed').length;
    
    return {
      todaysDoses: todaysSchedule,
      nextDose,
      prayerTimes,
      completedCount,
      pendingCount,
      missedCount,
    };
  },
}));

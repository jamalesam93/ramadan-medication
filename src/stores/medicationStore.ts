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
  // New state to track if prayer times fetch has completed (success or fail)
  isPrayerTimesLoading: boolean;

  // Medication methods
  loadMedications: () => Promise<void>;
  addMedication: (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Medication>;
  updateMedication: (id: string, updates: Partial<Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<Medication | null>;
  deleteMedication: (id: string) => Promise<boolean>;
  clearMedications: () => void;
  
  // Dose methods
  loadDoses: () => Promise<void>;
  setDoses: (doses: ScheduledDose[]) => Promise<void>;
  updateDoseStatus: (doseId: string, status: DoseStatus) => Promise<void>;
  loadTodaysDoses: () => Promise<void>;
  loadDosesForDate: (date: string) => Promise<ScheduledDose[]>;
  generateDoses: (date: string, prayerTimes: PrayerTimes | null, isRamadanMode?: boolean) => Promise<void>;
  
  // Prayer times
  setPrayerTimes: (prayerTimes: PrayerTimes | null) => void;
  setPrayerTimesLoading: (loading: boolean) => void;
  
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
  isPrayerTimesLoading: true, // Start as loading until proven otherwise

  loadMedications: async () => {
    const medications = await getAllMedications();
    set({ medications });
  },

  addMedication: async (medicationData) => {
    const newMedication = await storageCreateMedication(medicationData);
    set((state) => ({
      medications: [...state.medications, newMedication],
    }));
    return newMedication;
  },

  updateMedication: async (id, updates) => {
    const updatedMedication = await storageUpdateMedication(id, updates);
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
    const success = await storageDeleteMedication(id);
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
    const doses = await getAllDoses();
    set({ doses });
  },

  setDoses: async (doses) => {
    // Optimistic: update UI immediately, persist in background
    set({ doses });
    saveDoses(doses).catch((err) =>
      console.error('Failed to persist doses:', err)
    );
  },

  updateDoseStatus: async (doseId, status) => {
    const now = status === 'taken' ? new Date().toISOString() : undefined;
    await storageUpdateDoseStatus(doseId, status, now);
    set((state) => ({
      doses: state.doses.map((d) =>
        d.id === doseId ? { ...d, status, actualTime: now } : d
      ),
      todaysDoses: state.todaysDoses.map((d) =>
        d.id === doseId ? { ...d, status, actualTime: now } : d
      ),
    }));
  },

  loadTodaysDoses: async () => {
    const doses = await getTodaysDoses();
    set({ todaysDoses: doses });
  },

  loadDosesForDate: async (date) => {
    return await getDosesByDate(date);
  },

  generateDoses: async (date, prayerTimes, isRamadanMode = true) => {
    set({ isLoading: true });
    
    const { medications } = get();
    
    if (await dosesExistForDate(date)) {
      await deleteDosesByDate(date);
    }
    
    const dosesToCreate = generateAllDosesForDate(medications, prayerTimes, date, isRamadanMode);
    
    const createdDoses: ScheduledDose[] = [];
    for (const doseData of dosesToCreate) {
      const dose = await createScheduledDose(doseData);
      createdDoses.push(dose);
    }
    
    if (date === getCurrentDate()) {
      set({ todaysDoses: createdDoses });
    }
    
    set({ isLoading: false });
  },

  setPrayerTimes: (prayerTimes) => {
    set({ prayerTimes, isPrayerTimesLoading: false });
  },

  setPrayerTimesLoading: (loading) => {
    set({ isPrayerTimesLoading: loading });
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

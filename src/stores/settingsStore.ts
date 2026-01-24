'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppSettings, Location, CalculationMethod } from '@/types';
import { DEFAULT_SETTINGS } from '@/lib/constants';

interface SettingsState extends AppSettings {
  setCalculationMethod: (method: CalculationMethod) => void;
  setPreAlertMinutes: (minutes: number) => void;
  setSuhoorAlertMinutes: (minutes: number) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  setLocation: (location: Location | null) => void;
  setIsRamadanMode: (enabled: boolean) => void;
  resetSettings: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,

      setCalculationMethod: (method) => set({ calculationMethod: method }),
      setPreAlertMinutes: (minutes) => set({ preAlertMinutes: minutes }),
      setSuhoorAlertMinutes: (minutes) => set({ suhoorAlertMinutes: minutes }),
      setNotificationsEnabled: (enabled) => set({ notificationsEnabled: enabled }),
      setLocation: (location) => set({ location }),
      setIsRamadanMode: (enabled) => set({ isRamadanMode: enabled }),
      resetSettings: () => set({ ...DEFAULT_SETTINGS }),
    }),
    {
      name: 'ramadan-medication-settings',
    }
  )
);

'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/contexts/LanguageContext';
import { useMedicationStore } from '@/stores/medicationStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { fetchPrayerTimes } from '@/lib/prayerTimes';
import { mapMedicationToRamadanSchedule } from '@/lib/doseMapper';
import { parseTimeToDate, formatTime } from '@/lib/helpers';
import { Modal, MedicationForm } from '@/components';
import { Medication, PrayerTimes } from '@/types';
import { PILL_COLORS_ARRAY as PILL_COLORS } from '@/lib/constants';
import { Plus, Pill, Edit2, Trash2, Clock, AlertTriangle } from 'lucide-react';

export default function MedicationsPage() {
  const { t, isRTL } = useTranslation();
  const { medications, loadMedications, addMedication, updateMedication, deleteMedication } = useMedicationStore();
  const { location } = useSettingsStore();
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null);
  const [deletingMedication, setDeletingMedication] = useState<Medication | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  useEffect(() => {
    const loadPrayerTimes = async () => {
      if (!location) return;
      try {
        const times = await fetchPrayerTimes(location.latitude, location.longitude);
        setPrayerTimes(times);
      } catch (error) {
        console.error('Error fetching prayer times:', error);
      }
    };
    loadPrayerTimes();
  }, [location]);

  const handleAddMedication = async (data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsLoading(true);
    try {
      await addMedication(data);
      setIsAddModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMedication = async (data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingMedication) return;
    setIsLoading(true);
    try {
      await updateMedication(editingMedication.id, data);
      setEditingMedication(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMedication = async () => {
    if (!deletingMedication) return;
    setIsLoading(true);
    try {
      await deleteMedication(deletingMedication.id);
      setDeletingMedication(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getScheduledTimes = (medication: Medication): Date[] => {
    if (!prayerTimes) return [];
    const mapping = mapMedicationToRamadanSchedule(medication, prayerTimes);
    return mapping.times.map(time => parseTimeToDate(time));
  };

  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case 'once': return t.frequency.once;
      case 'twice': return t.frequency.twice;
      case 'thrice': return t.frequency.thrice;
      case 'four_times': return t.frequency.fourTimes;
      default: return frequency;
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : ''}>
            <h1 className="text-2xl font-bold text-gray-800">{t.medications.title}</h1>
            <p className="text-gray-500">
              {medications.length === 0
                ? t.medications.noMedicationsYet
                : medications.length === 1
                ? t.medications.medicationCount.replace('{count}', '1')
                : t.medications.medicationCountPlural.replace('{count}', String(medications.length))}
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className={`flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">{t.medications.addMedication}</span>
          </button>
        </div>

        {/* Medication List */}
        {medications.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl">
            <Pill className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">{t.medications.noMedicationsYet}</h3>
            <p className="text-gray-500 mb-6">{t.medications.addFirstToStart}</p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className={`inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <Plus className="w-5 h-5" />
              {t.medications.addMedication}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => {
              const pillColor = medication.pillColor
                ? PILL_COLORS.find((c) => c.value === medication.pillColor)
                : null;
              const scheduledTimes = getScheduledTimes(medication);
              const showWarning = medication.frequency === 'thrice' || medication.frequency === 'four_times';

              return (
                <div
                  key={medication.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
                >
                  <div className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    {/* Pill Icon */}
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: pillColor?.color || '#e0e0e0' }}
                    >
                      <Pill className={`w-7 h-7 ${pillColor?.color === '#FFFFFF' ? 'text-gray-600' : 'text-white'}`} />
                    </div>

                    {/* Details */}
                    <div className={`flex-1 ${isRTL ? 'text-right' : ''}`}>
                      <h3 className="text-lg font-semibold text-gray-800">{medication.name}</h3>
                      <p className="text-gray-600">{medication.dosage}</p>
                      <p className="text-sm text-gray-500">{getFrequencyLabel(medication.frequency)}</p>

                      {/* Scheduled Times */}
                      {scheduledTimes.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs text-gray-400 mb-1">{t.medications.todaySchedule}</p>
                          <div className={`flex flex-wrap gap-2 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                            {scheduledTimes.map((time, idx) => (
                              <span
                                key={idx}
                                className={`inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded ${isRTL ? 'flex-row-reverse' : ''}`}
                              >
                                <Clock className="w-3 h-3" />
                                {formatTime(time, isRTL)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Warning for high frequency */}
                      {showWarning && (
                        <div className={`mt-2 flex items-center gap-1 text-xs text-amber-600 ${isRTL ? 'flex-row-reverse justify-end' : ''}`}>
                          <AlertTriangle className="w-3 h-3" />
                          <span>{medication.frequency === 'thrice' ? t.warnings.thriceDailyWarning : t.warnings.fourTimesDailyWarning}</span>
                        </div>
                      )}

                      {medication.notes && (
                        <p className="text-xs text-gray-400 mt-2 italic">{medication.notes}</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className={`flex gap-2 ${isRTL ? 'order-first' : ''}`}>
                      <button
                        onClick={() => setEditingMedication(medication)}
                        className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title={t.common.edit}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingMedication(medication)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title={t.common.delete}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Add Modal */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title={t.medications.addMedication}
          maxWidth="lg"
        >
          <MedicationForm
            onSubmit={handleAddMedication}
            onCancel={() => setIsAddModalOpen(false)}
            isLoading={isLoading}
          />
        </Modal>

        {/* Edit Modal */}
        <Modal
          isOpen={!!editingMedication}
          onClose={() => setEditingMedication(null)}
          title={t.medications.editMedication}
          maxWidth="lg"
        >
          {editingMedication && (
            <MedicationForm
              initialData={editingMedication}
              onSubmit={handleUpdateMedication}
              onCancel={() => setEditingMedication(null)}
              isLoading={isLoading}
            />
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={!!deletingMedication}
          onClose={() => setDeletingMedication(null)}
          title={t.medications.deleteMedication}
          maxWidth="sm"
        >
          <div className="space-y-4">
            <p className={`text-gray-600 ${isRTL ? 'text-right' : ''}`}>
              {t.medications.deleteConfirm} <strong>{deletingMedication?.name}</strong>?
            </p>
            <p className={`text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>
              {t.medications.deleteWarning}
            </p>
            <div className={`flex gap-3 pt-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <button
                onClick={() => setDeletingMedication(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={handleDeleteMedication}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? t.common.loading : t.common.delete}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

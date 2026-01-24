'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation, useLanguage } from '@/contexts/LanguageContext';
import { Medication, MedicationFrequency, TimePreference, PillColor, PillShape } from '@/types';
import { PILL_COLORS_ARRAY as PILL_COLORS, PILL_SHAPES_ARRAY as PILL_SHAPES } from '@/lib/constants';
import { Pill, AlertTriangle, Info, Lightbulb, Moon, Coffee, X } from 'lucide-react';
import { searchDrugs, searchDrug, DrugInstruction, getFoodTimingText, getCategoryName } from '@/lib/drugDatabase';

interface MedicationFormProps {
  initialData?: Medication;
  onSubmit: (data: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export function MedicationForm({ initialData, onSubmit, onCancel, isLoading }: MedicationFormProps) {
  const { t, isRTL } = useTranslation();
  const { language } = useLanguage();
  const isArabic = language === 'ar';
  
  const [name, setName] = useState(initialData?.name || '');
  const [dosage, setDosage] = useState(initialData?.dosage || '');
  const [frequency, setFrequency] = useState<MedicationFrequency>(initialData?.frequency || 'once');
  const [timePreference, setTimePreference] = useState<TimePreference>(initialData?.timePreference || 'any');
  const [withFood, setWithFood] = useState(initialData?.withFood || false);
  const [pillColor, setPillColor] = useState<PillColor | undefined>(initialData?.pillColor);
  const [pillShape, setPillShape] = useState<PillShape | undefined>(initialData?.pillShape);
  const [notes, setNotes] = useState(initialData?.notes || '');
  
  // Drug suggestion states
  const [suggestions, setSuggestions] = useState<DrugInstruction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState<DrugInstruction | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  // Dosage validation state
  const [dosageWarning, setDosageWarning] = useState<string | null>(null);
  
  // Valid units for dosage
  const validUnits = ['mg', 'g', 'mcg', 'ml', 'l', 'tablet', 'tablets', 'capsule', 'capsules', 'drop', 'drops', 'puff', 'puffs', 'unit', 'units', 'iu', 'cc', 'tsp', 'tbsp', 'oz',
    // Arabic units
    'ملغ', 'غ', 'مل', 'قرص', 'أقراص', 'كبسولة', 'كبسولات', 'قطرة', 'قطرات', 'وحدة', 'وحدات'];
  
  // Normalize dosage for flexible matching
  const normalizeDosage = (dosage: string): string => {
    return dosage
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\s*(tablet|tablets|capsule|capsules|pill|pills|قرص|أقراص|كبسولة|كبسولات)\s*/gi, '')
      .trim();
  };
  
  // Validate dosage function
  const validateDosage = (value: string, drug: DrugInstruction | null): string | null => {
    if (!value.trim()) return null;
    
    const trimmedValue = value.trim().toLowerCase();
    
    // Check if it contains at least one number
    const hasNumber = /\d/.test(trimmedValue);
    if (!hasNumber) {
      return isArabic 
        ? 'يجب أن تحتوي الجرعة على رقم (مثال: 500 ملغ، قرص واحد)'
        : 'Dosage should include a number (e.g., 500mg, 1 tablet)';
    }
    
    // Extract the numeric value
    const numberMatch = trimmedValue.match(/(\d+\.?\d*)/);
    const numericValue = numberMatch ? parseFloat(numberMatch[1]) : 0;
    
    // Check for unusually high doses
    if (numericValue > 5000) {
      return isArabic
        ? 'تحذير: الجرعة تبدو مرتفعة جداً. يرجى التأكد من صحتها'
        : 'Warning: This dosage seems unusually high. Please verify it is correct';
    }
    
    // Check if it has a valid unit
    const hasUnit = validUnits.some(unit => trimmedValue.includes(unit));
    if (!hasUnit) {
      // Check for common typos or missing spaces
      const commonPatterns = /\d+\s*(mg|g|ml|tablet|capsule|قرص|كبسولة)/i;
      if (!commonPatterns.test(trimmedValue)) {
        return isArabic
          ? 'يُنصح بإضافة الوحدة (مثال: ملغ، قرص، كبسولة، مل)'
          : 'Consider adding a unit (e.g., mg, tablet, capsule, ml)';
      }
    }
    
    // Check for zero dosage
    if (numericValue === 0) {
      return isArabic
        ? 'الجرعة لا يمكن أن تكون صفراً'
        : 'Dosage cannot be zero';
    }
    
    // Check against drug-specific standard dosages if drug is selected
    if (drug && drug.standardDosages && drug.standardDosages.length > 0) {
      const normalizedInput = normalizeDosage(value);
      const normalizedStandards = drug.standardDosages.map(d => normalizeDosage(d));
      
      // Extract numeric value and unit from input
      const inputMatch = normalizedInput.match(/(\d+\.?\d*)\s*([a-z\u0600-\u06FF]+)?/i);
      if (!inputMatch) {
        // If we can't parse the input, skip drug-specific validation
        return null;
      }
      
      const inputNum = parseFloat(inputMatch[1]);
      const inputUnit = inputMatch[2]?.toLowerCase().trim() || '';
      
      // Check if input matches any standard dosage
      const matches = normalizedStandards.some(standard => {
        // Exact match after normalization
        if (normalizedInput === standard) return true;
        
        // Extract numeric value and unit from standard
        const standardMatch = standard.match(/(\d+\.?\d*)\s*([a-z\u0600-\u06FF]+)?/i);
        if (!standardMatch) return false;
        
        const standardNum = parseFloat(standardMatch[1]);
        const standardUnit = standardMatch[2]?.toLowerCase().trim() || '';
        
        // If numbers don't match, it's not a match
        if (inputNum !== standardNum) return false;
        
        // If numbers match, check units
        // If both have no unit or same unit, it's a match
        if (!inputUnit && !standardUnit) return true;
        if (inputUnit && standardUnit && inputUnit === standardUnit) return true;
        
        // Handle unit variations (mg = ملغ, etc.)
        const unitMap: Record<string, string[]> = {
          'mg': ['mg', 'ملغ', 'ملجم'],
          'g': ['g', 'غ', 'جرام'],
          'mcg': ['mcg', 'مcg'],
          'ml': ['ml', 'مل'],
          'unit': ['unit', 'units', 'وحدة', 'وحدات'],
          'iu': ['iu', 'units', 'وحدات'],
        };
        
        // Check if both units are in the same equivalence group
        for (const [key, variants] of Object.entries(unitMap)) {
          if (variants.includes(inputUnit) && variants.includes(standardUnit)) {
            return true;
          }
        }
        
        return false;
      });
      
      if (!matches) {
        const drugName = isArabic ? drug.nameAr : drug.name;
        const dosagesList = drug.standardDosages.join(', ');
        return isArabic
          ? `${value} ليست جرعة قياسية لـ ${drugName}. الجرعات الشائعة: ${dosagesList}`
          : `${value} is not a standard dosage for ${drugName}. Common dosages: ${dosagesList}`;
      }
    }
    
    return null;
  };
  
  // Search for drugs as user types and auto-detect matches
  useEffect(() => {
    if (name.length >= 2) {
      const results = searchDrugs(name, 5);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      
      // Auto-detect if typed name matches a drug (for dosage validation)
      const normalizedName = name.toLowerCase().trim();
      
      // Check if any result matches exactly (case-insensitive)
      const exactMatch = results.find(drug => {
        const drugNameEn = drug.name.toLowerCase().trim();
        const drugNameAr = drug.nameAr.toLowerCase().trim();
        return normalizedName === drugNameEn || normalizedName === drugNameAr;
      });
      
      // Also check aliases
      const aliasMatch = results.find(drug => {
        const aliases = [...drug.aliases, ...drug.aliasesAr].map(a => a.toLowerCase().trim());
        return aliases.includes(normalizedName);
      });
      
      const matchedDrug = exactMatch || aliasMatch;
      
      if (matchedDrug) {
        setSelectedDrug((prev) => {
          // Only update if different to avoid unnecessary re-renders
          if (!prev || prev.id !== matchedDrug.id) {
            return matchedDrug;
          }
          return prev;
        });
      } else {
        // Clear selectedDrug if name doesn't match anymore
        setSelectedDrug((prev) => {
          if (prev) {
            const prevNameEn = prev.name.toLowerCase().trim();
            const prevNameAr = prev.nameAr.toLowerCase().trim();
            const prevAliases = [...prev.aliases, ...prev.aliasesAr].map(a => a.toLowerCase().trim());
            const matchesPrev = normalizedName === prevNameEn || normalizedName === prevNameAr || prevAliases.includes(normalizedName);
            if (!matchesPrev) {
              return null;
            }
          }
          return prev;
        });
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
      // Clear selectedDrug if name is too short
      setSelectedDrug(null);
    }
  }, [name]);
  
  // Click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Validate dosage when it changes (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (dosage) {
        const warning = validateDosage(dosage, selectedDrug);
        setDosageWarning(warning);
      } else {
        setDosageWarning(null);
      }
    }, 500); // 500ms debounce
    
    return () => clearTimeout(timer);
  }, [dosage, selectedDrug, isArabic]);
  
  // Handle selecting a drug from suggestions
  const handleSelectDrug = (drug: DrugInstruction) => {
    setName(isArabic ? drug.nameAr : drug.name);
    setSelectedDrug(drug);
    setShowSuggestions(false);
    
    // Auto-fill food timing based on drug data
    if (drug.foodTiming === 'with_food' || drug.foodTiming === 'after_meal') {
      setWithFood(true);
    } else if (drug.foodTiming === 'empty_stomach' || drug.foodTiming === 'before_meal') {
      setWithFood(false);
      setTimePreference('empty_stomach');
    }
  };
  
  // Dismiss selected drug instructions
  const handleDismissInstructions = () => {
    setShowInstructions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      dosage,
      frequency,
      timePreference,
      withFood,
      pillColor,
      pillShape,
      notes: notes || undefined,
    });
  };

  const frequencyOptions: { value: MedicationFrequency; label: string; description: string }[] = [
    { value: 'once', label: t.frequency.once, description: t.frequency.onceDesc },
    { value: 'twice', label: t.frequency.twice, description: t.frequency.twiceDesc },
    { value: 'thrice', label: t.frequency.thrice, description: t.frequency.thriceDesc },
    { value: 'four_times', label: t.frequency.fourTimes, description: t.frequency.fourTimesDesc },
  ];

  const timePreferenceOptions: { value: TimePreference; label: string; description: string }[] = [
    { value: 'morning', label: t.timePreference.morning, description: t.timePreference.morningDesc },
    { value: 'evening', label: t.timePreference.evening, description: t.timePreference.eveningDesc },
    { value: 'any', label: t.timePreference.any, description: t.timePreference.anyDesc },
  ];

  const getPillColorLabel = (value: string): string => {
    const colorKey = value.toLowerCase() as keyof typeof t.pillColors;
    return t.pillColors[colorKey] || value;
  };

  const getPillShapeLabel = (value: string): string => {
    const shapeKey = value.toLowerCase() as keyof typeof t.pillShapes;
    return t.pillShapes[shapeKey] || value;
  };

  const showFrequencyWarning = frequency === 'thrice' || frequency === 'four_times';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Medication Name with Auto-suggestions */}
      <div className="relative" ref={suggestionsRef}>
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : ''}`}>
          {t.medications.medicationName} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            // Clear selectedDrug if user changes the name manually
            setSelectedDrug((prev) => {
              if (prev && e.target.value !== (isArabic ? prev.nameAr : prev.name)) {
                return null;
              }
              return prev;
            });
            if (selectedDrug && e.target.value !== (isArabic ? selectedDrug.nameAr : selectedDrug.name)) {
              setShowInstructions(true);
            }
          }}
          onFocus={() => {
            if (suggestions.length > 0) setShowSuggestions(true);
          }}
          placeholder={t.medications.medicationNamePlaceholder}
          required
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${isRTL ? 'text-right' : ''}`}
        />
        
        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {suggestions.map((drug) => (
              <button
                key={drug.id}
                type="button"
                onClick={() => handleSelectDrug(drug)}
                className={`w-full px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-0 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div>
                    <p className="font-medium text-gray-800">
                      {isArabic ? drug.nameAr : drug.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {isArabic ? drug.name : drug.nameAr} • {getCategoryName(drug.category, isArabic)}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    drug.foodTiming === 'with_food' ? 'bg-orange-100 text-orange-700' :
                    drug.foodTiming === 'empty_stomach' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    {getFoodTimingText(drug.foodTiming, isArabic)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Drug Instructions Panel */}
      {selectedDrug && showInstructions && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200 space-y-4">
          <div className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Lightbulb className="w-5 h-5 text-emerald-600" />
              <h3 className="font-semibold text-emerald-800">
                {isArabic ? 'معلومات الدواء' : 'Medication Information'}
              </h3>
            </div>
            <button
              type="button"
              onClick={handleDismissInstructions}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          {/* Main Instructions */}
          <div className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Info className="w-4 h-4" />
              {isArabic ? 'تعليمات التناول' : 'How to Take'}
            </h4>
            <ul className={`text-sm text-gray-600 space-y-1 ${isRTL ? 'pr-5' : 'pl-5'}`}>
              {(isArabic ? selectedDrug.instructionsAr : selectedDrug.instructions).map((instruction, idx) => (
                <li key={idx} className="list-disc">{instruction}</li>
              ))}
            </ul>
          </div>
          
          {/* Foods to Avoid */}
          {selectedDrug.avoidFoods.length > 0 && (
            <div className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
              <h4 className="text-sm font-medium text-amber-700 flex items-center gap-2">
                <Coffee className="w-4 h-4" />
                {isArabic ? 'تجنب الأطعمة/المشروبات التالية' : 'Avoid These Foods/Drinks'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(isArabic ? selectedDrug.avoidFoodsAr : selectedDrug.avoidFoods).map((food, idx) => (
                  <span key={idx} className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full">
                    {food}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Warnings */}
          {selectedDrug.warnings.length > 0 && (
            <div className={`space-y-2 ${isRTL ? 'text-right' : ''}`}>
              <h4 className="text-sm font-medium text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                {isArabic ? 'تحذيرات' : 'Warnings'}
              </h4>
              <ul className={`text-sm text-red-600 space-y-1 ${isRTL ? 'pr-5' : 'pl-5'}`}>
                {(isArabic ? selectedDrug.warningsAr : selectedDrug.warnings).map((warning, idx) => (
                  <li key={idx} className="list-disc">{warning}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Ramadan Notes */}
          {selectedDrug.ramadanNotes.length > 0 && (
            <div className={`space-y-2 bg-emerald-100/50 rounded-lg p-3 ${isRTL ? 'text-right' : ''}`}>
              <h4 className="text-sm font-medium text-emerald-700 flex items-center gap-2">
                <Moon className="w-4 h-4" />
                {isArabic ? 'ملاحظات رمضانية' : 'Ramadan Notes'}
              </h4>
              <ul className={`text-sm text-emerald-600 space-y-1 ${isRTL ? 'pr-5' : 'pl-5'}`}>
                {(isArabic ? selectedDrug.ramadanNotesAr : selectedDrug.ramadanNotes).map((note, idx) => (
                  <li key={idx} className="list-disc">{note}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Dosage */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : ''}`}>
          {t.medications.dosage} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          placeholder={t.medications.dosagePlaceholder}
          required
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${isRTL ? 'text-right' : ''} ${
            dosageWarning 
              ? 'border-amber-400 bg-amber-50' 
              : 'border-gray-300'
          }`}
        />
        {/* Dosage Warning */}
        {dosageWarning && (
          <div className={`mt-2 p-3 rounded-lg bg-amber-50 border border-amber-200 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-700">{dosageWarning}</p>
            </div>
          </div>
        )}
        {/* Dosage Examples */}
        <p className={`text-xs text-gray-400 mt-1 ${isRTL ? 'text-right' : ''}`}>
          {isArabic 
            ? 'أمثلة: 500 ملغ، قرص واحد، 10 مل، كبسولتين'
            : 'Examples: 500mg, 1 tablet, 10ml, 2 capsules'}
        </p>
      </div>

      {/* Frequency */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
          {t.medications.frequency} <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          {frequencyOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFrequency(option.value)}
              className={`p-3 rounded-lg border-2 text-left transition-all ${isRTL ? 'text-right' : ''} ${
                frequency === option.value
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-gray-800">{option.label}</span>
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            </button>
          ))}
        </div>
        {showFrequencyWarning && (
          <div className={`mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 ${isRTL ? 'text-right' : ''}`}>
            <div className={`flex items-start gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                {frequency === 'thrice' ? t.warnings.thriceDailyWarning : t.warnings.fourTimesDailyWarning}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Time Preference */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
          {t.medications.timePreference}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {timePreferenceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setTimePreference(option.value)}
              className={`p-3 rounded-lg border-2 text-center transition-all ${
                timePreference === option.value
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="font-medium text-gray-800 text-sm">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* With Food Toggle */}
      <div className={`flex items-center justify-between p-4 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={isRTL ? 'text-right' : ''}>
          <span className="font-medium text-gray-800">{t.medications.takeWithFood}</span>
          <p className="text-xs text-gray-500">{t.medications.shouldBeTakenWithMeals}</p>
        </div>
        <button
          type="button"
          onClick={() => setWithFood(!withFood)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            withFood ? 'bg-emerald-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              withFood ? (isRTL ? 'left-1' : 'right-1') : (isRTL ? 'right-1' : 'left-1')
            }`}
          />
        </button>
      </div>

      {/* Pill Color */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
          {t.medications.pillColor}
        </label>
        <div className="flex flex-wrap gap-2">
          {PILL_COLORS.map((color) => (
            <button
              key={color.value}
              type="button"
              onClick={() => setPillColor(pillColor === color.value ? undefined : color.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                pillColor === color.value ? 'border-emerald-500 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color.color }}
              title={getPillColorLabel(color.value)}
            />
          ))}
        </div>
      </div>

      {/* Pill Shape */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
          {t.medications.pillShape}
        </label>
        <div className="flex flex-wrap gap-2">
          {PILL_SHAPES.map((shape) => (
            <button
              key={shape.value}
              type="button"
              onClick={() => setPillShape(pillShape === shape.value ? undefined : shape.value)}
              className={`px-4 py-2 rounded-lg border-2 text-sm transition-all ${
                pillShape === shape.value
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {getPillShapeLabel(shape.value)}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${isRTL ? 'text-right' : ''}`}>
          {t.medications.notes}
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t.medications.notesPlaceholder}
          rows={3}
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none ${isRTL ? 'text-right' : ''}`}
        />
      </div>

      {/* Preview */}
      {(name || dosage) && (
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className={`text-sm text-gray-500 mb-2 ${isRTL ? 'text-right' : ''}`}>Preview:</p>
          <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: pillColor ? PILL_COLORS.find(c => c.value === pillColor)?.color : '#e0e0e0' }}
            >
              <Pill className={`w-6 h-6 ${pillColor === 'white' ? 'text-gray-600' : 'text-white'}`} />
            </div>
            <div className={isRTL ? 'text-right' : ''}>
              <p className="font-semibold text-gray-800">{name || t.medications.medicationName}</p>
              <p className="text-sm text-gray-600">{dosage || t.medications.dosage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className={`flex gap-3 pt-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {t.common.cancel}
        </button>
        <button
          type="submit"
          disabled={isLoading || !name || !dosage}
          className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t.common.loading : t.common.save}
        </button>
      </div>
    </form>
  );
}

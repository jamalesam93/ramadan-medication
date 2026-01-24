'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslation, useLanguage, Language } from '@/contexts/LanguageContext';
import { useSettingsStore } from '@/stores/settingsStore';
import { useMedicationStore } from '@/stores/medicationStore';
import { PRAYER_CALCULATION_METHODS } from '@/lib/constants';
import {
  MapPin,
  Calculator,
  Bell,
  Moon,
  Trash2,
  Check,
  Loader2,
  Languages,
  Search,
} from 'lucide-react';
import { searchLocation, GeocodingResult } from '@/lib/geocoding';
import { CalculationMethod } from '@/types';

export default function SettingsPage() {
  const { t, isRTL } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const {
    location,
    setLocation,
    calculationMethod,
    setCalculationMethod,
    notificationsEnabled,
    setNotificationsEnabled,
    preAlertMinutes,
    setPreAlertMinutes,
    suhoorAlertMinutes,
    setSuhoorAlertMinutes,
    isRamadanMode,
    setIsRamadanMode,
    resetSettings,
  } = useSettingsStore();
  const { clearMedications } = useMedicationStore();

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [manualLat, setManualLat] = useState(location?.latitude.toString() || '');
  const [manualLng, setManualLng] = useState(location?.longitude.toString() || '');
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Initialize search query with current location if available
  useEffect(() => {
    if (location && !searchQuery) {
      const locationText = location.city && location.country 
        ? `${location.city}, ${location.country}`
        : `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
      setSearchQuery(locationText);
    }
  }, [location]);

  // Debounced search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timeoutId = setTimeout(async () => {
      const results = await searchLocation(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
      setIsSearching(false);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
      }
    };

    if (showSearchResults) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showSearchResults]);

  const detectLocation = () => {
    setIsDetectingLocation(true);
    setLocationError(null);
    setShowSearchResults(false);

    if (!navigator.geolocation) {
      setLocationError(t.settings.couldNotDetect);
      setIsDetectingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setManualLat(position.coords.latitude.toString());
        setManualLng(position.coords.longitude.toString());
        setSearchQuery('');
        setIsDetectingLocation(false);
      },
      () => {
        setLocationError(t.settings.couldNotDetect);
        setIsDetectingLocation(false);
      }
    );
  };

  const handleLocationSearch = (query: string) => {
    setSearchQuery(query);
    setLocationError(null);
  };

  const handleSelectLocation = (result: GeocodingResult) => {
    setLocation({
      latitude: result.latitude,
      longitude: result.longitude,
      city: result.city,
      country: result.country,
    });
    setSearchQuery(result.displayName);
    setManualLat(result.latitude.toString());
    setManualLng(result.longitude.toString());
    setShowSearchResults(false);
    setLocationError(null);
  };

  const handleManualLocationSubmit = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng)) {
      setLocationError(t.settings.invalidCoordinates);
      return;
    }

    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      setLocationError(t.settings.coordinatesOutOfRange);
      return;
    }

    setLocation({ latitude: lat, longitude: lng });
    setLocationError(null);
  };

  const handleClearAllData = () => {
    resetSettings();
    clearMedications();
    setShowClearConfirm(false);
  };

  const getMethodLabel = (key: string): string => {
    const methodKey = key as keyof typeof t.calculationMethods;
    return t.calculationMethods[methodKey] || key;
  };

  const languages: { code: Language; label: string; nativeLabel: string }[] = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  ];

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className={isRTL ? 'text-right' : ''}>
          <h1 className="text-2xl font-bold text-gray-800">{t.settings.title}</h1>
          <p className="text-gray-500">{t.settings.subtitle}</p>
        </div>

        {/* Language */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Languages className="w-5 h-5 text-emerald-600" />
            <div className={isRTL ? 'text-right' : ''}>
              <h2 className="font-semibold text-gray-800">{t.settings.language}</h2>
              <p className="text-sm text-gray-500">{t.settings.languageDesc}</p>
            </div>
          </div>

          <div className={`grid grid-cols-2 gap-3 ${isRTL ? 'direction-rtl' : ''}`}>
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  language === lang.code
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <span className="block font-medium text-gray-800">{lang.nativeLabel}</span>
                <span className="text-sm text-gray-500">{lang.label}</span>
                {language === lang.code && (
                  <Check className="w-4 h-4 text-emerald-600 mx-auto mt-1" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <MapPin className="w-5 h-5 text-emerald-600" />
            <div className={isRTL ? 'text-right' : ''}>
              <h2 className="font-semibold text-gray-800">{t.settings.location}</h2>
              <p className="text-sm text-gray-500">{t.settings.locationDesc}</p>
            </div>
          </div>

          {location && (
            <div className={`mb-4 p-3 bg-emerald-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
              <p className="text-sm text-emerald-700">
                ✓ {t.settings.locationSet}: {location.city && location.country ? `${location.city}, ${location.country}` : `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
              </p>
            </div>
          )}

          {/* Search Location */}
          <div className="mb-4" ref={searchRef}>
            <label className={`block text-sm font-medium text-gray-700 mb-2 ${isRTL ? 'text-right' : ''}`}>
              {t.settings.searchLocation}
            </label>
            <div className="relative">
              <Search className={`absolute top-3 ${isRTL ? 'right-3' : 'left-3'} w-5 h-5 text-gray-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleLocationSearch(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowSearchResults(true);
                  }
                }}
                placeholder={t.settings.searchPlaceholder}
                className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${isRTL ? 'text-right' : ''}`}
              />
              {isSearching && (
                <Loader2 className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'} w-5 h-5 text-gray-400 animate-spin`} />
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-lg max-h-60 overflow-y-auto z-10">
                {searchResults.map((result, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectLocation(result)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${isRTL ? 'text-right' : ''}`}
                  >
                    <p className="font-medium text-gray-800">{result.displayName}</p>
                    {(result.city || result.country) && (
                      <p className="text-sm text-gray-500">
                        {result.city && result.country ? `${result.city}, ${result.country}` : result.city || result.country}
                      </p>
                    )}
                  </button>
                ))}
              </div>
            )}
            
            {showSearchResults && searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
              <p className={`mt-2 text-sm text-gray-500 ${isRTL ? 'text-right' : ''}`}>
                {t.settings.noResultsFound}
              </p>
            )}
          </div>

          {/* Detect My Location Button */}
          <button
            onClick={detectLocation}
            disabled={isDetectingLocation}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {isDetectingLocation ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t.settings.detecting}
              </>
            ) : (
              <>
                <MapPin className="w-5 h-5" />
                {t.settings.detectMyLocation}
              </>
            )}
          </button>

          {/* Manual Entry (Collapsible) */}
          <div>
            <button
              onClick={() => {
                setShowManualEntry(!showManualEntry);
                setShowSearchResults(false);
              }}
              className={`text-sm text-emerald-600 hover:text-emerald-700 mb-2 ${isRTL ? 'text-right' : ''}`}
            >
              {showManualEntry ? '−' : '+'} {t.settings.orEnterManually}
            </button>
            
            {showManualEntry && (
              <div className={`mt-2 ${isRTL ? 'text-right' : ''}`}>
                <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">{t.settings.latitude}</label>
                    <input
                      type="number"
                      step="any"
                      value={manualLat}
                      onChange={(e) => setManualLat(e.target.value)}
                      placeholder="e.g., 21.4225"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${isRTL ? 'text-right' : ''}`}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs text-gray-500 mb-1">{t.settings.longitude}</label>
                    <input
                      type="number"
                      step="any"
                      value={manualLng}
                      onChange={(e) => setManualLng(e.target.value)}
                      placeholder="e.g., 39.8261"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${isRTL ? 'text-right' : ''}`}
                    />
                  </div>
                </div>
                <button
                  onClick={handleManualLocationSubmit}
                  className="mt-2 px-4 py-2 text-sm text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  {t.settings.setLocation}
                </button>
              </div>
            )}
          </div>

          {locationError && (
            <p className={`mt-2 text-sm text-red-600 ${isRTL ? 'text-right' : ''}`}>{locationError}</p>
          )}
        </div>

        {/* Calculation Method */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Calculator className="w-5 h-5 text-emerald-600" />
            <div className={isRTL ? 'text-right' : ''}>
              <h2 className="font-semibold text-gray-800">{t.settings.calculationMethod}</h2>
              <p className="text-sm text-gray-500">{t.settings.calculationMethodDesc}</p>
            </div>
          </div>

          <select
            value={calculationMethod}
            onChange={(e) => setCalculationMethod(e.target.value as CalculationMethod)}
            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${isRTL ? 'text-right' : ''}`}
          >
            {PRAYER_CALCULATION_METHODS.map((method) => (
              <option key={method.label} value={method.label}>
                {getMethodLabel(method.label)}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className={`flex items-center gap-3 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Bell className="w-5 h-5 text-emerald-600" />
            <div className={isRTL ? 'text-right' : ''}>
              <h2 className="font-semibold text-gray-800">{t.settings.notifications}</h2>
              <p className="text-sm text-gray-500">{t.settings.notificationsDesc}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Enable Notifications Toggle */}
            <div className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={isRTL ? 'text-right' : ''}>
                <span className="font-medium text-gray-800">{t.settings.enableNotifications}</span>
                <p className="text-xs text-gray-500">{t.settings.receiveReminders}</p>
              </div>
              <button
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    notificationsEnabled ? (isRTL ? 'left-1' : 'right-1') : (isRTL ? 'right-1' : 'left-1')
                  }`}
                />
              </button>
            </div>

            {notificationsEnabled && (
              <>
                {/* Pre-dose Alert */}
                <div className={`p-3 bg-gray-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                  <label className="block font-medium text-gray-800 mb-2">
                    {t.settings.preDoseAlert}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">{t.settings.minutesBeforeDose}</p>
                  <select
                    value={preAlertMinutes}
                    onChange={(e) => setPreAlertMinutes(Number(e.target.value))}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 ${isRTL ? 'text-right' : ''}`}
                  >
                    <option value={5}>5 {t.time.minutes}</option>
                    <option value={10}>10 {t.time.minutes}</option>
                    <option value={15}>15 {t.time.minutes}</option>
                    <option value={30}>30 {t.time.minutes}</option>
                  </select>
                </div>

                {/* Suhoor Alert */}
                <div className={`p-3 bg-gray-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
                  <label className="block font-medium text-gray-800 mb-2">
                    {t.settings.suhoorAlert}
                  </label>
                  <p className="text-xs text-gray-500 mb-2">{t.settings.minutesBeforeSuhoor}</p>
                  <select
                    value={suhoorAlertMinutes}
                    onChange={(e) => setSuhoorAlertMinutes(Number(e.target.value))}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 ${isRTL ? 'text-right' : ''}`}
                  >
                    <option value={15}>15 {t.time.minutes}</option>
                    <option value={30}>30 {t.time.minutes}</option>
                    <option value={45}>45 {t.time.minutes}</option>
                    <option value={60}>60 {t.time.minutes}</option>
                  </select>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Ramadan Mode */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Moon className="w-5 h-5 text-emerald-600" />
              <div className={isRTL ? 'text-right' : ''}>
                <h2 className="font-semibold text-gray-800">{t.settings.ramadanMode}</h2>
                <p className="text-sm text-gray-500">{t.settings.ramadanModeDesc}</p>
              </div>
            </div>
            <button
              onClick={() => setIsRamadanMode(!isRamadanMode)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                isRamadanMode ? 'bg-emerald-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isRamadanMode ? (isRTL ? 'left-1' : 'right-1') : (isRTL ? 'right-1' : 'left-1')
                }`}
              />
            </button>
          </div>
        </div>

        {/* Clear Data */}
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-4">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <Trash2 className="w-5 h-5 text-red-600" />
              <div className={isRTL ? 'text-right' : ''}>
                <h2 className="font-semibold text-gray-800">{t.settings.clearAllData}</h2>
                <p className="text-sm text-gray-500">{t.settings.clearAllDataDesc}</p>
              </div>
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              {t.common.delete}
            </button>
          </div>

          {showClearConfirm && (
            <div className={`mt-4 p-4 bg-red-50 rounded-lg ${isRTL ? 'text-right' : ''}`}>
              <p className="text-red-700 mb-4">{t.settings.clearConfirmWarning}</p>
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  onClick={handleClearAllData}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t.settings.yesClearAll}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* App Version */}
        <div className={`text-center text-sm text-gray-400 pb-4 ${isRTL ? 'text-center' : ''}`}>
          <p>{t.settings.appVersion} 1.0.0</p>
        </div>
      </div>
    </div>
  );
}

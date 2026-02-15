export const en = {
  // Common
  common: {
    appName: 'Ramadan Medication',
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    confirm: 'Confirm',
    yes: 'Yes',
    no: 'No',
    today: 'Today',
    refresh: 'Refresh',
  },

  // Navigation
  nav: {
    home: 'Home',
    medications: 'Medications',
    calendar: 'Calendar',
    settings: 'Settings',
  },

  // Home/Dashboard
  home: {
    title: 'Ramadan Medication',
    subtitle: 'Manage your medication schedule',
    todaySchedule: "Today's Schedule",
    noMedications: 'No medications scheduled',
    addFirstMedication: 'Add your first medication',
    allDone: 'All Done!',
    noMoreDoses: 'No more doses scheduled for today',
    untilNextDose: 'until next dose',
    locationRequired: 'Location Required',
    couldNotDetermineLocation: 'Could not determine location. Please set it in Settings.',
    completed: 'Completed',
    pending: 'Pending',
    missed: 'Missed',
  },

  // Prayer Times
  prayer: {
    iftar: 'Iftar',
    suhoor: 'Suhoor',
    suhoorEnds: 'Suhoor Ends',
    untilIftar: 'Until Iftar',
    untilSuhoorEnds: 'Until Suhoor Ends',
    nonFastingHours: 'Non-fasting hours',
    loadingPrayerTimes: 'Loading prayer times...',
    fajr: 'Fajr',
    sunrise: 'Sunrise',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
  },

  // Medications
  medications: {
    title: 'Medications',
    medicationCount: '{count} medication',
    medicationCountPlural: '{count} medications',
    noMedicationsYet: 'No medications yet',
    addFirstToStart: 'Add your first medication to get started',
    addMedication: 'Add Medication',
    editMedication: 'Edit Medication',
    deleteMedication: 'Delete Medication',
    deleteConfirm: 'Are you sure you want to delete',
    deleteWarning: 'This will also remove all scheduled doses for this medication.',
    todaySchedule: "Today's Schedule:",
    
    // Form fields
    medicationName: 'Medication Name',
    medicationNamePlaceholder: 'e.g., Metformin',
    dosage: 'Dosage',
    dosagePlaceholder: 'e.g., 500mg, 1 tablet',
    frequency: 'Frequency',
    timePreference: 'Time Preference',
    takeWithFood: 'Take with food',
    shouldBeTakenWithMeals: 'Should be taken during meals',
    pillColor: 'Pill Color (Optional)',
    pillShape: 'Pill Shape (Optional)',
    notes: 'Notes (Optional)',
    notesPlaceholder: 'e.g., Take after meals, Avoid grapefruit',
    required: 'required',
  },

  // Frequency options
  frequency: {
    once: 'Once daily',
    onceDesc: 'Take once per day',
    twice: 'Twice daily',
    twiceDesc: 'Take twice per day',
    thrice: 'Three times daily',
    thriceDesc: 'Take three times per day',
    fourTimes: 'Four times daily',
    fourTimesDesc: 'Take four times per day',
  },

  // Time preference options
  timePreference: {
    morning: 'Morning',
    morningDesc: 'Prefer taking in the morning',
    evening: 'Evening',
    eveningDesc: 'Prefer taking in the evening',
    any: 'Any time',
    anyDesc: 'No specific time preference',
    withFood: 'With food',
    withFoodDesc: 'Must be taken with meals',
    emptyStomach: 'Empty stomach',
    emptyStomachDesc: 'Must be taken on empty stomach',
  },

  // Pill colors
  pillColors: {
    white: 'White',
    blue: 'Blue',
    red: 'Red',
    yellow: 'Yellow',
    green: 'Green',
    orange: 'Orange',
    pink: 'Pink',
    purple: 'Purple',
    brown: 'Brown',
    other: 'Other',
  },

  // Pill shapes
  pillShapes: {
    round: 'Round',
    oval: 'Oval',
    capsule: 'Capsule',
    square: 'Square',
    triangle: 'Triangle',
    other: 'Other',
  },

  // Dose status
  doseStatus: {
    taken: 'Taken',
    missed: 'Missed',
    skipped: 'Skipped',
    pending: 'Pending',
    overdue: 'Overdue',
    markTaken: 'Mark Taken',
    skip: 'Skip',
    nextDose: 'NEXT DOSE',
    doseTimePassed: 'Dose time has passed',
  },

  // Calendar
  calendar: {
    title: 'Calendar',
    subtitle: 'Track your medication history',
    noDosesScheduled: 'No doses scheduled for this day',
    legend: {
      taken: 'Taken',
      missed: 'Missed',
      pending: 'Pending',
    },
  },

  // Settings
  settings: {
    title: 'Settings',
    subtitle: 'Customize your experience',
    
    // Location
    location: 'Location',
    locationDesc: 'For accurate prayer times',
    locationSet: 'Location Set',
    detectMyLocation: 'Detect My Location',
    detecting: 'Detecting...',
    searchLocation: 'Search Location',
    searchPlaceholder: 'e.g., Makkah, Saudi Arabia or New York, USA',
    searching: 'Searching...',
    noResultsFound: 'No locations found. Try a different search term.',
    orEnterManually: 'Or enter coordinates manually:',
    latitude: 'Latitude',
    longitude: 'Longitude',
    setLocation: 'Set Location',
    couldNotDetect: 'Could not detect location. Please check permissions or search for a location.',
    invalidCoordinates: 'Please enter valid coordinates.',
    coordinatesOutOfRange: 'Coordinates out of range.',
    
    // Calculation Method
    calculationMethod: 'Calculation Method',
    calculationMethodDesc: 'For prayer times',
    
    // Notifications
    notifications: 'Notifications',
    notificationsDesc: 'Reminder settings',
    enableNotifications: 'Enable Notifications',
    receiveReminders: 'Receive dose reminders',
    preDoseAlert: 'Pre-Dose Alert',
    minutesBeforeDose: 'Minutes before dose time',
    suhoorAlert: 'Suhoor Countdown Alert',
    minutesBeforeSuhoor: 'Minutes before Suhoor ends',
    
    // Ramadan Mode
    ramadanMode: 'Ramadan Mode',
    ramadanModeDesc: 'Adjust schedule for fasting',
    
    // Language
    language: 'Language',
    languageDesc: 'Choose your preferred language',
    
    // Data Management
    dataManagement: 'Data Management',
    dataManagementDesc: 'Export and import your data',
    exportData: 'Export Data',
    importData: 'Import Data',
    importSuccess: 'Data imported successfully',
    importError: 'Failed to import data',

    // Clear Data
    clearAllData: 'Clear All Data',
    clearAllDataDesc: 'Remove all medications and settings',
    clearConfirmWarning: '⚠️ This will permanently delete all your data. Are you sure?',
    yesClearAll: 'Yes, Clear All',
    
    // App Info
    appVersion: 'Version',
  },

  // Calculation Methods
  calculationMethods: {
    MuslimWorldLeague: 'Muslim World League',
    Egyptian: 'Egyptian General Authority',
    Karachi: 'University of Islamic Sciences, Karachi',
    UmmAlQura: 'Umm Al-Qura University, Makkah',
    Dubai: 'Dubai',
    MoonsightingCommittee: 'Moonsighting Committee',
    NorthAmerica: 'Islamic Society of North America',
    Kuwait: 'Kuwait',
    Qatar: 'Qatar',
    Singapore: 'Singapore',
    Tehran: 'Tehran',
    Turkey: 'Turkey',
  },

  // Warnings
  warnings: {
    thriceDailyWarning: '⚠️ Three doses in the non-fasting window may be challenging. Consult your doctor about adjustments.',
    fourTimesDailyWarning: '⚠️ CRITICAL: Four doses in the non-fasting window is very difficult. You MUST consult your doctor.',
    withFoodWarning: 'This medication should be taken with food during Iftar or Suhoor.',
  },

  // Time units
  time: {
    hours: 'hours',
    hoursShort: 'h',
    minutes: 'min',
    minutesShort: 'm',
    seconds: 'sec',
    secondsShort: 's',
    in: 'in',
  },

  // Days of week
  days: {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
    sundayShort: 'Sun',
    mondayShort: 'Mon',
    tuesdayShort: 'Tue',
    wednesdayShort: 'Wed',
    thursdayShort: 'Thu',
    fridayShort: 'Fri',
    saturdayShort: 'Sat',
  },

  // Months
  months: {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },
};

export type Translations = typeof en;

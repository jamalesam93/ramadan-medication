import { Translations } from './en';

export const ar: Translations = {
  // Common
  common: {
    appName: 'أدوية رمضان',
    loading: 'جارٍ التحميل...',
    save: 'حفظ',
    cancel: 'إلغاء',
    delete: 'حذف',
    edit: 'تعديل',
    add: 'إضافة',
    confirm: 'تأكيد',
    yes: 'نعم',
    no: 'لا',
    today: 'اليوم',
    refresh: 'تحديث',
  },

  // Navigation
  nav: {
    home: 'الرئيسية',
    medications: 'الأدوية',
    calendar: 'التقويم',
    settings: 'الإعدادات',
  },

  // Home/Dashboard
  home: {
    title: 'أدوية رمضان',
    subtitle: 'إدارة جدول أدويتك',
    todaySchedule: 'جدول اليوم',
    noMedications: 'لا توجد أدوية مجدولة',
    addFirstMedication: 'أضف أول دواء',
    allDone: 'تم الانتهاء!',
    noMoreDoses: 'لا توجد جرعات أخرى مجدولة لليوم',
    untilNextDose: 'حتى الجرعة التالية',
    locationRequired: 'الموقع مطلوب',
    couldNotDetermineLocation: 'تعذر تحديد الموقع. يرجى ضبطه في الإعدادات.',
    completed: 'مكتمل',
    pending: 'قيد الانتظار',
    missed: 'فائت',
  },

  // Prayer Times
  prayer: {
    iftar: 'الإفطار',
    suhoor: 'السحور',
    suhoorEnds: 'انتهاء السحور',
    untilIftar: 'حتى الإفطار',
    untilSuhoorEnds: 'حتى انتهاء السحور',
    nonFastingHours: 'ساعات غير الصيام',
    loadingPrayerTimes: 'جاري تحميل أوقات الصلاة...',
    fajr: 'الفجر',
    sunrise: 'الشروق',
    dhuhr: 'الظهر',
    asr: 'العصر',
    maghrib: 'المغرب',
    isha: 'العشاء',
  },

  // Medications
  medications: {
    title: 'الأدوية',
    medicationCount: '{count} دواء',
    medicationCountPlural: '{count} أدوية',
    noMedicationsYet: 'لا توجد أدوية حتى الآن',
    addFirstToStart: 'أضف أول دواء للبدء',
    addMedication: 'إضافة دواء',
    editMedication: 'تعديل الدواء',
    deleteMedication: 'حذف الدواء',
    deleteConfirm: 'هل أنت متأكد من حذف',
    deleteWarning: 'سيؤدي هذا أيضاً إلى حذف جميع الجرعات المجدولة لهذا الدواء.',
    todaySchedule: 'جدول اليوم:',
    
    // Form fields
    medicationName: 'اسم الدواء',
    medicationNamePlaceholder: 'مثال: ميتفورمين',
    dosage: 'الجرعة',
    dosagePlaceholder: 'مثال: 500 ملغ، قرص واحد',
    frequency: 'التكرار',
    timePreference: 'تفضيل الوقت',
    takeWithFood: 'تناول مع الطعام',
    shouldBeTakenWithMeals: 'يجب تناوله مع الوجبات',
    pillColor: 'لون الحبة (اختياري)',
    pillShape: 'شكل الحبة (اختياري)',
    notes: 'ملاحظات (اختياري)',
    notesPlaceholder: 'مثال: تناوله بعد الوجبات، تجنب الجريب فروت',
    required: 'مطلوب',
  },

  // Frequency options
  frequency: {
    once: 'مرة واحدة يومياً',
    onceDesc: 'تناوله مرة واحدة في اليوم',
    twice: 'مرتين يومياً',
    twiceDesc: 'تناوله مرتين في اليوم',
    thrice: 'ثلاث مرات يومياً',
    thriceDesc: 'تناوله ثلاث مرات في اليوم',
    fourTimes: 'أربع مرات يومياً',
    fourTimesDesc: 'تناوله أربع مرات في اليوم',
  },

  // Time preference options
  timePreference: {
    morning: 'صباحاً',
    morningDesc: 'يفضل تناوله في الصباح',
    evening: 'مساءً',
    eveningDesc: 'يفضل تناوله في المساء',
    any: 'أي وقت',
    anyDesc: 'لا تفضيل محدد للوقت',
    withFood: 'مع الطعام',
    withFoodDesc: 'يجب تناوله مع الوجبات',
    emptyStomach: 'على معدة فارغة',
    emptyStomachDesc: 'يجب تناوله على معدة فارغة',
  },

  // Pill colors
  pillColors: {
    white: 'أبيض',
    blue: 'أزرق',
    red: 'أحمر',
    yellow: 'أصفر',
    green: 'أخضر',
    orange: 'برتقالي',
    pink: 'وردي',
    purple: 'بنفسجي',
    brown: 'بني',
    other: 'آخر',
  },

  // Pill shapes
  pillShapes: {
    round: 'دائري',
    oval: 'بيضاوي',
    capsule: 'كبسولة',
    square: 'مربع',
    triangle: 'مثلث',
    other: 'آخر',
  },

  // Dose status
  doseStatus: {
    taken: 'تم أخذها',
    missed: 'فائتة',
    skipped: 'تم تخطيها',
    pending: 'قيد الانتظار',
    overdue: 'متأخرة',
    markTaken: 'تأكيد التناول',
    skip: 'تخطي',
    nextDose: 'الجرعة القادمة',
    doseTimePassed: 'انتهى وقت الجرعة',
  },

  // Calendar
  calendar: {
    title: 'التقويم',
    subtitle: 'تتبع سجل أدويتك',
    noDosesScheduled: 'لا توجد جرعات مجدولة لهذا اليوم',
    legend: {
      taken: 'تم التناول',
      missed: 'فائت',
      pending: 'قيد الانتظار',
    },
  },

  // Settings
  settings: {
    title: 'الإعدادات',
    subtitle: 'تخصيص تجربتك',
    
    // Location
    location: 'الموقع',
    locationDesc: 'لأوقات صلاة دقيقة',
    locationSet: 'تم تحديد الموقع',
    detectMyLocation: 'تحديد موقعي',
    detecting: 'جاري التحديد...',
    searchLocation: 'البحث عن موقع',
    searchPlaceholder: 'مثال: مكة، السعودية أو نيويورك، الولايات المتحدة',
    searching: 'جاري البحث...',
    noResultsFound: 'لم يتم العثور على مواقع. جرب مصطلح بحث مختلف.',
    orEnterManually: 'أو أدخل الإحداثيات يدوياً:',
    latitude: 'خط العرض',
    longitude: 'خط الطول',
    setLocation: 'تحديد الموقع',
    couldNotDetect: 'تعذر تحديد الموقع. يرجى التحقق من الأذونات أو البحث عن موقع.',
    invalidCoordinates: 'يرجى إدخال إحداثيات صحيحة.',
    coordinatesOutOfRange: 'الإحداثيات خارج النطاق.',
    
    // Calculation Method
    calculationMethod: 'طريقة الحساب',
    calculationMethodDesc: 'لأوقات الصلاة',
    
    // Notifications
    notifications: 'الإشعارات',
    notificationsDesc: 'إعدادات التذكير',
    enableNotifications: 'تفعيل الإشعارات',
    receiveReminders: 'استلام تذكيرات الجرعات',
    preDoseAlert: 'تنبيه ما قبل الجرعة',
    minutesBeforeDose: 'دقائق قبل وقت الجرعة',
    suhoorAlert: 'تنبيه العد التنازلي للسحور',
    minutesBeforeSuhoor: 'دقائق قبل انتهاء السحور',
    
    // Ramadan Mode
    ramadanMode: 'وضع رمضان',
    ramadanModeDesc: 'تعديل الجدول للصيام',
    
    // Language
    language: 'اللغة',
    languageDesc: 'اختر لغتك المفضلة',
    
    // Data Management
    dataManagement: 'إدارة البيانات',
    dataManagementDesc: 'تصدير واستيراد بياناتك',
    exportData: 'تصدير البيانات',
    importData: 'استيراد البيانات',
    importSuccess: 'تم استيراد البيانات بنجاح',
    importError: 'فشل استيراد البيانات',

    // Time Format
    timeFormat: 'تنسيق الوقت',
    timeFormatDesc: 'اختر عرض 12 ساعة أو 24 ساعة',
    timeFormat12h: '12 ساعة',
    timeFormat24h: '24 ساعة',
    
    // Clear Data
    clearAllData: 'حذف جميع البيانات',
    clearAllDataDesc: 'إزالة جميع الأدوية والإعدادات',
    clearConfirmWarning: '⚠️ سيؤدي هذا إلى حذف جميع بياناتك نهائياً. هل أنت متأكد؟',
    yesClearAll: 'نعم، حذف الكل',
    
    // App Info
    appVersion: 'الإصدار',
  },

  // Calculation Methods
  calculationMethods: {
    MuslimWorldLeague: 'رابطة العالم الإسلامي',
    Egyptian: 'الهيئة المصرية العامة للمساحة',
    Karachi: 'جامعة العلوم الإسلامية، كراتشي',
    UmmAlQura: 'جامعة أم القرى، مكة',
    Dubai: 'دبي',
    MoonsightingCommittee: 'لجنة رؤية الهلال',
    NorthAmerica: 'الجمعية الإسلامية لأمريكا الشمالية',
    Kuwait: 'الكويت',
    Qatar: 'قطر',
    Singapore: 'سنغافورة',
    Tehran: 'طهران',
    Turkey: 'تركيا',
  },

  // Warnings
  warnings: {
    thriceDailyWarning: '⚠️ ثلاث جرعات في فترة الإفطار قد تكون صعبة. استشر طبيبك حول التعديلات.',
    fourTimesDailyWarning: '⚠️ هام: أربع جرعات في فترة الإفطار صعبة جداً. يجب استشارة طبيبك.',
    withFoodWarning: 'يجب تناول هذا الدواء مع الطعام أثناء الإفطار أو السحور.',
  },

  // Time units
  time: {
    hours: 'ساعات',
    hoursShort: 'س',
    minutes: 'دقيقة',
    minutesShort: 'د',
    seconds: 'ثانية',
    secondsShort: 'ث',
    in: 'خلال',
  },

  // Days of week
  days: {
    sunday: 'الأحد',
    monday: 'الاثنين',
    tuesday: 'الثلاثاء',
    wednesday: 'الأربعاء',
    thursday: 'الخميس',
    friday: 'الجمعة',
    saturday: 'السبت',
    sundayShort: 'أحد',
    mondayShort: 'اثن',
    tuesdayShort: 'ثلا',
    wednesdayShort: 'أرب',
    thursdayShort: 'خمي',
    fridayShort: 'جمع',
    saturdayShort: 'سبت',
  },

  // Months
  months: {
    january: 'يناير',
    february: 'فبراير',
    march: 'مارس',
    april: 'أبريل',
    may: 'مايو',
    june: 'يونيو',
    july: 'يوليو',
    august: 'أغسطس',
    september: 'سبتمبر',
    october: 'أكتوبر',
    november: 'نوفمبر',
    december: 'ديسمبر',
  },

  // Not found
  notFound: {
    title: 'الصفحة غير موجودة',
    description: 'الصفحة التي تبحث عنها غير موجودة.',
    goHome: 'العودة للرئيسية',
  },
};

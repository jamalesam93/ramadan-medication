import { Translations } from './en';

export const fr: Translations = {
  // Common
  common: {
    appName: 'Médicaments Ramadan',
    loading: 'Chargement...',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    add: 'Ajouter',
    confirm: 'Confirmer',
    yes: 'Oui',
    no: 'Non',
    today: "Aujourd'hui",
    refresh: 'Actualiser',
  },

  // Navigation
  nav: {
    home: 'Accueil',
    medications: 'Médicaments',
    calendar: 'Calendrier',
    settings: 'Paramètres',
  },

  // Home/Dashboard
  home: {
    title: 'Médicaments Ramadan',
    subtitle: 'Gérez votre prise de médicaments',
    todaySchedule: "Programme d'aujourd'hui",
    noMedications: 'Aucun médicament programmé',
    addFirstMedication: 'Ajoutez votre premier médicament',
    allDone: 'Tout est fini !',
    noMoreDoses: "Plus de doses prévues pour aujourd'hui",
    untilNextDose: 'avant la prochaine dose',
    locationRequired: 'Localisation requise',
    couldNotDetermineLocation: 'Impossible de déterminer la localisation. Veuillez la définir dans les paramètres.',
    completed: 'Terminé',
    pending: 'En attente',
    missed: 'Manqué',
  },

  // Prayer Times
  prayer: {
    iftar: 'Iftar',
    suhoor: 'Suhoor',
    suhoorEnds: 'Fin du Suhoor',
    untilIftar: "Jusqu'à l'Iftar",
    untilSuhoorEnds: "Jusqu'à la fin du Suhoor",
    nonFastingHours: 'Heures hors jeûne',
    loadingPrayerTimes: 'Chargement des heures de prière...',
    fajr: 'Fajr',
    sunrise: 'Lever du soleil',
    dhuhr: 'Dhuhr',
    asr: 'Asr',
    maghrib: 'Maghrib',
    isha: 'Isha',
  },

  // Medications
  medications: {
    title: 'Médicaments',
    medicationCount: '{count} médicament',
    medicationCountPlural: '{count} médicaments',
    noMedicationsYet: 'Aucun médicament pour le moment',
    addFirstToStart: 'Ajoutez votre premier médicament pour commencer',
    addMedication: 'Ajouter un médicament',
    editMedication: 'Modifier le médicament',
    deleteMedication: 'Supprimer le médicament',
    deleteConfirm: 'Êtes-vous sûr de vouloir supprimer',
    deleteWarning: 'Cela supprimera également toutes les doses programmées pour ce médicament.',
    todaySchedule: "Programme d'aujourd'hui :",

    // Form fields
    medicationName: 'Nom du médicament',
    medicationNamePlaceholder: 'ex: Metformine',
    dosage: 'Dosage',
    dosagePlaceholder: 'ex: 500mg, 1 comprimé',
    frequency: 'Fréquence',
    timePreference: 'Préférence horaire',
    takeWithFood: 'Prendre avec de la nourriture',
    shouldBeTakenWithMeals: 'Doit être pris pendant les repas',
    pillColor: 'Couleur de la pilule (optionnel)',
    pillShape: 'Forme de la pilule (optionnel)',
    notes: 'Notes (optionnel)',
    notesPlaceholder: 'ex: Prendre après les repas, éviter le pamplemousse',
    required: 'requis',
  },

  // Frequency options
  frequency: {
    once: 'Une fois par jour',
    onceDesc: 'Prendre une fois par jour',
    twice: 'Deux fois par jour',
    twiceDesc: 'Prendre deux fois par jour',
    thrice: 'Trois fois par jour',
    thriceDesc: 'Prendre trois fois par jour',
    fourTimes: 'Quatre fois par jour',
    fourTimesDesc: 'Prendre quatre fois par jour',
  },

  // Time preference options
  timePreference: {
    morning: 'Matin',
    morningDesc: 'Préférer la prise le matin',
    evening: 'Soir',
    eveningDesc: 'Préférer la prise le soir',
    any: 'À tout moment',
    anyDesc: "Pas de préférence d'heure spécifique",
    withFood: 'Avec de la nourriture',
    withFoodDesc: 'Doit être pris avec les repas',
    emptyStomach: 'À jeun',
    emptyStomachDesc: "Doit être pris l'estomac vide",
  },

  // Pill colors
  pillColors: {
    white: 'Blanc',
    blue: 'Bleu',
    red: 'Rouge',
    yellow: 'Jaune',
    green: 'Vert',
    orange: 'Orange',
    pink: 'Rose',
    purple: 'Violet',
    brown: 'Marron',
    other: 'Autre',
  },

  // Pill shapes
  pillShapes: {
    round: 'Rond',
    oval: 'Ovale',
    capsule: 'Capsule',
    square: 'Carré',
    triangle: 'Triangle',
    other: 'Autre',
  },

  // Dose status
  doseStatus: {
    taken: 'Pris',
    missed: 'Manqué',
    skipped: 'Sauté',
    pending: 'En attente',
    overdue: 'En retard',
    markTaken: 'Marquer comme pris',
    skip: 'Sauter',
    nextDose: 'PROCHAINE DOSE',
    doseTimePassed: 'L\'heure de la dose est passée',
  },

  // Calendar
  calendar: {
    title: 'Calendrier',
    subtitle: 'Suivez votre historique de médication',
    noDosesScheduled: 'Aucune dose prévue pour ce jour',
    legend: {
      taken: 'Pris',
      missed: 'Manqué',
      pending: 'En attente',
    },
  },

  // Settings
  settings: {
    title: 'Paramètres',
    subtitle: 'Personnalisez votre expérience',

    // Location
    location: 'Localisation',
    locationDesc: 'Pour des heures de prière précises',
    locationSet: 'Localisation définie',
    detectMyLocation: 'Détecter ma position',
    detecting: 'Détection...',
    searchLocation: 'Rechercher un lieu',
    searchPlaceholder: 'ex: La Mecque, Arabie Saoudite ou Paris, France',
    searching: 'Recherche...',
    noResultsFound: 'Aucun lieu trouvé. Essayez un autre terme de recherche.',
    orEnterManually: 'Ou entrez les coordonnées manuellement :',
    latitude: 'Latitude',
    longitude: 'Longitude',
    setLocation: 'Définir la localisation',
    couldNotDetect: 'Impossible de détecter la localisation. Veuillez vérifier les permissions ou rechercher un lieu.',
    invalidCoordinates: 'Veuillez entrer des coordonnées valides.',
    coordinatesOutOfRange: 'Coordonnées hors limites.',

    // Calculation Method
    calculationMethod: 'Méthode de calcul',
    calculationMethodDesc: 'Pour les heures de prière',

    // Notifications
    notifications: 'Notifications',
    notificationsDesc: 'Paramètres de rappel',
    enableNotifications: 'Activer les notifications',
    receiveReminders: 'Recevoir des rappels de doses',
    preDoseAlert: 'Alerte pré-dose',
    minutesBeforeDose: 'Minutes avant l\'heure de la dose',
    suhoorAlert: 'Alerte compte à rebours Suhoor',
    minutesBeforeSuhoor: 'Minutes avant la fin du Suhoor',

    // Ramadan Mode
    ramadanMode: 'Mode Ramadan',
    ramadanModeDesc: 'Ajuster le programme pour le jeûne',

    // Language
    language: 'Langue',
    languageDesc: 'Choisissez votre langue préférée',

    // Data Management
    dataManagement: 'Gestion des données',
    dataManagementDesc: 'Exporter et importer vos données',
    exportData: 'Exporter les données',
    importData: 'Importer les données',
    importSuccess: 'Données importées avec succès',
    importError: "Échec de l'importation des données",

    // Clear Data
    clearAllData: 'Effacer toutes les données',
    clearAllDataDesc: 'Supprimer tous les médicaments et paramètres',
    clearConfirmWarning: '⚠️ Cela supprimera définitivement toutes vos données. Êtes-vous sûr ?',
    yesClearAll: 'Oui, tout effacer',

    // App Info
    appVersion: 'Version',
  },

  // Calculation Methods
  calculationMethods: {
    MuslimWorldLeague: 'Ligue Islamique Mondiale',
    Egyptian: 'Autorité Générale Égyptienne',
    Karachi: 'Université des Sciences Islamiques, Karachi',
    UmmAlQura: 'Université Umm Al-Qura, La Mecque',
    Dubai: 'Dubaï',
    MoonsightingCommittee: 'Comité d\'observation de la lune',
    NorthAmerica: 'Société Islamique d\'Amérique du Nord',
    Kuwait: 'Koweït',
    Qatar: 'Qatar',
    Singapore: 'Singapour',
    Tehran: 'Téhéran',
    Turkey: 'Turquie',
  },

  // Warnings
  warnings: {
    thriceDailyWarning: '⚠️ Trois doses pendant la période de non-jeûne peuvent être difficiles. Consultez votre médecin pour des ajustements.',
    fourTimesDailyWarning: '⚠️ CRITIQUE : Quatre doses pendant la période de non-jeûne sont très difficiles. Vous DEVEZ consulter votre médecin.',
    withFoodWarning: 'Ce médicament doit être pris avec de la nourriture pendant l\'Iftar ou le Suhoor.',
  },

  // Time units
  time: {
    hours: 'heures',
    hoursShort: 'h',
    minutes: 'min',
    minutesShort: 'm',
    seconds: 'sec',
    secondsShort: 's',
    in: 'dans',
  },

  // Days of week
  days: {
    sunday: 'Dimanche',
    monday: 'Lundi',
    tuesday: 'Mardi',
    wednesday: 'Mercredi',
    thursday: 'Jeudi',
    friday: 'Vendredi',
    saturday: 'Samedi',
    sundayShort: 'Dim',
    mondayShort: 'Lun',
    tuesdayShort: 'Mar',
    wednesdayShort: 'Mer',
    thursdayShort: 'Jeu',
    fridayShort: 'Ven',
    saturdayShort: 'Sam',
  },

  // Months
  months: {
    january: 'Janvier',
    february: 'Février',
    march: 'Mars',
    april: 'Avril',
    may: 'Mai',
    june: 'Juin',
    july: 'Juillet',
    august: 'Août',
    september: 'Septembre',
    october: 'Octobre',
    november: 'Novembre',
    december: 'Décembre',
  },
};

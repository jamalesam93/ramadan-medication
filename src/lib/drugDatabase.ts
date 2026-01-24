// Comprehensive Drug Database with Instructions
// Supports both English and Arabic medication names

export type DrugCategory = 
  | 'diabetes'
  | 'hypertension'
  | 'heart'
  | 'cholesterol'
  | 'pain'
  | 'antibiotic'
  | 'thyroid'
  | 'gi'
  | 'respiratory'
  | 'mental_health'
  | 'vitamin'
  | 'anticoagulant'
  | 'other';

export type FoodTiming = 'with_food' | 'empty_stomach' | 'before_meal' | 'after_meal' | 'any';

export interface DrugInstruction {
  id: string;
  name: string;
  nameAr: string;
  aliases: string[];
  aliasesAr: string[];
  category: DrugCategory;
  instructions: string[];
  instructionsAr: string[];
  warnings: string[];
  warningsAr: string[];
  foodTiming: FoodTiming;
  timingDetails?: string;
  timingDetailsAr?: string;
  avoidFoods: string[];
  avoidFoodsAr: string[];
  ramadanNotes: string[];
  ramadanNotesAr: string[];
  standardDosages?: string[];
}

export const DRUG_DATABASE: DrugInstruction[] = [
  // ==================== DIABETES MEDICATIONS ====================
  {
    id: 'metformin',
    name: 'Metformin',
    nameAr: 'ميتفورمين',
    aliases: ['glucophage', 'fortamet', 'glumetza', 'riomet', 'glycomet'],
    aliasesAr: ['جلوكوفاج', 'فورتاميت', 'جليكوميت'],
    category: 'diabetes',
    instructions: [
      'Take with meals to reduce stomach upset',
      'Swallow whole, do not crush or chew extended-release tablets',
      'Take at the same time each day',
    ],
    instructionsAr: [
      'تناوله مع الوجبات لتقليل اضطراب المعدة',
      'ابتلع الأقراص ممتدة المفعول كاملة، لا تسحقها أو تمضغها',
      'تناوله في نفس الوقت كل يوم',
    ],
    warnings: [
      'May cause stomach upset, nausea, or diarrhea initially',
      'Avoid if you have kidney problems',
      'Stay hydrated',
    ],
    warningsAr: [
      'قد يسبب اضطراب في المعدة أو غثيان أو إسهال في البداية',
      'تجنبه إذا كان لديك مشاكل في الكلى',
      'حافظ على ترطيب جسمك',
    ],
    foodTiming: 'with_food',
    avoidFoods: ['excessive sugar'],
    avoidFoodsAr: ['السكر المفرط'],
    ramadanNotes: [
      'Take at Iftar and Suhoor with meals',
      'Monitor blood sugar levels more frequently during fasting',
    ],
    ramadanNotesAr: [
      'تناوله عند الإفطار والسحور مع الوجبات',
      'راقب مستويات السكر في الدم بشكل متكرر أثناء الصيام',
    ],
    standardDosages: ['500mg', '850mg', '1000mg'],
  },
  {
    id: 'glibenclamide',
    name: 'Glibenclamide',
    nameAr: 'غليبنكلاميد',
    aliases: ['glyburide', 'daonil', 'euglucon', 'diabeta', 'glynase'],
    aliasesAr: ['داونيل', 'يوجلوكون', 'ديابيتا'],
    category: 'diabetes',
    instructions: [
      'Take with breakfast or first main meal',
      'Take 15-30 minutes before eating',
    ],
    instructionsAr: [
      'تناوله مع الإفطار أو الوجبة الرئيسية الأولى',
      'تناوله قبل 15-30 دقيقة من الأكل',
    ],
    warnings: [
      'Can cause low blood sugar (hypoglycemia)',
      'Carry glucose tablets or candy',
      'Avoid skipping meals',
    ],
    warningsAr: [
      'قد يسبب انخفاض السكر في الدم',
      'احمل أقراص الجلوكوز أو الحلوى',
      'تجنب تخطي الوجبات',
    ],
    foodTiming: 'before_meal',
    timingDetails: '15-30 minutes before meals',
    timingDetailsAr: '15-30 دقيقة قبل الوجبات',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'High risk of hypoglycemia during fasting - consult your doctor',
      'May need dose adjustment during Ramadan',
      'Take before Iftar meal',
    ],
    ramadanNotesAr: [
      'خطر كبير لانخفاض السكر أثناء الصيام - استشر طبيبك',
      'قد تحتاج لتعديل الجرعة خلال رمضان',
      'تناوله قبل وجبة الإفطار',
    ],
    standardDosages: ['2.5mg', '5mg'],
  },
  {
    id: 'gliclazide',
    name: 'Gliclazide',
    nameAr: 'غليكلازيد',
    aliases: ['diamicron', 'glizid'],
    aliasesAr: ['دياميكرون', 'جليزيد'],
    category: 'diabetes',
    instructions: [
      'Take with breakfast',
      'For modified-release tablets, take once daily',
    ],
    instructionsAr: [
      'تناوله مع الإفطار',
      'للأقراص ممتدة المفعول، تناوله مرة واحدة يومياً',
    ],
    warnings: [
      'Can cause low blood sugar',
      'Monitor blood glucose regularly',
    ],
    warningsAr: [
      'قد يسبب انخفاض السكر في الدم',
      'راقب مستوى الجلوكوز بانتظام',
    ],
    foodTiming: 'with_food',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Lower risk than glibenclamide but still monitor carefully',
      'Take with Iftar meal',
    ],
    ramadanNotesAr: [
      'خطر أقل من غليبنكلاميد لكن راقب بعناية',
      'تناوله مع وجبة الإفطار',
    ],
    standardDosages: ['30mg', '60mg', '80mg'],
  },
  {
    id: 'insulin',
    name: 'Insulin',
    nameAr: 'أنسولين',
    aliases: ['lantus', 'humalog', 'novolog', 'levemir', 'humulin', 'novolin', 'tresiba'],
    aliasesAr: ['لانتوس', 'هيومالوج', 'نوفولوج', 'ليفيمير', 'هيومولين', 'نوفولين', 'تريسيبا'],
    category: 'diabetes',
    instructions: [
      'Store in refrigerator until opened',
      'Rotate injection sites',
      'Fast-acting insulin should be taken just before or with meals',
    ],
    instructionsAr: [
      'خزنه في الثلاجة حتى الفتح',
      'غير أماكن الحقن بالتناوب',
      'الأنسولين سريع المفعول يجب تناوله قبل الوجبات مباشرة أو معها',
    ],
    warnings: [
      'Risk of hypoglycemia',
      'Never skip meals after taking insulin',
      'Carry fast-acting sugar',
    ],
    warningsAr: [
      'خطر انخفاض السكر في الدم',
      'لا تتخطى الوجبات بعد تناول الأنسولين',
      'احمل سكر سريع المفعول',
    ],
    foodTiming: 'with_food',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Dose timing and amounts may need significant adjustment',
      'Work closely with your doctor before Ramadan',
      'Monitor blood sugar very frequently',
    ],
    ramadanNotesAr: [
      'قد تحتاج توقيت الجرعة والكميات لتعديل كبير',
      'تعاون مع طبيبك قبل رمضان',
      'راقب السكر في الدم بشكل متكرر جداً',
    ],
    standardDosages: ['10 units/ml', '100 units/ml'],
  },

  // ==================== HYPERTENSION MEDICATIONS ====================
  {
    id: 'amlodipine',
    name: 'Amlodipine',
    nameAr: 'أملوديبين',
    aliases: ['norvasc', 'amlor', 'istin'],
    aliasesAr: ['نورفاسك', 'أملور', 'إستين'],
    category: 'hypertension',
    instructions: [
      'Can be taken with or without food',
      'Take at the same time each day',
      'Do not stop suddenly without consulting doctor',
    ],
    instructionsAr: [
      'يمكن تناوله مع أو بدون طعام',
      'تناوله في نفس الوقت كل يوم',
      'لا تتوقف فجأة دون استشارة الطبيب',
    ],
    warnings: [
      'May cause swelling in ankles',
      'May cause dizziness initially',
      'Avoid grapefruit and grapefruit juice',
    ],
    warningsAr: [
      'قد يسبب تورم في الكاحلين',
      'قد يسبب دوخة في البداية',
      'تجنب الجريب فروت وعصيره',
    ],
    foodTiming: 'any',
    avoidFoods: ['grapefruit', 'grapefruit juice'],
    avoidFoodsAr: ['الجريب فروت', 'عصير الجريب فروت'],
    ramadanNotes: [
      'Safe to take once daily at Iftar',
      'Stay hydrated during non-fasting hours',
    ],
    ramadanNotesAr: [
      'آمن للتناول مرة واحدة يومياً عند الإفطار',
      'حافظ على ترطيب جسمك خلال ساعات عدم الصيام',
    ],
    standardDosages: ['2.5mg', '5mg', '10mg'],
  },
  {
    id: 'lisinopril',
    name: 'Lisinopril',
    nameAr: 'ليزينوبريل',
    aliases: ['zestril', 'prinivil'],
    aliasesAr: ['زيستريل', 'برينيفيل'],
    category: 'hypertension',
    instructions: [
      'Can be taken with or without food',
      'Take at the same time each day',
    ],
    instructionsAr: [
      'يمكن تناوله مع أو بدون طعام',
      'تناوله في نفس الوقت كل يوم',
    ],
    warnings: [
      'May cause dry cough',
      'May cause dizziness, especially when standing up quickly',
      'Avoid potassium supplements unless prescribed',
    ],
    warningsAr: [
      'قد يسبب سعال جاف',
      'قد يسبب دوخة، خاصة عند الوقوف بسرعة',
      'تجنب مكملات البوتاسيوم إلا إذا وصفها الطبيب',
    ],
    foodTiming: 'any',
    avoidFoods: ['high potassium foods in excess', 'salt substitutes'],
    avoidFoodsAr: ['الأطعمة الغنية بالبوتاسيوم بكثرة', 'بدائل الملح'],
    ramadanNotes: [
      'Take once daily at Iftar',
      'Monitor blood pressure regularly',
    ],
    ramadanNotesAr: [
      'تناوله مرة واحدة يومياً عند الإفطار',
      'راقب ضغط الدم بانتظام',
    ],
    standardDosages: ['5mg', '10mg', '20mg', '40mg'],
  },
  {
    id: 'atenolol',
    name: 'Atenolol',
    nameAr: 'أتينولول',
    aliases: ['tenormin'],
    aliasesAr: ['تينورمين'],
    category: 'hypertension',
    instructions: [
      'Take with or without food',
      'Take at the same time each day',
      'Do not stop suddenly',
    ],
    instructionsAr: [
      'تناوله مع أو بدون طعام',
      'تناوله في نفس الوقت كل يوم',
      'لا تتوقف فجأة',
    ],
    warnings: [
      'May slow heart rate',
      'May mask symptoms of low blood sugar in diabetics',
      'May cause cold hands and feet',
    ],
    warningsAr: [
      'قد يبطئ معدل ضربات القلب',
      'قد يخفي أعراض انخفاض السكر لدى مرضى السكري',
      'قد يسبب برودة اليدين والقدمين',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Safe to take once daily',
      'If taking twice daily, take at Iftar and Suhoor',
    ],
    ramadanNotesAr: [
      'آمن للتناول مرة واحدة يومياً',
      'إذا كنت تتناوله مرتين يومياً، تناوله عند الإفطار والسحور',
    ],
    standardDosages: ['25mg', '50mg', '100mg'],
  },
  {
    id: 'losartan',
    name: 'Losartan',
    nameAr: 'لوسارتان',
    aliases: ['cozaar', 'losacar'],
    aliasesAr: ['كوزار', 'لوساكار'],
    category: 'hypertension',
    instructions: [
      'Can be taken with or without food',
      'Take at the same time each day',
    ],
    instructionsAr: [
      'يمكن تناوله مع أو بدون طعام',
      'تناوله في نفس الوقت كل يوم',
    ],
    warnings: [
      'May cause dizziness',
      'Avoid potassium supplements unless prescribed',
    ],
    warningsAr: [
      'قد يسبب دوخة',
      'تجنب مكملات البوتاسيوم إلا إذا وصفها الطبيب',
    ],
    foodTiming: 'any',
    avoidFoods: ['excessive potassium', 'salt substitutes'],
    avoidFoodsAr: ['البوتاسيوم المفرط', 'بدائل الملح'],
    ramadanNotes: [
      'Safe for once daily dosing at Iftar',
      'Stay well hydrated during non-fasting hours',
    ],
    ramadanNotesAr: [
      'آمن للجرعة مرة واحدة يومياً عند الإفطار',
      'حافظ على ترطيب جسمك خلال ساعات عدم الصيام',
    ],
    standardDosages: ['25mg', '50mg', '100mg'],
  },
  {
    id: 'hydrochlorothiazide',
    name: 'Hydrochlorothiazide',
    nameAr: 'هيدروكلوروثيازيد',
    aliases: ['hctz', 'microzide', 'esidrix'],
    aliasesAr: ['إتش سي تي زد', 'مايكروزايد'],
    category: 'hypertension',
    instructions: [
      'Take in the morning to avoid nighttime urination',
      'Can be taken with or without food',
    ],
    instructionsAr: [
      'تناوله في الصباح لتجنب التبول الليلي',
      'يمكن تناوله مع أو بدون طعام',
    ],
    warnings: [
      'Increases urination',
      'May cause dehydration',
      'May lower potassium levels',
    ],
    warningsAr: [
      'يزيد من التبول',
      'قد يسبب الجفاف',
      'قد يخفض مستويات البوتاسيوم',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take at Iftar to allow urination during non-fasting hours',
      'May increase risk of dehydration - consult doctor',
      'Drink plenty of fluids during non-fasting hours',
    ],
    ramadanNotesAr: [
      'تناوله عند الإفطار للسماح بالتبول خلال ساعات عدم الصيام',
      'قد يزيد خطر الجفاف - استشر الطبيب',
      'اشرب الكثير من السوائل خلال ساعات عدم الصيام',
    ],
    standardDosages: ['12.5mg', '25mg'],
  },

  // ==================== HEART & CHOLESTEROL MEDICATIONS ====================
  {
    id: 'aspirin',
    name: 'Aspirin',
    nameAr: 'أسبرين',
    aliases: ['disprin', 'ecotrin', 'bayer aspirin', 'aspro'],
    aliasesAr: ['ديسبرين', 'إيكوترين', 'أسبرو'],
    category: 'heart',
    instructions: [
      'Take with food or milk to reduce stomach irritation',
      'Do not crush enteric-coated tablets',
      'Take with a full glass of water',
    ],
    instructionsAr: [
      'تناوله مع الطعام أو الحليب لتقليل تهيج المعدة',
      'لا تسحق الأقراص المغلفة معوياً',
      'تناوله مع كوب كامل من الماء',
    ],
    warnings: [
      'Can cause stomach bleeding',
      'Avoid if you have stomach ulcers',
      'May increase bleeding risk',
    ],
    warningsAr: [
      'قد يسبب نزيف المعدة',
      'تجنبه إذا كان لديك قرحة معدة',
      'قد يزيد خطر النزيف',
    ],
    foodTiming: 'with_food',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take with Iftar meal',
      'Low-dose aspirin is generally safe during fasting',
    ],
    ramadanNotesAr: [
      'تناوله مع وجبة الإفطار',
      'الأسبرين بجرعة منخفضة آمن عموماً أثناء الصيام',
    ],
    standardDosages: ['75mg', '81mg', '100mg', '300mg', '325mg'],
  },
  {
    id: 'atorvastatin',
    name: 'Atorvastatin',
    nameAr: 'أتورفاستاتين',
    aliases: ['lipitor', 'atorva', 'sortis'],
    aliasesAr: ['ليبيتور', 'أتورفا', 'سورتيس'],
    category: 'cholesterol',
    instructions: [
      'Can be taken at any time of day',
      'Take at the same time each day',
      'Can be taken with or without food',
    ],
    instructionsAr: [
      'يمكن تناوله في أي وقت من اليوم',
      'تناوله في نفس الوقت كل يوم',
      'يمكن تناوله مع أو بدون طعام',
    ],
    warnings: [
      'Report any unexplained muscle pain',
      'Avoid grapefruit and grapefruit juice',
      'Regular liver function tests may be needed',
    ],
    warningsAr: [
      'أبلغ عن أي ألم عضلي غير مبرر',
      'تجنب الجريب فروت وعصيره',
      'قد تحتاج لفحوصات وظائف الكبد المنتظمة',
    ],
    foodTiming: 'any',
    avoidFoods: ['grapefruit', 'grapefruit juice'],
    avoidFoodsAr: ['الجريب فروت', 'عصير الجريب فروت'],
    ramadanNotes: [
      'Take once daily at Iftar or Suhoor',
      'No special adjustments needed',
    ],
    ramadanNotesAr: [
      'تناوله مرة واحدة يومياً عند الإفطار أو السحور',
      'لا حاجة لتعديلات خاصة',
    ],
    standardDosages: ['10mg', '20mg', '40mg', '80mg'],
  },
  {
    id: 'simvastatin',
    name: 'Simvastatin',
    nameAr: 'سيمفاستاتين',
    aliases: ['zocor', 'simvor'],
    aliasesAr: ['زوكور', 'سيمفور'],
    category: 'cholesterol',
    instructions: [
      'Take in the evening for best effect',
      'Can be taken with or without food',
    ],
    instructionsAr: [
      'تناوله في المساء للحصول على أفضل تأثير',
      'يمكن تناوله مع أو بدون طعام',
    ],
    warnings: [
      'Report unexplained muscle pain immediately',
      'Avoid grapefruit and grapefruit juice',
    ],
    warningsAr: [
      'أبلغ عن ألم العضلات غير المبرر فوراً',
      'تجنب الجريب فروت وعصيره',
    ],
    foodTiming: 'any',
    avoidFoods: ['grapefruit', 'grapefruit juice'],
    avoidFoodsAr: ['الجريب فروت', 'عصير الجريب فروت'],
    ramadanNotes: [
      'Take at Iftar (evening dose)',
      'No special adjustments needed',
    ],
    ramadanNotesAr: [
      'تناوله عند الإفطار (جرعة المساء)',
      'لا حاجة لتعديلات خاصة',
    ],
    standardDosages: ['10mg', '20mg', '40mg'],
  },
  {
    id: 'warfarin',
    name: 'Warfarin',
    nameAr: 'وارفارين',
    aliases: ['coumadin', 'marevan'],
    aliasesAr: ['كومادين', 'ماريفان'],
    category: 'anticoagulant',
    instructions: [
      'Take at the same time each day',
      'Maintain consistent vitamin K intake',
      'Regular blood tests (INR) required',
    ],
    instructionsAr: [
      'تناوله في نفس الوقت كل يوم',
      'حافظ على تناول ثابت لفيتامين ك',
      'فحوصات الدم المنتظمة (INR) مطلوبة',
    ],
    warnings: [
      'Avoid sudden changes in diet, especially vitamin K-rich foods',
      'Many drug interactions - tell all doctors you take this',
      'Watch for signs of bleeding',
    ],
    warningsAr: [
      'تجنب التغييرات المفاجئة في النظام الغذائي، خاصة الأطعمة الغنية بفيتامين ك',
      'تفاعلات دوائية كثيرة - أخبر جميع الأطباء أنك تتناول هذا الدواء',
      'راقب علامات النزيف',
    ],
    foodTiming: 'any',
    avoidFoods: ['large changes in leafy green vegetables', 'cranberry juice in large amounts'],
    avoidFoodsAr: ['التغييرات الكبيرة في الخضروات الورقية', 'عصير التوت البري بكميات كبيرة'],
    ramadanNotes: [
      'Keep diet consistent during Ramadan',
      'Take at the same time relative to Iftar each day',
      'More frequent INR monitoring may be needed',
    ],
    ramadanNotesAr: [
      'حافظ على نظام غذائي ثابت خلال رمضان',
      'تناوله في نفس الوقت بالنسبة للإفطار كل يوم',
      'قد تحتاج لمراقبة INR بشكل متكرر أكثر',
    ],
    standardDosages: ['1mg', '2mg', '2.5mg', '3mg', '4mg', '5mg', '6mg', '7.5mg', '10mg'],
  },
  {
    id: 'clopidogrel',
    name: 'Clopidogrel',
    nameAr: 'كلوبيدوجريل',
    aliases: ['plavix', 'plagril'],
    aliasesAr: ['بلافيكس', 'بلاجريل'],
    category: 'heart',
    instructions: [
      'Can be taken with or without food',
      'Take at the same time each day',
    ],
    instructionsAr: [
      'يمكن تناوله مع أو بدون طعام',
      'تناوله في نفس الوقت كل يوم',
    ],
    warnings: [
      'May increase bleeding risk',
      'Tell your doctor before any surgery or dental work',
    ],
    warningsAr: [
      'قد يزيد خطر النزيف',
      'أخبر طبيبك قبل أي عملية جراحية أو عمل أسنان',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take once daily at Iftar',
      'No special adjustments needed',
    ],
    ramadanNotesAr: [
      'تناوله مرة واحدة يومياً عند الإفطار',
      'لا حاجة لتعديلات خاصة',
    ],
    standardDosages: ['75mg'],
  },

  // ==================== PAIN MEDICATIONS ====================
  {
    id: 'paracetamol',
    name: 'Paracetamol',
    nameAr: 'باراسيتامول',
    aliases: ['acetaminophen', 'tylenol', 'panadol', 'adol', 'fevadol'],
    aliasesAr: ['تايلينول', 'بانادول', 'أدول', 'فيفادول'],
    category: 'pain',
    instructions: [
      'Can be taken with or without food',
      'Do not exceed 4g (4000mg) per day',
      'Wait at least 4 hours between doses',
    ],
    instructionsAr: [
      'يمكن تناوله مع أو بدون طعام',
      'لا تتجاوز 4 جرام (4000 ملجم) يومياً',
      'انتظر 4 ساعات على الأقل بين الجرعات',
    ],
    warnings: [
      'Do not exceed recommended dose - liver damage risk',
      'Check other medications for paracetamol content',
    ],
    warningsAr: [
      'لا تتجاوز الجرعة الموصى بها - خطر تلف الكبد',
      'تحقق من الأدوية الأخرى لمحتوى الباراسيتامول',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Safe for use during Ramadan',
      'Can be taken at Iftar or Suhoor as needed',
    ],
    ramadanNotesAr: [
      'آمن للاستخدام خلال رمضان',
      'يمكن تناوله عند الإفطار أو السحور حسب الحاجة',
    ],
    standardDosages: ['500mg', '1000mg'],
  },
  {
    id: 'ibuprofen',
    name: 'Ibuprofen',
    nameAr: 'إيبوبروفين',
    aliases: ['advil', 'motrin', 'brufen', 'nurofen'],
    aliasesAr: ['أدفيل', 'موترين', 'بروفين', 'نيوروفين'],
    category: 'pain',
    instructions: [
      'Take with food or milk',
      'Take with a full glass of water',
      'Do not lie down for 10 minutes after taking',
    ],
    instructionsAr: [
      'تناوله مع الطعام أو الحليب',
      'تناوله مع كوب كامل من الماء',
      'لا تستلقِ لمدة 10 دقائق بعد التناول',
    ],
    warnings: [
      'May cause stomach upset or bleeding',
      'Avoid if you have stomach ulcers or kidney problems',
      'Not for long-term use without medical advice',
    ],
    warningsAr: [
      'قد يسبب اضطراب المعدة أو النزيف',
      'تجنبه إذا كان لديك قرحة معدة أو مشاكل في الكلى',
      'ليس للاستخدام طويل الأمد دون استشارة طبية',
    ],
    foodTiming: 'with_food',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take with Iftar meal to protect stomach',
      'May increase dehydration risk',
    ],
    ramadanNotesAr: [
      'تناوله مع وجبة الإفطار لحماية المعدة',
      'قد يزيد خطر الجفاف',
    ],
    standardDosages: ['200mg', '400mg', '600mg'],
  },
  {
    id: 'diclofenac',
    name: 'Diclofenac',
    nameAr: 'ديكلوفيناك',
    aliases: ['voltaren', 'cataflam', 'voltarol'],
    aliasesAr: ['فولتارين', 'كتافلام', 'فولتارول'],
    category: 'pain',
    instructions: [
      'Take with food or after meals',
      'Take with plenty of water',
    ],
    instructionsAr: [
      'تناوله مع الطعام أو بعد الوجبات',
      'تناوله مع الكثير من الماء',
    ],
    warnings: [
      'May cause stomach problems',
      'Avoid if you have heart or kidney problems',
      'Not for long-term use',
    ],
    warningsAr: [
      'قد يسبب مشاكل في المعدة',
      'تجنبه إذا كان لديك مشاكل في القلب أو الكلى',
      'ليس للاستخدام طويل الأمد',
    ],
    foodTiming: 'with_food',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take with Iftar meal',
      'Avoid long-term use during fasting',
    ],
    ramadanNotesAr: [
      'تناوله مع وجبة الإفطار',
      'تجنب الاستخدام طويل الأمد أثناء الصيام',
    ],
    standardDosages: ['25mg', '50mg', '75mg', '100mg'],
  },

  // ==================== THYROID MEDICATIONS ====================
  {
    id: 'levothyroxine',
    name: 'Levothyroxine',
    nameAr: 'ليفوثيروكسين',
    aliases: ['synthroid', 'eltroxin', 'euthyrox', 'thyroxine'],
    aliasesAr: ['سينثرويد', 'إلتروكسين', 'يوثيروكس', 'ثيروكسين'],
    category: 'thyroid',
    instructions: [
      'Take on empty stomach, 30-60 minutes before breakfast',
      'Take with water only',
      'Take at the same time each day',
    ],
    instructionsAr: [
      'تناوله على معدة فارغة، قبل 30-60 دقيقة من الإفطار',
      'تناوله مع الماء فقط',
      'تناوله في نفس الوقت كل يوم',
    ],
    warnings: [
      'Many food and drug interactions',
      'Wait 4 hours before taking calcium or iron supplements',
      'Avoid taking with coffee',
    ],
    warningsAr: [
      'تفاعلات غذائية ودوائية كثيرة',
      'انتظر 4 ساعات قبل تناول مكملات الكالسيوم أو الحديد',
      'تجنب تناوله مع القهوة',
    ],
    foodTiming: 'empty_stomach',
    timingDetails: '30-60 minutes before eating',
    timingDetailsAr: '30-60 دقيقة قبل الأكل',
    avoidFoods: ['soy products', 'high-fiber foods', 'coffee'],
    avoidFoodsAr: ['منتجات الصويا', 'الأطعمة عالية الألياف', 'القهوة'],
    ramadanNotes: [
      'Take 30-60 minutes before Suhoor',
      'If taking once awake before Fajr, take with water only',
      'Alternatively, take at bedtime (3+ hours after dinner)',
    ],
    ramadanNotesAr: [
      'تناوله قبل 30-60 دقيقة من السحور',
      'إذا كنت تستيقظ قبل الفجر، تناوله مع الماء فقط',
      'بدلاً من ذلك، تناوله عند النوم (3+ ساعات بعد العشاء)',
    ],
    standardDosages: ['25mcg', '50mcg', '75mcg', '100mcg', '125mcg', '150mcg', '175mcg', '200mcg'],
  },

  // ==================== GI MEDICATIONS ====================
  {
    id: 'omeprazole',
    name: 'Omeprazole',
    nameAr: 'أوميبرازول',
    aliases: ['prilosec', 'losec', 'omez', 'gastro-resistant'],
    aliasesAr: ['بريلوزيك', 'لوسيك', 'أوميز'],
    category: 'gi',
    instructions: [
      'Take 30-60 minutes before a meal',
      'Best taken before breakfast',
      'Swallow whole, do not crush or chew',
    ],
    instructionsAr: [
      'تناوله قبل 30-60 دقيقة من الوجبة',
      'يفضل تناوله قبل الإفطار',
      'ابتلعه كاملاً، لا تسحقه أو تمضغه',
    ],
    warnings: [
      'Long-term use may affect calcium and magnesium absorption',
      'May increase risk of bone fractures with prolonged use',
    ],
    warningsAr: [
      'الاستخدام طويل الأمد قد يؤثر على امتصاص الكالسيوم والمغنيسيوم',
      'قد يزيد خطر كسور العظام مع الاستخدام المطول',
    ],
    foodTiming: 'before_meal',
    timingDetails: '30-60 minutes before eating',
    timingDetailsAr: '30-60 دقيقة قبل الأكل',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take 30 minutes before Iftar',
      'Helps prevent acid reflux during fasting',
    ],
    ramadanNotesAr: [
      'تناوله قبل 30 دقيقة من الإفطار',
      'يساعد في منع ارتجاع الحمض أثناء الصيام',
    ],
    standardDosages: ['10mg', '20mg', '40mg'],
  },
  {
    id: 'pantoprazole',
    name: 'Pantoprazole',
    nameAr: 'بانتوبرازول',
    aliases: ['protonix', 'controloc', 'pantoloc'],
    aliasesAr: ['بروتونيكس', 'كونترولوك', 'بانتولوك'],
    category: 'gi',
    instructions: [
      'Take 30 minutes before a meal',
      'Swallow whole with water',
    ],
    instructionsAr: [
      'تناوله قبل 30 دقيقة من الوجبة',
      'ابتلعه كاملاً مع الماء',
    ],
    warnings: [
      'Long-term use may affect nutrient absorption',
    ],
    warningsAr: [
      'الاستخدام طويل الأمد قد يؤثر على امتصاص العناصر الغذائية',
    ],
    foodTiming: 'before_meal',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take 30 minutes before Iftar',
      'Excellent for preventing fasting-related heartburn',
    ],
    ramadanNotesAr: [
      'تناوله قبل 30 دقيقة من الإفطار',
      'ممتاز للوقاية من حرقة المعدة المرتبطة بالصيام',
    ],
    standardDosages: ['20mg', '40mg'],
  },
  {
    id: 'ranitidine',
    name: 'Ranitidine/Famotidine',
    nameAr: 'رانيتيدين/فاموتيدين',
    aliases: ['zantac', 'pepcid', 'famotidine'],
    aliasesAr: ['زانتاك', 'بيبسيد', 'فاموتيدين'],
    category: 'gi',
    instructions: [
      'Can be taken with or without food',
      'For prevention, take 30-60 minutes before meals',
    ],
    instructionsAr: [
      'يمكن تناوله مع أو بدون طعام',
      'للوقاية، تناوله قبل 30-60 دقيقة من الوجبات',
    ],
    warnings: [
      'Generally well tolerated',
      'May affect absorption of some medications',
    ],
    warningsAr: [
      'جيد التحمل عموماً',
      'قد يؤثر على امتصاص بعض الأدوية',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take before Iftar to prevent heartburn',
      'Can also take at Suhoor',
    ],
    ramadanNotesAr: [
      'تناوله قبل الإفطار للوقاية من الحموضة',
      'يمكن أيضاً تناوله عند السحور',
    ],
    standardDosages: ['150mg', '300mg'],
  },

  // ==================== ANTIBIOTICS ====================
  {
    id: 'amoxicillin',
    name: 'Amoxicillin',
    nameAr: 'أموكسيسيلين',
    aliases: ['amoxil', 'augmentin', 'clavulin'],
    aliasesAr: ['أموكسيل', 'أوجمنتين', 'كلافيولين'],
    category: 'antibiotic',
    instructions: [
      'Can be taken with or without food',
      'Take at evenly spaced intervals',
      'Complete the full course even if feeling better',
    ],
    instructionsAr: [
      'يمكن تناوله مع أو بدون طعام',
      'تناوله على فترات متساوية',
      'أكمل الدورة الكاملة حتى لو شعرت بتحسن',
    ],
    warnings: [
      'Complete the full course of treatment',
      'May cause diarrhea',
      'Tell doctor if allergic to penicillin',
    ],
    warningsAr: [
      'أكمل دورة العلاج الكاملة',
      'قد يسبب إسهال',
      'أخبر الطبيب إذا كان لديك حساسية من البنسلين',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Space doses between Iftar and Suhoor',
      'Consult doctor about adjusting three-times-daily dosing',
    ],
    ramadanNotesAr: [
      'وزع الجرعات بين الإفطار والسحور',
      'استشر الطبيب حول تعديل الجرعة ثلاث مرات يومياً',
    ],
    standardDosages: ['250mg', '500mg'],
  },
  {
    id: 'azithromycin',
    name: 'Azithromycin',
    nameAr: 'أزيثروميسين',
    aliases: ['zithromax', 'azithrocin', 'z-pack'],
    aliasesAr: ['زيثروماكس', 'أزيثروسين'],
    category: 'antibiotic',
    instructions: [
      'Take at least 1 hour before or 2 hours after meals',
      'Take at the same time each day',
    ],
    instructionsAr: [
      'تناوله قبل ساعة على الأقل أو بعد ساعتين من الوجبات',
      'تناوله في نفس الوقت كل يوم',
    ],
    warnings: [
      'Complete the full course',
      'May cause stomach upset',
    ],
    warningsAr: [
      'أكمل الدورة الكاملة',
      'قد يسبب اضطراب في المعدة',
    ],
    foodTiming: 'empty_stomach',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take 1-2 hours after Iftar',
      'Once daily dosing works well during Ramadan',
    ],
    ramadanNotesAr: [
      'تناوله بعد 1-2 ساعة من الإفطار',
      'الجرعة مرة واحدة يومياً تعمل جيداً خلال رمضان',
    ],
    standardDosages: ['250mg', '500mg'],
  },
  {
    id: 'ciprofloxacin',
    name: 'Ciprofloxacin',
    nameAr: 'سيبروفلوكساسين',
    aliases: ['cipro', 'ciproxin', 'ciprobay'],
    aliasesAr: ['سيبرو', 'سيبروكسين', 'سيبروباي'],
    category: 'antibiotic',
    instructions: [
      'Can be taken with or without food',
      'Drink plenty of fluids',
      'Do not take with dairy products or calcium-fortified foods',
    ],
    instructionsAr: [
      'يمكن تناوله مع أو بدون طعام',
      'اشرب الكثير من السوائل',
      'لا تتناوله مع منتجات الألبان أو الأطعمة المدعمة بالكالسيوم',
    ],
    warnings: [
      'Avoid dairy for 2 hours before and after',
      'May cause tendon problems',
      'Avoid excessive sun exposure',
    ],
    warningsAr: [
      'تجنب الألبان لمدة ساعتين قبل وبعد',
      'قد يسبب مشاكل في الأوتار',
      'تجنب التعرض المفرط للشمس',
    ],
    foodTiming: 'any',
    avoidFoods: ['dairy products', 'calcium-fortified foods', 'antacids'],
    avoidFoodsAr: ['منتجات الألبان', 'الأطعمة المدعمة بالكالسيوم', 'مضادات الحموضة'],
    ramadanNotes: [
      'Take 2 hours away from dairy products',
      'Stay well hydrated during non-fasting hours',
    ],
    ramadanNotesAr: [
      'تناوله بعيداً بساعتين عن منتجات الألبان',
      'حافظ على الترطيب خلال ساعات عدم الصيام',
    ],
    standardDosages: ['250mg', '500mg', '750mg'],
  },

  // ==================== RESPIRATORY MEDICATIONS ====================
  {
    id: 'salbutamol',
    name: 'Salbutamol',
    nameAr: 'سالبوتامول',
    aliases: ['albuterol', 'ventolin', 'proventil', 'proair'],
    aliasesAr: ['ألبوتيرول', 'فنتولين', 'بروفينتيل'],
    category: 'respiratory',
    instructions: [
      'Shake inhaler before use',
      'Wait 1 minute between puffs if multiple doses',
      'Rinse mouth after using if corticosteroid combination',
    ],
    instructionsAr: [
      'رج البخاخ قبل الاستخدام',
      'انتظر دقيقة واحدة بين البخات إذا كانت جرعات متعددة',
      'اشطف فمك بعد الاستخدام إذا كان مزيج كورتيكوستيرويد',
    ],
    warnings: [
      'May cause rapid heartbeat or tremor',
      'Do not overuse - seek help if needing more than prescribed',
    ],
    warningsAr: [
      'قد يسبب تسارع ضربات القلب أو رعشة',
      'لا تفرط في الاستخدام - اطلب المساعدة إذا احتجت أكثر من الموصوف',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Inhalers do NOT break the fast according to most scholars',
      'Use as needed for asthma symptoms',
    ],
    ramadanNotesAr: [
      'البخاخات لا تفطر الصائم وفقاً لأغلب العلماء',
      'استخدمه حسب الحاجة لأعراض الربو',
    ],
    standardDosages: ['100mcg', '200mcg'],
  },
  {
    id: 'montelukast',
    name: 'Montelukast',
    nameAr: 'مونتيلوكاست',
    aliases: ['singulair', 'montair'],
    aliasesAr: ['سينجولير', 'مونتير'],
    category: 'respiratory',
    instructions: [
      'Take in the evening',
      'Can be taken with or without food',
    ],
    instructionsAr: [
      'تناوله في المساء',
      'يمكن تناوله مع أو بدون طعام',
    ],
    warnings: [
      'Report any mood changes or sleep disturbances',
    ],
    warningsAr: [
      'أبلغ عن أي تغيرات في المزاج أو اضطرابات النوم',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take once daily at Iftar',
      'No special adjustments needed',
    ],
    ramadanNotesAr: [
      'تناوله مرة واحدة يومياً عند الإفطار',
      'لا حاجة لتعديلات خاصة',
    ],
    standardDosages: ['4mg', '5mg', '10mg'],
  },

  // ==================== MENTAL HEALTH MEDICATIONS ====================
  {
    id: 'sertraline',
    name: 'Sertraline',
    nameAr: 'سيرترالين',
    aliases: ['zoloft', 'lustral'],
    aliasesAr: ['زولوفت', 'لوسترال'],
    category: 'mental_health',
    instructions: [
      'Take at the same time each day',
      'Can be taken with or without food',
      'May take several weeks to see full effect',
    ],
    instructionsAr: [
      'تناوله في نفس الوقت كل يوم',
      'يمكن تناوله مع أو بدون طعام',
      'قد يستغرق عدة أسابيع لرؤية التأثير الكامل',
    ],
    warnings: [
      'Do not stop suddenly without doctor advice',
      'May cause nausea initially',
      'Avoid with certain other medications',
    ],
    warningsAr: [
      'لا تتوقف فجأة دون استشارة الطبيب',
      'قد يسبب غثيان في البداية',
      'تجنبه مع بعض الأدوية الأخرى',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take once daily at Iftar',
      'Continue medication consistently through Ramadan',
    ],
    ramadanNotesAr: [
      'تناوله مرة واحدة يومياً عند الإفطار',
      'استمر في تناول الدواء بانتظام طوال رمضان',
    ],
    standardDosages: ['25mg', '50mg', '100mg'],
  },
  {
    id: 'escitalopram',
    name: 'Escitalopram',
    nameAr: 'إسيتالوبرام',
    aliases: ['lexapro', 'cipralex'],
    aliasesAr: ['ليكسابرو', 'سيبرالكس'],
    category: 'mental_health',
    instructions: [
      'Take at the same time each day',
      'Can be taken with or without food',
    ],
    instructionsAr: [
      'تناوله في نفس الوقت كل يوم',
      'يمكن تناوله مع أو بدون طعام',
    ],
    warnings: [
      'Do not stop suddenly',
      'May take weeks for full effect',
    ],
    warningsAr: [
      'لا تتوقف فجأة',
      'قد يستغرق أسابيع للتأثير الكامل',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take once daily at Iftar',
      'No dose adjustment needed',
    ],
    ramadanNotesAr: [
      'تناوله مرة واحدة يومياً عند الإفطار',
      'لا حاجة لتعديل الجرعة',
    ],
    standardDosages: ['5mg', '10mg', '20mg'],
  },

  // ==================== VITAMINS & SUPPLEMENTS ====================
  {
    id: 'vitamin_d',
    name: 'Vitamin D',
    nameAr: 'فيتامين د',
    aliases: ['cholecalciferol', 'd3', 'vitamin d3'],
    aliasesAr: ['كوليكالسيفيرول', 'د3', 'فيتامين د3'],
    category: 'vitamin',
    instructions: [
      'Take with a fatty meal for better absorption',
      'Can be taken once daily or weekly depending on dose',
    ],
    instructionsAr: [
      'تناوله مع وجبة دهنية لامتصاص أفضل',
      'يمكن تناوله مرة يومياً أو أسبوعياً حسب الجرعة',
    ],
    warnings: [
      'Do not exceed recommended dose',
      'High doses need medical supervision',
    ],
    warningsAr: [
      'لا تتجاوز الجرعة الموصى بها',
      'الجرعات العالية تحتاج إشراف طبي',
    ],
    foodTiming: 'with_food',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take with Iftar meal (contains fats)',
      'No special adjustments needed',
    ],
    ramadanNotesAr: [
      'تناوله مع وجبة الإفطار (تحتوي على دهون)',
      'لا حاجة لتعديلات خاصة',
    ],
    standardDosages: ['400 IU', '800 IU', '1000 IU', '2000 IU', '5000 IU'],
  },
  {
    id: 'iron',
    name: 'Iron Supplements',
    nameAr: 'مكملات الحديد',
    aliases: ['ferrous sulfate', 'ferrous fumarate', 'iron tablets'],
    aliasesAr: ['كبريتات الحديد', 'فيوميرات الحديد', 'أقراص الحديد'],
    category: 'vitamin',
    instructions: [
      'Take on empty stomach for best absorption',
      'Vitamin C helps absorption - take with orange juice',
      'If stomach upset, can take with food',
    ],
    instructionsAr: [
      'تناوله على معدة فارغة لامتصاص أفضل',
      'فيتامين ج يساعد الامتصاص - تناوله مع عصير البرتقال',
      'إذا حدث اضطراب في المعدة، يمكن تناوله مع الطعام',
    ],
    warnings: [
      'May cause constipation or dark stools',
      'Keep away from children - can be dangerous',
    ],
    warningsAr: [
      'قد يسبب إمساك أو براز داكن',
      'أبعده عن الأطفال - قد يكون خطيراً',
    ],
    foodTiming: 'empty_stomach',
    avoidFoods: ['tea', 'coffee', 'dairy', 'calcium supplements'],
    avoidFoodsAr: ['الشاي', 'القهوة', 'الألبان', 'مكملات الكالسيوم'],
    ramadanNotes: [
      'Take 1-2 hours after Iftar with vitamin C',
      'Avoid taking with tea or coffee',
    ],
    ramadanNotesAr: [
      'تناوله بعد 1-2 ساعة من الإفطار مع فيتامين ج',
      'تجنب تناوله مع الشاي أو القهوة',
    ],
    standardDosages: ['65mg', '100mg', '200mg', '325mg'],
  },
  {
    id: 'calcium',
    name: 'Calcium Supplements',
    nameAr: 'مكملات الكالسيوم',
    aliases: ['calcium carbonate', 'calcium citrate', 'caltrate'],
    aliasesAr: ['كربونات الكالسيوم', 'سترات الكالسيوم', 'كالترات'],
    category: 'vitamin',
    instructions: [
      'Calcium carbonate: take with food',
      'Calcium citrate: can be taken with or without food',
      'Do not take more than 500mg at once',
    ],
    instructionsAr: [
      'كربونات الكالسيوم: تناوله مع الطعام',
      'سترات الكالسيوم: يمكن تناوله مع أو بدون طعام',
      'لا تتناول أكثر من 500 ملجم في المرة الواحدة',
    ],
    warnings: [
      'Take separately from iron supplements',
      'May interact with some medications',
    ],
    warningsAr: [
      'تناوله بشكل منفصل عن مكملات الحديد',
      'قد يتفاعل مع بعض الأدوية',
    ],
    foodTiming: 'with_food',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take with Iftar or Suhoor',
      'Space from thyroid medications by 4 hours',
    ],
    ramadanNotesAr: [
      'تناوله مع الإفطار أو السحور',
      'أبعده عن أدوية الغدة الدرقية بـ 4 ساعات',
    ],
    standardDosages: ['500mg', '1000mg'],
  },
  {
    id: 'multivitamin',
    name: 'Multivitamin',
    nameAr: 'فيتامينات متعددة',
    aliases: ['centrum', 'one a day', 'multimineral'],
    aliasesAr: ['سنتروم', 'ون أ داي'],
    category: 'vitamin',
    instructions: [
      'Take with food to reduce stomach upset',
      'Take at the same time each day',
    ],
    instructionsAr: [
      'تناوله مع الطعام لتقليل اضطراب المعدة',
      'تناوله في نفس الوقت كل يوم',
    ],
    warnings: [
      'Do not take with other supplements without checking',
      'Some may cause nausea on empty stomach',
    ],
    warningsAr: [
      'لا تتناوله مع مكملات أخرى دون التحقق',
      'البعض قد يسبب غثيان على معدة فارغة',
    ],
    foodTiming: 'with_food',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take with Iftar meal',
      'No special adjustments needed',
    ],
    ramadanNotesAr: [
      'تناوله مع وجبة الإفطار',
      'لا حاجة لتعديلات خاصة',
    ],
    standardDosages: ['1 tablet'],
  },
  {
    id: 'folic_acid',
    name: 'Folic Acid',
    nameAr: 'حمض الفوليك',
    aliases: ['folate', 'vitamin b9'],
    aliasesAr: ['فولات', 'فيتامين ب9'],
    category: 'vitamin',
    instructions: [
      'Can be taken with or without food',
      'Take at the same time each day',
    ],
    instructionsAr: [
      'يمكن تناوله مع أو بدون طعام',
      'تناوله في نفس الوقت كل يوم',
    ],
    warnings: [
      'Generally very safe',
      'Important for women who may become pregnant',
    ],
    warningsAr: [
      'آمن جداً عموماً',
      'مهم للنساء اللواتي قد يحملن',
    ],
    foodTiming: 'any',
    avoidFoods: [],
    avoidFoodsAr: [],
    ramadanNotes: [
      'Take at Iftar or Suhoor',
      'No special adjustments needed',
    ],
    ramadanNotesAr: [
      'تناوله عند الإفطار أو السحور',
      'لا حاجة لتعديلات خاصة',
    ],
    standardDosages: ['400mcg', '800mcg', '1mg', '5mg'],
  },
];

// ==================== SEARCH FUNCTIONS ====================

/**
 * Normalize string for comparison (lowercase, remove special chars)
 */
function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0600-\u06FF\s]/g, '') // Keep Arabic characters
    .replace(/\s+/g, ' ');
}

/**
 * Calculate similarity score between two strings (simple Levenshtein-like)
 */
function similarityScore(str1: string, str2: string): number {
  const s1 = normalizeString(str1);
  const s2 = normalizeString(str2);
  
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Check if one starts with the other
  if (s1.startsWith(s2) || s2.startsWith(s1)) return 0.7;
  
  // Simple word overlap
  const words1 = s1.split(' ');
  const words2 = s2.split(' ');
  const commonWords = words1.filter(w => words2.includes(w));
  if (commonWords.length > 0) {
    return 0.5 * (commonWords.length / Math.max(words1.length, words2.length));
  }
  
  return 0;
}

/**
 * Search for drug by name with fuzzy matching
 */
export function searchDrug(query: string): DrugInstruction | null {
  if (!query || query.length < 2) return null;
  
  const normalizedQuery = normalizeString(query);
  let bestMatch: DrugInstruction | null = null;
  let bestScore = 0;
  
  for (const drug of DRUG_DATABASE) {
    // Check main name
    let score = similarityScore(query, drug.name);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = drug;
    }
    
    // Check Arabic name
    score = similarityScore(query, drug.nameAr);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = drug;
    }
    
    // Check aliases
    for (const alias of drug.aliases) {
      score = similarityScore(query, alias);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = drug;
      }
    }
    
    // Check Arabic aliases
    for (const alias of drug.aliasesAr) {
      score = similarityScore(query, alias);
      if (score > bestScore) {
        bestScore = score;
        bestMatch = drug;
      }
    }
  }
  
  // Only return if score is above threshold
  return bestScore >= 0.5 ? bestMatch : null;
}

/**
 * Search and return multiple matching drugs
 */
export function searchDrugs(query: string, limit: number = 5): DrugInstruction[] {
  if (!query || query.length < 2) return [];
  
  const results: { drug: DrugInstruction; score: number }[] = [];
  
  for (const drug of DRUG_DATABASE) {
    let maxScore = 0;
    
    // Check all name variations
    const namesToCheck = [
      drug.name,
      drug.nameAr,
      ...drug.aliases,
      ...drug.aliasesAr,
    ];
    
    for (const name of namesToCheck) {
      const score = similarityScore(query, name);
      if (score > maxScore) {
        maxScore = score;
      }
    }
    
    if (maxScore >= 0.3) {
      results.push({ drug, score: maxScore });
    }
  }
  
  // Sort by score and return top matches
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(r => r.drug);
}

/**
 * Get drug by exact ID
 */
export function getDrugById(id: string): DrugInstruction | null {
  return DRUG_DATABASE.find(drug => drug.id === id) || null;
}

/**
 * Get all drugs in a category
 */
export function getDrugsByCategory(category: DrugCategory): DrugInstruction[] {
  return DRUG_DATABASE.filter(drug => drug.category === category);
}

/**
 * Get food timing recommendation text
 */
export function getFoodTimingText(timing: FoodTiming, isArabic: boolean = false): string {
  const texts: Record<FoodTiming, { en: string; ar: string }> = {
    with_food: { en: 'Take with food', ar: 'تناوله مع الطعام' },
    empty_stomach: { en: 'Take on empty stomach', ar: 'تناوله على معدة فارغة' },
    before_meal: { en: 'Take before meals', ar: 'تناوله قبل الوجبات' },
    after_meal: { en: 'Take after meals', ar: 'تناوله بعد الوجبات' },
    any: { en: 'Can be taken any time', ar: 'يمكن تناوله في أي وقت' },
  };
  
  return isArabic ? texts[timing].ar : texts[timing].en;
}

/**
 * Get category display name
 */
export function getCategoryName(category: DrugCategory, isArabic: boolean = false): string {
  const names: Record<DrugCategory, { en: string; ar: string }> = {
    diabetes: { en: 'Diabetes', ar: 'السكري' },
    hypertension: { en: 'Blood Pressure', ar: 'ضغط الدم' },
    heart: { en: 'Heart', ar: 'القلب' },
    cholesterol: { en: 'Cholesterol', ar: 'الكوليسترول' },
    pain: { en: 'Pain Relief', ar: 'مسكنات الألم' },
    antibiotic: { en: 'Antibiotics', ar: 'المضادات الحيوية' },
    thyroid: { en: 'Thyroid', ar: 'الغدة الدرقية' },
    gi: { en: 'Stomach & Digestion', ar: 'المعدة والهضم' },
    respiratory: { en: 'Respiratory', ar: 'الجهاز التنفسي' },
    mental_health: { en: 'Mental Health', ar: 'الصحة النفسية' },
    vitamin: { en: 'Vitamins & Supplements', ar: 'الفيتامينات والمكملات' },
    anticoagulant: { en: 'Blood Thinners', ar: 'مميعات الدم' },
    other: { en: 'Other', ar: 'أخرى' },
  };
  
  return isArabic ? names[category].ar : names[category].en;
}

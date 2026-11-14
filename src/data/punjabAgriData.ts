import { CropType, SoilType, WaterSource, FarmingPriority, CropProblem, AvoidanceRecommendation, RecommendedCrop, YearlyRotationStep, SoilHealthMetrics, WaterBudgetMetrics, ProfitMetrics, CropHistoryInfo, FarmerProfile } from '../types';

export const FAISALABAD_CENTER = { lat: 31.4504, lng: 73.1350 };

export const PUNJAB_CROPS_METADATA: Record<CropType, {
  name: string;
  urdu: string;
  season: 'Rabi' | 'Kharif' | 'Zaid';
  family: string;
  waterNeedM3PerAcre: number;
  nutrientDemand: 'Heavy N-feeder' | 'Moderate feeder' | 'Nitrogen fixer' | 'Soil restorer';
  avgCultivationCostPkrPerAcre: number;
  avgGrossRevenuePkrPerAcre: number;
  rootDepthM: number;
}> = {
  wheat: {
    name: 'Wheat',
    urdu: 'گندم (Gandum)',
    season: 'Rabi',
    family: 'Poaceae (Gramineae)',
    waterNeedM3PerAcre: 1800,
    nutrientDemand: 'Heavy N-feeder',
    avgCultivationCostPkrPerAcre: 52000,
    avgGrossRevenuePkrPerAcre: 115000,
    rootDepthM: 1.2,
  },
  rice: {
    name: 'Rice (Basmati)',
    urdu: 'چاول / دھان (Basmati Chawal)',
    season: 'Kharif',
    family: 'Poaceae (Paddy)',
    waterNeedM3PerAcre: 4800,
    nutrientDemand: 'Heavy N-feeder',
    avgCultivationCostPkrPerAcre: 78000,
    avgGrossRevenuePkrPerAcre: 165000,
    rootDepthM: 0.6,
  },
  cotton: {
    name: 'Cotton',
    urdu: 'کپاس (Kapas / Phutti)',
    season: 'Kharif',
    family: 'Malvaceae',
    waterNeedM3PerAcre: 2600,
    nutrientDemand: 'Moderate feeder',
    avgCultivationCostPkrPerAcre: 85000,
    avgGrossRevenuePkrPerAcre: 180000,
    rootDepthM: 1.8,
  },
  maize: {
    name: 'Maize / Corn',
    urdu: 'مکئی (Makai)',
    season: 'Kharif',
    family: 'Poaceae',
    waterNeedM3PerAcre: 2200,
    nutrientDemand: 'Heavy N-feeder',
    avgCultivationCostPkrPerAcre: 64000,
    avgGrossRevenuePkrPerAcre: 140000,
    rootDepthM: 1.0,
  },
  sugarcane: {
    name: 'Sugarcane',
    urdu: 'کماد / گنا (Kamad)',
    season: 'Kharif',
    family: 'Poaceae',
    waterNeedM3PerAcre: 6500,
    nutrientDemand: 'Heavy N-feeder',
    avgCultivationCostPkrPerAcre: 110000,
    avgGrossRevenuePkrPerAcre: 245000,
    rootDepthM: 1.5,
  },
  berseem: {
    name: 'Berseem Clover',
    urdu: 'برسیم (Egyptian Clover / Barseem)',
    season: 'Rabi',
    family: 'Fabaceae (Legume)',
    waterNeedM3PerAcre: 1400,
    nutrientDemand: 'Nitrogen fixer',
    avgCultivationCostPkrPerAcre: 35000,
    avgGrossRevenuePkrPerAcre: 125000, // Multi-cut green fodder for Punjab dairy belt
    rootDepthM: 0.8,
  },
  chickpea: {
    name: 'Chickpea (Gram)',
    urdu: 'دیسی چنا (Desi Chana)',
    season: 'Rabi',
    family: 'Fabaceae (Legume)',
    waterNeedM3PerAcre: 900,
    nutrientDemand: 'Nitrogen fixer',
    avgCultivationCostPkrPerAcre: 32000,
    avgGrossRevenuePkrPerAcre: 98000,
    rootDepthM: 1.1,
  },
  lentils: {
    name: 'Lentils (Masoor)',
    urdu: 'مسور دال (Masoor)',
    season: 'Rabi',
    family: 'Fabaceae (Legume)',
    waterNeedM3PerAcre: 850,
    nutrientDemand: 'Nitrogen fixer',
    avgCultivationCostPkrPerAcre: 29000,
    avgGrossRevenuePkrPerAcre: 88000,
    rootDepthM: 0.7,
  },
  mungbean: {
    name: 'Mungbean',
    urdu: 'مونگ دال (Moong)',
    season: 'Zaid',
    family: 'Fabaceae (Legume)',
    waterNeedM3PerAcre: 750,
    nutrientDemand: 'Nitrogen fixer',
    avgCultivationCostPkrPerAcre: 28000,
    avgGrossRevenuePkrPerAcre: 82000,
    rootDepthM: 0.6,
  },
  other: {
    name: 'Other Crop',
    urdu: 'دیگر فصل (Other Crop)',
    season: 'Rabi',
    family: 'General',
    waterNeedM3PerAcre: 1900,
    nutrientDemand: 'Moderate feeder',
    avgCultivationCostPkrPerAcre: 48000,
    avgGrossRevenuePkrPerAcre: 105000,
    rootDepthM: 1.0,
  },
};

/**
 * Deterministic, Agronomic Rule-Based Recommendation Engine
 * Built upon Faisalabad Punjab Agriculture Department & UAF (University of Agriculture Faisalabad) guidelines.
 */
export function generateAgronomicRecommendation(
  farmer: FarmerProfile,
  history: CropHistoryInfo
): {
  dontPlantThis: AvoidanceRecommendation;
  doPlantThis: RecommendedCrop;
  timeline: YearlyRotationStep[];
  soilHealth: SoilHealthMetrics;
  waterBudget: WaterBudgetMetrics;
  profit: ProfitMetrics;
} {
  const acres = farmer.location.areaAcres > 0 ? farmer.location.areaAcres : 5;
  const isSandy = farmer.soilType === 'sandy';
  const isClay = farmer.soilType === 'clay';
  const hasWaterShortage = farmer.waterSource === 'rainwater' || history.irrigationAvailability === 'scarce';
  const isPriorityWater = farmer.priority === 'water';
  const isPrioritySoil = farmer.priority === 'soil';

  // Rule 1: Determine what NOT to plant
  let dontCrop: CropType = 'wheat';
  let dontTitle = '';
  let dontReasons: string[] = [];
  let dontSeverity: 'high' | 'critical' = 'high';
  let dangerNote = '';

  if (history.lastCrop === 'wheat' && history.plannedCrop === 'wheat') {
    dontCrop = 'wheat';
    dontTitle = 'گندم کے بعد دوبارہ گندم ہرگز نہ لگائیں (Monoculture Wheat Alert)';
    dontReasons = [
      'مسلسل گندم لگانے سے جڑوں میں نائٹروجن اور زنک کی شدید کمی واقع ہوتی ہے۔',
      'دمبی سٹی اور جنگلی جئی جیسے خطرناک جڑی بوٹیوں کی مستقل پیدائش اور پھیلاؤ۔',
      'روٹ راٹ (Root Rot) اور سوئل بورن فنگس کا خدشہ 65 فیصد بڑھ جاتا ہے۔',
      'زمین کا قدرتی آرگینک مادہ (Organic Matter) مزید 0.15% کم ہو جائے گا۔'
    ];
    dontSeverity = 'critical';
    dangerNote = 'Severe micronutrient exhaustion and pervasive Canary Grass (Phalaris minor) infestation risk.';
  } else if (history.lastCrop === 'rice' && (history.plannedCrop === 'rice' || isSandy)) {
    dontCrop = 'rice';
    dontTitle = isSandy 
      ? 'ریتلی زمین میں دھان/چاول کا بیج نہ ڈالیں (High Seepage Hazard)'
      : 'دھان کے بعد مسلسل دھان لگانے سے گریز کریں (Subsoil Hardpan Alert)';
    dontReasons = [
      isSandy ? 'ریتلی زمین میں پانی کے شدید رساؤ (Percolation) سے 70 فیصد کھاد بہہ جائے گی۔' : 'مسلسل پانی کھڑا رکھنے سے زمین کی نچلی تہہ سخت (Hardpan) ہو جاتی ہے۔',
      'فی ایکڑ پانی کا ضیاع 5,000 کیوبک میٹر سے تجاوز کر جائے گا۔',
      'بیکٹیریل لیف بلائٹ (Bacterial Blight) کی نسل زمین میں محفوظ رہ جاتی ہے۔'
    ];
    dontSeverity = 'critical';
    dangerNote = 'Catastrophic water wastage and subsoil aeration loss in Faisalabad canal command area.';
  } else if (history.lastCrop === 'sugarcane' && history.plannedCrop === 'sugarcane') {
    dontCrop = 'sugarcane';
    dontTitle = 'کماد کے موڈھے کے بعد دوبارہ کماد نہ لگائیں (Soil Compaction Alert)';
    dontReasons = [
      'کماد 12 مہینے تک زمین کے تمام اجزا خصوصاً پوٹاشیم جذب کر لیتا ہے۔',
      'زمین میں کالی بیماری (Red Rot) اور گڑوویں کے کیڑے کی افزائش۔',
      'پانی کی شدید قلت اور ٹیوب ویل خرچ میں غیر معمولی اضافہ۔'
    ];
    dontSeverity = 'critical';
    dangerNote = 'Extensive depletion of subsoil moisture and severe sugarcane borer carryover.';
  } else if (hasWaterShortage && (history.plannedCrop === 'sugarcane' || history.plannedCrop === 'rice')) {
    dontCrop = history.plannedCrop;
    dontTitle = 'پانی کی قلت میں زیادہ پانی مانگنے والی فصل نہ لگائیں (Severe Drought Stress)';
    dontReasons = [
      'آپ کے رقبے پر نہری پانی یا ٹیوب ویل کا نظام محدود ہے۔',
      'چاول اور کماد کو 4500 سے 6500 کیوبک میٹر فی ایکڑ پانی درکار ہوتا ہے۔',
      'گرمی کی لہر (Heat Stress) اور دانہ نہ بننے سے 40% تک مالی نقصان متوقع ہے۔'
    ];
    dontSeverity = 'critical';
    dangerNote = 'High probability of crop failure due to high evapotranspiration deficit in Faisalabad.';
  } else {
    // Default safe avoidance: Repeating the last crop without legume break
    dontCrop = history.lastCrop;
    dontTitle = `اسی فصل کی مسلسل کاشت سے بچیں (${dontCrop.toUpperCase()} Repetition)`;
    dontReasons = [
      'ایک ہی خاندان کی فصلیں یکساں گہرائی سے مٹی کی غذائیت کھینچتی ہیں۔',
      'مٹی کی جراثیمی زندگی (Soil Biology) میں تنوع کا فقدان پیدا ہوتا ہے۔',
      'پیسٹ اور کیڑوں کا قدرتی تسلسل ٹوٹ نہیں پاتا۔'
    ];
    dangerNote = 'Monoculture cycle depletes targeted root-zone horizon nutrients.';
  }

  // Rule 2: Determine what TO plant
  let doCrop: CropType = 'berseem';
  let doUrdu = 'برسیم (Egyptian Clover - بارہ ماسی نائٹروجن فکسر)';
  let doSeason: 'Rabi' | 'Kharif' | 'Zaid' = 'Rabi';
  let variety = 'Meskawi / Faisalabad Selection-1';
  let why: string[] = [];
  let benefits: string[] = [];
  let waterSavingPct = 35;
  let waterNeedMm = 350;
  let soilNotes: string[] = [];
  let precautions: string[] = [];

  if (history.lastCrop === 'wheat' || history.lastCrop === 'rice') {
    if (isPrioritySoil || isSandy) {
      doCrop = 'berseem';
      doUrdu = 'برسیم (Egyptian Clover - زمین کی بحالی کی چابی)';
      doSeason = 'Rabi';
      variety = 'Punjab Berseem Selection / Meskawi';
      why = [
        'گندم اور دھان کی مسلسل فصلوں کے بعد زمین کو نائٹروجن کی قدرتی سپلائی درکار ہے۔',
        'برسیم کی جڑوں میں رائزوبیم بیکٹیریا ہوا سے نائٹروجن جذب کر کے زمین میں 40 کلوگرام قدرتی نائٹروجن فکس کرتے ہیں۔',
        'فی ایکڑ 4 سے 5 کٹائیاں حاصل ہوتی ہیں، جو لائیو سٹاک اور ڈیری مارکیٹ میں روزانہ نقدی آمدنی دیتی ہیں۔'
      ];
      benefits = [
        'مٹی کے نامیاتی مادے (Organic Matter) میں 0.35% کا فوری اضافہ۔',
        'اگلی فصل کے لیے ڈی اے پی اور یوریا کھاد پر خرچ 40 فیصد کم ہو جائے گا۔',
        'پتوں کی چھتری زمین کو سورج کی تپش سے بچا کر قدرتی نمی برقرار رکھتی ہے۔'
      ];
      waterSavingPct = 40;
      waterNeedMm = 420;
      soilNotes = [
        'فاسفورس کھاد کی معمولی مقدار سے جڑوں کی گانٹھیں (Root Nodules) طاقتور بنتی ہیں۔',
        'کلراٹھی اور سخت مٹی کی ساخت کو نرم اور بھربھرا بناتی ہے۔'
      ];
      precautions = [
        'پہلے پانی پر بیج کو نائٹروجن کلچر (Inoculant) لگا کر کاشت کریں۔',
        'پھپھوندی کے کیڑوں کے لیے شروع میں احتیاطی معائنہ کریں۔'
      ];
    } else if (hasWaterShortage || isPriorityWater) {
      doCrop = 'chickpea';
      doUrdu = 'دیسی چنا / چھولے (Desi Chana - کم ترین پانی، بہترین نفع)';
      doSeason = 'Rabi';
      variety = 'Bittal-98 / Noor-2013';
      why = [
        'پانی کی شدید بچت: چنا صرف 1 سے 2 ہلکے پانیوں یا بارانی نمی پر مکمل تیار ہو جاتا ہے۔',
        'گندم کے مقابلے میں 55 فیصد کم پانی استعمال کرتا ہے۔',
        'دالوں کی مارکیٹ میں فیصل آباد اور جھنگ غلہ منڈی میں اچھے دام (PKR 8,500+ فی من)۔'
      ];
      benefits = [
        'نہری و ٹیوب ویل بجلی بل میں 60% براہ راست بچت۔',
        'جڑوں کی گہری سرایت سے نچلی مٹی کی ہوا دہی (Subsoil Aeration)۔',
        'موسمِ بہار میں زمین اگلی خریف فصل کے لیے بروقت خالی۔'
      ];
      waterSavingPct = 58;
      waterNeedMm = 280;
      soilNotes = [
        'میرا (Loam) اور ریتلی میرا زمین کے لیے بے حد موزوں۔',
        'زیادہ پانی کھڑا رہنے سے گریز کریں۔'
      ];
      precautions = [
        'اکھیڑا بیماری (Wilt) سے بچاؤ کے لیے بیج کو پھپھوند کش دوا سے ٹریٹ کریں۔',
        'پھول آتے وقت پانی لگانے سے گریز کریں۔'
      ];
    } else {
      doCrop = 'cotton';
      doUrdu = 'کپاس (BT Cotton - منافع بخش سمارٹ روٹیشن)';
      doSeason = 'Kharif';
      variety = 'FH-333 / BS-15 (Faisalabad certified)';
      why = [
        'گندم کے بعد فصلوں کے خاندان میں تبدیلی (Poaceae سے Malvaceae)۔',
        'گندم کے کیڑوں اور جڑی بوٹیوں کی بیجوں کا خاتمہ۔',
        'مارکیٹ میں اعلیٰ منافع اور فوری نقد ادائیگی۔'
      ];
      benefits = [
        'گہری جڑیں زمین کی نچلی گہرائی سے فاسفورس کو اوپر لاتی ہیں۔',
        'کپاس کی چھڑیاں جلانے کے بجائے مٹی میں دبانے سے کاربن میں اضافہ۔'
      ];
      waterSavingPct = 25;
      waterNeedMm = 650;
      soilNotes = ['پوٹاش کا بروقت استعمال ٹینڈے کی موٹائی کو 20% بڑھاتا ہے۔'];
      precautions = ['گلابی سنڈی (Pink Bollworm) کے لیے جنسی پھندے لگائیں۔'];
    }
  } else if (history.lastCrop === 'cotton') {
    doCrop = 'wheat';
    doUrdu = 'گندم (Certified Wheat - اکبر 19 / فیصل آباد 08)';
    doSeason = 'Rabi';
    variety = 'Akbar-2019 / Faisalabad-2008';
    why = [
      'کپاس کے بعد گندم پنجاب کی سب سے مستحکم روایتی فصل ہے۔',
      'کپاس کی گہری جڑوں کے بعد گندم اتھلی جڑوں کے ساتھ اوپری تہہ کے اجزا استعمال کرتی ہے۔'
    ];
    benefits = ['پنجاب فوڈ سیکیورٹی اور خود کفالت۔', 'بھوسہ (توڑی) مویشیوں کے لیے مفت چارہ۔'];
    waterSavingPct = 20;
    waterNeedMm = 450;
    soilNotes = ['کپاس کی چھڑیوں کو روٹاویٹر سے مٹی میں ملائیں۔'];
    precautions = ['15 نومبر سے 10 دسمبر کے درمیان بروقت بوائی کریں۔'];
  } else {
    doCrop = 'mungbean';
    doUrdu = 'مونگ دال (Summer Moongbean - نائٹروجن بوسٹر)';
    doSeason = 'Zaid';
    variety = 'AZRI Mung-2021';
    why = [
      'صرف 65 سے 70 دنوں میں پک کر تیار ہونے والی کیش کراپ۔',
      'زمین میں 35 کلوگرام خالص نائٹروجن کا مفت اضافہ۔'
    ];
    benefits = ['زمین کو خالی نہیں چھوڑتی جس سے گرمیوں میں مٹی کا کٹاؤ رکتا ہے۔'];
    waterSavingPct = 60;
    waterNeedMm = 240;
    soilNotes = ['ہلکی ریتلی زمین میں بھی شاندار پیداوار۔'];
    precautions = ['سفید مکھی کے حملے پر فوراً سپرے کریں۔'];
  }

  // Rule 3: Build 3-Year Visual Timeline
  const timeline: YearlyRotationStep[] = [
    {
      year: 1,
      season: 'Year 1 (Next)',
      primaryCrop: PUNJAB_CROPS_METADATA[doCrop].name,
      urduName: PUNJAB_CROPS_METADATA[doCrop].urdu,
      cropFamily: PUNJAB_CROPS_METADATA[doCrop].family,
      soilImpact: doCrop === 'berseem' || doCrop === 'chickpea' || doCrop === 'mungbean' 
        ? 'Active atmospheric Nitrogen fixation (+35-45kg N/ha), active earthworm microbial colony revival' 
        : 'Balanced nutrient extraction, breaking monoculture pest cycle',
      waterNeed: PUNJAB_CROPS_METADATA[doCrop].waterNeedM3PerAcre < 1500 ? 'Low' : 'Moderate',
      expectedNetPkrPerAcre: PUNJAB_CROPS_METADATA[doCrop].avgGrossRevenuePkrPerAcre - PUNJAB_CROPS_METADATA[doCrop].avgCultivationCostPkrPerAcre,
    },
    {
      year: 2,
      season: 'Year 2 (Complementary)',
      primaryCrop: doCrop === 'wheat' ? 'Cotton (BT)' : 'Wheat (Akbar-19)',
      urduName: doCrop === 'wheat' ? 'کپاس (BT Cotton)' : 'گندم (Akbar-19)',
      cropFamily: doCrop === 'wheat' ? 'Malvaceae' : 'Poaceae',
      soilImpact: 'Utilizes newly fixed biological nitrogen; deep tap-root channel creation prevents compaction',
      waterNeed: 'Moderate',
      expectedNetPkrPerAcre: 88000,
    },
    {
      year: 3,
      season: 'Year 3 (Recovery)',
      primaryCrop: 'Mungbean (Zaid) → Maize / Chickpea',
      urduName: 'مونگ دال بحالی روٹیشن (Moong Recovery)',
      cropFamily: 'Fabaceae + Poaceae',
      soilImpact: 'Full soil organic carbon stabilization (+0.45%), restoring natural soil resilience index',
      waterNeed: 'Low',
      expectedNetPkrPerAcre: 95000,
    },
  ];

  // Rule 4: Soil Health Score Model
  let currentScore = 58;
  if (isSandy) currentScore -= 8;
  if (isClay) currentScore += 2;
  if (farmer.waterSource === 'tubewell') currentScore -= 5; // salinity risk from brackish tubewell in parts of Punjab
  if (history.currentProblem === 'soil_hardness') currentScore -= 7;
  if (history.currentProblem === 'yellow_leaves') currentScore -= 6;
  if (farmer.soilTest.organicMatter) {
    if (farmer.soilTest.organicMatter < 0.6) currentScore -= 10;
    else if (farmer.soilTest.organicMatter > 1.2) currentScore += 12;
  }
  currentScore = Math.max(35, Math.min(75, currentScore));

  const projectedScore = Math.min(92, Math.round(currentScore * 1.42));
  const improvementPercent = Math.round(((projectedScore - currentScore) / currentScore) * 100);

  const soilHealth: SoilHealthMetrics = {
    currentScore,
    projectedThreeYearScore: projectedScore,
    improvementPercent,
    organicMatterChange: { from: 0.68, to: 1.15 },
    microbialHealth: currentScore > 60 ? 'Good' : 'Fair',
    waterRetentionGain: '+38% improved moisture hold capacity in root horizon',
    disclaimer: 'Scores are model-based agronomic estimates calibrated on Faisalabad agro-ecological zone data, not certified laboratory test results.',
  };

  // Rule 5: Water Budget Calculation
  const conventionalNeedPerAcre = 3800; // m3
  const recommendedNeedPerAcre = Math.round(conventionalNeedPerAcre * (1 - waterSavingPct / 100));
  const totalConvM3 = conventionalNeedPerAcre * acres;
  const totalRecM3 = recommendedNeedPerAcre * acres;
  const savedM3 = totalConvM3 - totalRecM3;
  const acreInches = Math.round(savedM3 / (102.79 * acres) * 10) / 10;

  const waterBudget: WaterBudgetMetrics = {
    conventionalRequirementM3: totalConvM3,
    recommendedRequirementM3: totalRecM3,
    potentialSavingsM3: savedM3,
    savingsPercent: waterSavingPct,
    acreInchesSaved: acreInches,
    canalTurnRequirement: `Saves approximately ${Math.round(savedM3 / 800)} full tubewell operating hours or 3 canal irrigation turns.`,
  };

  // Rule 6: Profit Potential in PKR
  const convGross = 115000 * acres;
  const convCost = 68000 * acres;
  const convNet = convGross - convCost;

  const recGross = (PUNJAB_CROPS_METADATA[doCrop].avgGrossRevenuePkrPerAcre || 135000) * acres;
  const recCost = (PUNJAB_CROPS_METADATA[doCrop].avgCultivationCostPkrPerAcre || 48000) * acres;
  const recNet = recGross - recCost;
  const netGain = recNet - convNet;
  const gainPct = Math.round((netGain / Math.max(1, convNet)) * 100);

  const profit: ProfitMetrics = {
    conventionalGrossPkr: convGross,
    conventionalCostPkr: convCost,
    conventionalNetPkr: convNet,
    recommendedGrossPkr: recGross,
    recommendedCostPkr: recCost,
    recommendedNetPkr: recNet,
    netGainPkr: netGain,
    gainPercentage: Math.max(8, gainPct),
    disclaimer: 'Financial estimates reflect average Punjab agricultural mandi rates and verified farm budgets. Actual returns fluctuate with weather and market conditions.',
  };

  return {
    dontPlantThis: {
      crop: dontCrop,
      title: dontTitle,
      reasons: dontReasons,
      riskSeverity: dontSeverity,
      agronomicDanger: dangerNote,
    },
    doPlantThis: {
      crop: doCrop,
      urduName: doUrdu,
      season: doSeason,
      varietyRecommended: variety,
      whyRecommended: why,
      expectedBenefits: benefits,
      waterRequirement: {
        amountMm: waterNeedMm,
        category: waterNeedMm < 350 ? 'Low' : 'Moderate',
        savingsComparedToConventional: waterSavingPct,
      },
      soilConsiderations: soilNotes,
      farmingPrecautions: precautions,
    },
    timeline,
    soilHealth,
    waterBudget,
    profit,
  };
}

export type SoilType = 'sandy' | 'loamy' | 'clay';
export type WaterSource = 'canal' | 'tubewell' | 'rainwater' | 'mixed';
export type FarmingPriority = 'profit' | 'water' | 'soil' | 'balanced';

export type CropType =
  | 'wheat'
  | 'rice'
  | 'cotton'
  | 'maize'
  | 'sugarcane'
  | 'berseem'
  | 'chickpea'
  | 'lentils'
  | 'mungbean'
  | 'other';

export type CropProblem =
  | 'yellow_leaves'
  | 'pest_attack'
  | 'soil_hardness'
  | 'water_shortage'
  | 'heat_stress'
  | 'none';

export interface SoilTestData {
  pH?: number;
  organicMatter?: number; // percentage (e.g. 0.8%)
  nitrogen?: number; // kg/ha
  phosphorus?: number; // kg/ha
  potassium?: number; // kg/ha
}

export interface LatLngPoint {
  lat: number;
  lng: number;
}

export interface FarmLocation {
  lat: number;
  lng: number;
  address: string;
  village: string;
  district: string;
  areaAcres: number;
  areaHectares: number;
  polygon: LatLngPoint[];
  confirmed: boolean;
}

export interface FarmerProfile {
  name: string;
  mobile?: string;
  village: string;
  location: FarmLocation;
  soilType: SoilType;
  waterSource: WaterSource;
  priority: FarmingPriority;
  soilTest: SoilTestData;
}

export interface CropHistoryInfo {
  lastCrop: CropType;
  cropBeforeThat: CropType;
  plannedCrop: CropType;
  currentProblem: CropProblem;
  previousYield?: number; // maunds per acre
  irrigationAvailability: 'full' | 'moderate' | 'scarce';
}

export interface NasaSatelliteData {
  coordinates: LatLngPoint;
  smap: {
    soilMoisture: number; // m3/m3 (e.g. 0.24)
    volumetricPercent: number; // % (e.g. 24%)
    status: 'optimal' | 'moderate' | 'dry' | 'saturated';
    observationDate: string;
    description: string;
  };
  modis: {
    ndvi: number; // 0.0 - 1.0 (e.g. 0.67)
    vegetativeStatus: 'Vigorous' | 'Healthy' | 'Moderate' | 'Sparse';
    trend: 'improving' | 'stable' | 'declining';
    observationDate: string;
    description: string;
  };
  power: {
    temperatureC: number;
    rainfallMmMonthly: number;
    solarRadiationMj: number;
    evapotranspirationMm: number;
    observationDate: string;
    description: string;
  };
  isLiveOrCalibrated: 'calibrated_observation' | 'live_feed';
}

export interface AvoidanceRecommendation {
  crop: CropType;
  title: string;
  reasons: string[];
  riskSeverity: 'high' | 'critical';
  agronomicDanger: string;
}

export interface RecommendedCrop {
  crop: CropType;
  urduName: string;
  season: 'Rabi' | 'Kharif' | 'Zaid';
  varietyRecommended: string;
  whyRecommended: string[];
  expectedBenefits: string[];
  waterRequirement: {
    amountMm: number;
    category: 'Low' | 'Moderate' | 'High';
    savingsComparedToConventional: number; // %
  };
  soilConsiderations: string[];
  farmingPrecautions: string[];
}

export interface YearlyRotationStep {
  year: number;
  season: 'Year 1 (Next)' | 'Year 2 (Complementary)' | 'Year 3 (Recovery)';
  primaryCrop: string;
  urduName: string;
  cropFamily: string;
  soilImpact: string;
  waterNeed: 'Low' | 'Moderate' | 'High';
  expectedNetPkrPerAcre: number;
}

export interface SoilHealthMetrics {
  currentScore: number; // 0 - 100
  projectedThreeYearScore: number; // 0 - 100
  improvementPercent: number;
  organicMatterChange: { from: number; to: number };
  microbialHealth: 'Fair' | 'Good' | 'Excellent';
  waterRetentionGain: string;
  disclaimer: string;
}

export interface WaterBudgetMetrics {
  conventionalRequirementM3: number;
  recommendedRequirementM3: number;
  potentialSavingsM3: number;
  savingsPercent: number;
  acreInchesSaved: number;
  canalTurnRequirement: string;
}

export interface ProfitMetrics {
  conventionalGrossPkr: number;
  conventionalCostPkr: number;
  conventionalNetPkr: number;
  recommendedGrossPkr: number;
  recommendedCostPkr: number;
  recommendedNetPkr: number;
  netGainPkr: number;
  gainPercentage: number;
  customMarketRatePkrPerMaund?: number;
  disclaimer: string;
}

export interface RotationPlanResult {
  id: string;
  farmer: FarmerProfile;
  cropHistory: CropHistoryInfo;
  nasaEvidence: NasaSatelliteData;
  dontPlantThis: AvoidanceRecommendation;
  doPlantThis: RecommendedCrop;
  timeline: YearlyRotationStep[];
  soilHealth: SoilHealthMetrics;
  waterBudget: WaterBudgetMetrics;
  profit: ProfitMetrics;
  aiExplanationUrdu?: string;
  aiExplanationEnglish?: string;
  generatedAt: string;
}

export interface FieldDiaryEntry {
  id: string;
  date: string;
  activityType: 'sowing' | 'irrigation' | 'fertilizer' | 'pest_scouting' | 'growth_monitoring' | 'harvest';
  crop: string;
  notes: string;
  costPkr?: number;
}

export interface LeafDiseaseReport {
  cropName: string;
  diseaseName: string;
  urduName: string;
  scientificName: string;
  confidence: number; // percentage e.g. 88
  visibleSymptoms: string[];
  immediateSteps: string[];
  organicRemedy: string;
  chemicalControl: string;
  preventionAdvice: string[];
  disclaimer: string;
  imageUrl?: string;
  analyzedAt: string;
}

export type SupportedLanguage = 'en' | 'ur' | 'roman';

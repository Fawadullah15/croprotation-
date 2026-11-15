import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  FarmerProfile,
  CropHistoryInfo,
  RotationPlanResult,
  FieldDiaryEntry,
  SupportedLanguage,
  FarmLocation,
} from '../types';
import { FAISALABAD_CENTER, generateAgronomicRecommendation } from '../data/punjabAgriData';
import { fetchNasaSatelliteEvidence } from '../utils/nasaData';

interface FarmContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  farmer: FarmerProfile;
  cropHistory: CropHistoryInfo;
  activeStep: 1 | 2 | 3;
  setActiveStep: (step: 1 | 2 | 3) => void;
  currentPlan: RotationPlanResult | null;
  savedPlans: RotationPlanResult[];
  fieldDiary: FieldDiaryEntry[];
  isGenerating: boolean;
  quotaExceeded: boolean;
  setQuotaExceeded: (val: boolean) => void;
  updateFarmer: (data: Partial<FarmerProfile>) => void;
  updateCropHistory: (data: Partial<CropHistoryInfo>) => void;
  updateLocation: (loc: Partial<FarmLocation>) => void;
  generatePlan: () => Promise<RotationPlanResult>;
  resetWizard: () => void;
  loadSavedPlan: (plan: RotationPlanResult) => void;
  addDiaryEntry: (entry: Omit<FieldDiaryEntry, 'id'>) => void;
  deleteDiaryEntry: (id: string) => void;
}

const DEFAULT_LOCATION: FarmLocation = {
  lat: FAISALABAD_CENTER.lat,
  lng: FAISALABAD_CENTER.lng,
  address: 'Chak 204 RB, Faisalabad District, Punjab, Pakistan',
  village: 'Chak 204 RB',
  district: 'Faisalabad',
  areaAcres: 5.0,
  areaHectares: 2.02,
  polygon: [
    { lat: 31.4504, lng: 73.1350 },
    { lat: 31.4524, lng: 73.1380 },
    { lat: 31.4484, lng: 73.1410 },
    { lat: 31.4464, lng: 73.1370 },
  ],
  confirmed: true,
};

const DEFAULT_FARMER: FarmerProfile = {
  name: 'Muhammad Aslam',
  mobile: '0300-7654321',
  village: 'Chak 204 RB, Faisalabad',
  location: DEFAULT_LOCATION,
  soilType: 'loamy',
  waterSource: 'canal',
  priority: 'balanced',
  soilTest: {
    pH: 7.8,
    organicMatter: 0.75,
    nitrogen: 42,
    phosphorus: 14,
    potassium: 160,
  },
};

const DEFAULT_CROP_HISTORY: CropHistoryInfo = {
  lastCrop: 'wheat',
  cropBeforeThat: 'rice',
  plannedCrop: 'berseem',
  currentProblem: 'none',
  previousYield: 38,
  irrigationAvailability: 'full',
};

const INITIAL_DIARY_ENTRIES: FieldDiaryEntry[] = [
  {
    id: 'entry-1',
    date: '2024-10-25',
    activityType: 'sowing',
    crop: 'Berseem Clover (Meskawi)',
    notes: 'Broadcasted seed inoculated with Rhizobium bio-fertilizer. Land prepared with 2 cultivator passes and laser leveling.',
    costPkr: 14000,
  },
  {
    id: 'entry-2',
    date: '2024-11-04',
    activityType: 'irrigation',
    crop: 'Berseem Clover',
    notes: 'First canal irrigation (Rouni) applied. Germination uniform across all 5 acres.',
    costPkr: 2500,
  },
  {
    id: 'entry-3',
    date: '2024-11-10',
    activityType: 'growth_monitoring',
    crop: 'Berseem Clover',
    notes: 'Healthy trifoliate leaves observed. Leaf canopy closed 45%. No pest attack detected.',
  },
];

const FarmContext = createContext<FarmContextType | null>(null);

export const FarmProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [farmer, setFarmer] = useState<FarmerProfile>(() => {
    try {
      const saved = localStorage.getItem('croprotation_farmer') || localStorage.getItem('agrospace_farmer');
      return saved ? JSON.parse(saved) : DEFAULT_FARMER;
    } catch {
      return DEFAULT_FARMER;
    }
  });

  const [cropHistory, setCropHistory] = useState<CropHistoryInfo>(() => {
    try {
      const saved = localStorage.getItem('croprotation_crop_history') || localStorage.getItem('agrospace_crop_history');
      return saved ? JSON.parse(saved) : DEFAULT_CROP_HISTORY;
    } catch {
      return DEFAULT_CROP_HISTORY;
    }
  });

  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);
  const [currentPlan, setCurrentPlan] = useState<RotationPlanResult | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const [savedPlans, setSavedPlans] = useState<RotationPlanResult[]>(() => {
    try {
      const saved = localStorage.getItem('croprotation_saved_plans') || localStorage.getItem('agrospace_saved_plans');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [fieldDiary, setFieldDiary] = useState<FieldDiaryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('croprotation_field_diary') || localStorage.getItem('agrospace_field_diary');
      return saved ? JSON.parse(saved) : INITIAL_DIARY_ENTRIES;
    } catch {
      return INITIAL_DIARY_ENTRIES;
    }
  });

  // Listen to Google Maps quota event
  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('croprotation_farmer', JSON.stringify(farmer));
    } catch {}
  }, [farmer]);

  useEffect(() => {
    try {
      localStorage.setItem('croprotation_crop_history', JSON.stringify(cropHistory));
    } catch {}
  }, [cropHistory]);

  useEffect(() => {
    try {
      localStorage.setItem('croprotation_saved_plans', JSON.stringify(savedPlans));
    } catch {}
  }, [savedPlans]);

  useEffect(() => {
    try {
      localStorage.setItem('croprotation_field_diary', JSON.stringify(fieldDiary));
    } catch {}
  }, [fieldDiary]);

  const updateFarmer = (data: Partial<FarmerProfile>) => {
    setFarmer(prev => ({ ...prev, ...data }));
  };

  const updateCropHistory = (data: Partial<CropHistoryInfo>) => {
    setCropHistory(prev => ({ ...prev, ...data }));
  };

  const updateLocation = (loc: Partial<FarmLocation>) => {
    setFarmer(prev => ({
      ...prev,
      location: { ...prev.location, ...loc },
    }));
  };

  const generatePlan = async (): Promise<RotationPlanResult> => {
    setIsGenerating(true);

    try {
      // 1. Generate Agronomic Rule-based core
      const recommendation = generateAgronomicRecommendation(farmer, cropHistory);

      // 2. Fetch NASA Earthdata satellite evidence
      const nasa = await fetchNasaSatelliteEvidence({
        lat: farmer.location.lat,
        lng: farmer.location.lng,
      });

      // 3. Assemble Plan Result
      const planResult: RotationPlanResult = {
        id: `plan-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        farmer: { ...farmer },
        cropHistory: { ...cropHistory },
        nasaEvidence: nasa,
        dontPlantThis: recommendation.dontPlantThis,
        doPlantThis: recommendation.doPlantThis,
        timeline: recommendation.timeline,
        soilHealth: recommendation.soilHealth,
        waterBudget: recommendation.waterBudget,
        profit: recommendation.profit,
        generatedAt: new Date().toISOString(),
      };

      setCurrentPlan(planResult);
      setSavedPlans(prev => [planResult, ...prev.filter(p => p.id !== planResult.id)]);
      setActiveStep(3);
      setIsGenerating(false);
      return planResult;
    } catch (err) {
      console.error('Error generating plan:', err);
      setIsGenerating(false);
      throw err;
    }
  };

  const resetWizard = () => {
    setActiveStep(1);
    setCurrentPlan(null);
  };

  const loadSavedPlan = (plan: RotationPlanResult) => {
    setCurrentPlan(plan);
    setFarmer(plan.farmer);
    setCropHistory(plan.cropHistory);
    setActiveStep(3);
  };

  const addDiaryEntry = (entry: Omit<FieldDiaryEntry, 'id'>) => {
    const newEntry: FieldDiaryEntry = {
      ...entry,
      id: `diary-${Date.now()}`,
    };
    setFieldDiary(prev => [newEntry, ...prev]);
  };

  const deleteDiaryEntry = (id: string) => {
    setFieldDiary(prev => prev.filter(e => e.id !== id));
  };

  return (
    <FarmContext.Provider
      value={{
        language,
        setLanguage,
        farmer,
        cropHistory,
        activeStep,
        setActiveStep,
        currentPlan,
        savedPlans,
        fieldDiary,
        isGenerating,
        quotaExceeded,
        setQuotaExceeded,
        updateFarmer,
        updateCropHistory,
        updateLocation,
        generatePlan,
        resetWizard,
        loadSavedPlan,
        addDiaryEntry,
        deleteDiaryEntry,
      }}
    >
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => {
  const context = useContext(FarmContext);
  if (!context) {
    throw new Error('useFarm must be used within a FarmProvider');
  }
  return context;
};

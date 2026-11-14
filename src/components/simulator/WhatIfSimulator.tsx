import React, { useState } from 'react';
import {
  GitCompare,
  TrendingUp,
  Droplets,
  Activity,
  DollarSign,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { CropType } from '../../types';
import { PUNJAB_CROPS_METADATA } from '../../data/punjabAgriData';

export const WhatIfSimulator: React.FC = () => {
  const { language } = useFarm();

  // Option A (Conventional / Monoculture sequence)
  const [optACrops, setOptACrops] = useState<[CropType, CropType, CropType]>([
    'wheat',
    'cotton',
    'wheat',
  ]);

  // Option B (Regenerative / Smart Legume rotation)
  const [optBCrops, setOptBCrops] = useState<[CropType, CropType, CropType]>([
    'wheat',
    'berseem',
    'cotton',
  ]);

  const availableCrops: { id: CropType; label: string }[] = [
    { id: 'wheat', label: 'Wheat (گندم)' },
    { id: 'cotton', label: 'Cotton (کپاس)' },
    { id: 'rice', label: 'Rice (چاول)' },
    { id: 'maize', label: 'Maize (مکئی)' },
    { id: 'berseem', label: 'Berseem Clover (برسیم)' },
    { id: 'chickpea', label: 'Chickpea (چنا)' },
    { id: 'mungbean', label: 'Mungbean (مونگ)' },
    { id: 'sugarcane', label: 'Sugarcane (کماد)' },
  ];

  // AI Rotation Comparison state
  const [aiRecommendation, setAiRecommendation] = useState<string | null>(null);
  const [isComparingAi, setIsComparingAi] = useState(false);

  const handleCompareWithAi = async () => {
    setIsComparingAi(true);
    try {
      const selectedLabels = optACrops.map(
        (id) => availableCrops.find((c) => c.id === id)?.label || id
      );
      const res = await fetch('/api/gemini/rotation-compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crops: selectedLabels }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setAiRecommendation(data.error || 'API Key lagao phir AI chalegi');
      } else {
        setAiRecommendation(data.answer || 'AI ka jawab yahan ayega, Compare dabao');
      }
    } catch {
      setAiRecommendation('API Key lagao phir AI chalegi');
    } finally {
      setIsComparingAi(false);
    }
  };

  // Calculate Metrics for any 3-crop sequence
  const calculateSequenceMetrics = (crops: [CropType, CropType, CropType]) => {
    let totalWaterM3 = 0;
    let totalGrossPkr = 0;
    let totalCostPkr = 0;
    let nitrogenScore = 0;
    let monoculturePenalty = 0;

    crops.forEach((crop, idx) => {
      const meta = PUNJAB_CROPS_METADATA[crop] || PUNJAB_CROPS_METADATA.wheat;
      totalWaterM3 += meta.waterNeedM3PerAcre;
      totalGrossPkr += meta.avgGrossRevenuePkrPerAcre;
      totalCostPkr += meta.avgCultivationCostPkrPerAcre;

      if (crop === 'berseem' || crop === 'chickpea' || crop === 'mungbean') {
        nitrogenScore += 30; // Legume N-fixation boost
      }

      // Check if consecutive crops belong to same family
      if (idx > 0 && crops[idx - 1] === crop) {
        monoculturePenalty += 20;
      }
    });

    const netProfitPkr = totalGrossPkr - totalCostPkr;
    const soilScore = Math.max(30, Math.min(95, 55 + nitrogenScore - monoculturePenalty));

    return {
      waterM3: totalWaterM3,
      grossPkr: totalGrossPkr,
      costPkr: totalCostPkr,
      netPkr: netProfitPkr,
      soilHealthScore: soilScore,
      nitrogenFixedKg: nitrogenScore > 0 ? nitrogenScore * 1.5 : 0,
      diversityIndex: new Set(crops).size === 3 ? 'High' : new Set(crops).size === 2 ? 'Moderate' : 'Low (Monoculture)',
    };
  };

  const metricsA = calculateSequenceMetrics(optACrops);
  const metricsB = calculateSequenceMetrics(optBCrops);

  const profitDiff = metricsB.netPkr - metricsA.netPkr;
  const waterDiffPercent = Math.round(((metricsA.waterM3 - metricsB.waterM3) / metricsA.waterM3) * 100);

  return (
    <div className="space-y-8 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#35A853] flex items-center justify-center">
            <GitCompare className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Agronomic Decision Engine
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A]">
              {language === 'ur'
                ? 'فصل روٹیشن سمیولیٹر (What-If Rotation Simulator)'
                : 'Smart What-If Rotation Simulator'}
            </h1>
          </div>
        </div>
        <p className="text-xs text-gray-500 max-w-3xl">
          {language === 'ur'
            ? 'دو مختلف فصلوں کی ترتیب کا موازنہ کریں۔ دیکھیں کہ کس روٹیشن سے پانی کی کتنی بچت، مٹی کی بحالی، اور کتنا خالص منافع حاصل ہوگا۔'
            : 'Simulate and compare any two multi-year crop sequences side-by-side. Observe real-time changes in soil organic health, cumulative irrigation water draw, and 3-year net profit.'}
        </p>
      </div>

      {/* Selectors Grid with Middle Compare Button */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-5 items-stretch">
        {/* Sequence A Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-extrabold">
              Option A (Conventional)
            </span>
            <span className="text-xs text-gray-400">Customizable</span>
          </div>

          <div className="space-y-3">
            {[0, 1, 2].map(cycle => (
              <div key={`a-cycle-${cycle}`}>
                <label className="text-[11px] font-bold text-gray-500 block mb-1">
                  Year {cycle + 1} Crop:
                </label>
                <select
                  value={optACrops[cycle]}
                  onChange={e => {
                    const next = [...optACrops] as [CropType, CropType, CropType];
                    next[cycle] = e.target.value as CropType;
                    setOptACrops(next);
                  }}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 outline-none focus:border-[#35A853]"
                >
                  {availableCrops.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Soil Health:</span>
              <strong className="text-gray-800">{metricsA.soilHealthScore} / 100</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Water Draw:</span>
              <strong className="text-gray-800">{metricsA.waterM3.toLocaleString()} m³/ac</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">3-Yr Net Profit:</span>
              <strong className="text-gray-800">PKR {metricsA.netPkr.toLocaleString()}</strong>
            </div>
          </div>
        </div>

        {/* Middle Compare Button */}
        <div className="flex items-center justify-center py-2 lg:py-0">
          <button
            type="button"
            onClick={handleCompareWithAi}
            disabled={isComparingAi}
            className="px-5 py-3.5 rounded-2xl bg-[#123D2A] hover:bg-[#19533a] disabled:opacity-60 text-white font-extrabold text-xs shadow-lg border border-emerald-400/30 flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer"
          >
            <Sparkles className={`w-4 h-4 text-amber-300 ${isComparingAi ? 'animate-spin' : ''}`} />
            <span>{isComparingAi ? 'AI Soch Raha Hai...' : 'Compare with AI ✨'}</span>
          </button>
        </div>

        {/* Sequence B Card */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#35A853] shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
            <span className="px-3 py-1 bg-[#35A853] text-white rounded-full text-xs font-extrabold">
              Option B (Regenerative AI Match)
            </span>
            <span className="text-xs text-[#35A853] font-bold">Recommended</span>
          </div>

          <div className="space-y-3">
            {[0, 1, 2].map(cycle => (
              <div key={`b-cycle-${cycle}`}>
                <label className="text-[11px] font-bold text-[#123D2A] block mb-1">
                  Year {cycle + 1} Crop:
                </label>
                <select
                  value={optBCrops[cycle]}
                  onChange={e => {
                    const next = [...optBCrops] as [CropType, CropType, CropType];
                    next[cycle] = e.target.value as CropType;
                    setOptBCrops(next);
                  }}
                  className="w-full p-2.5 bg-[#E9F7EF] border border-[#35A853]/40 rounded-xl text-xs font-bold text-[#123D2A] outline-none focus:border-[#35A853]"
                >
                  {availableCrops.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="p-4 bg-[#E9F7EF] rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-emerald-900">Soil Health:</span>
              <strong className="text-emerald-800">{metricsB.soilHealthScore} / 100</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-900">Water Draw:</span>
              <strong className="text-emerald-800">{metricsB.waterM3.toLocaleString()} m³/ac</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-emerald-900">3-Yr Net Profit:</span>
              <strong className="text-[#123D2A]">PKR {metricsB.netPkr.toLocaleString()}</strong>
            </div>
          </div>

          {/* Option B AI Answer Box */}
          <div className="p-4 rounded-2xl bg-[#F5F8F5] border border-[#35A853]/40 text-xs text-[#123D2A]">
            <div className="flex items-center gap-1.5 font-extrabold text-[11px] uppercase text-[#35A853] mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Rotation Suggestion</span>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-gray-800">
              {isComparingAi
                ? 'Gemini AI aapki faslon ka jaiza le raha hai...'
                : aiRecommendation || 'AI ka jawab yahan ayega, Compare dabao'}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Analytics Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-6">
        <h3 className="font-extrabold text-lg text-[#102A43] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          {language === 'ur' ? 'تفصیلی موازنہ اور فوائد' : 'Detailed Comparative Impact'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profit Differential */}
          <div className="p-5 rounded-2xl bg-[#F5F8F5] border border-emerald-900/10 text-center">
            <DollarSign className="w-6 h-6 text-[#35A853] mx-auto mb-2" />
            <span className="text-xs text-gray-500 font-bold block uppercase">Profit Gain in Option B</span>
            <span className="text-2xl font-extrabold text-[#123D2A] block my-1">
              {profitDiff >= 0 ? `+PKR ${profitDiff.toLocaleString()}` : `-PKR ${Math.abs(profitDiff).toLocaleString()}`}
            </span>
            <span className="text-[11px] text-gray-500">
              {profitDiff >= 0 ? 'Higher financial return' : 'Slightly lower cash return but higher soil fertility'}
            </span>
          </div>

          {/* Water Differential */}
          <div className="p-5 rounded-2xl bg-blue-50/70 border border-blue-100 text-center">
            <Droplets className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <span className="text-xs text-blue-700 font-bold block uppercase">Water Efficiency</span>
            <span className="text-2xl font-extrabold text-blue-900 block my-1">
              {waterDiffPercent > 0 ? `${waterDiffPercent}% Saved` : `${Math.abs(waterDiffPercent)}% More Water`}
            </span>
            <span className="text-[11px] text-blue-600">
              {metricsA.waterM3 - metricsB.waterM3 > 0
                ? `${(metricsA.waterM3 - metricsB.waterM3).toLocaleString()} m³ less groundwater pump load`
                : 'Heavy irrigation requirements'}
            </span>
          </div>

          {/* Biological Nitrogen Gain */}
          <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 text-center">
            <Activity className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <span className="text-xs text-purple-700 font-bold block uppercase">Biological Nitrogen</span>
            <span className="text-2xl font-extrabold text-purple-900 block my-1">
              +{metricsB.nitrogenFixedKg} kg N/ac
            </span>
            <span className="text-[11px] text-purple-600">
              Natural Rhizobium nodule fixation from legumes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

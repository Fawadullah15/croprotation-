import React, { useState } from 'react';
import {
  Satellite,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Droplets,
  Fingerprint,
  Activity,
  Layers,
  Thermometer,
  Sun,
  Award,
  Sparkles,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

interface AiRiskItem {
  level: 'High' | 'Medium' | 'Low';
  reasonUrdu: string;
}

interface AiSoilResult {
  waterShortageRisk?: AiRiskItem;
  soilDegradationRisk?: AiRiskItem;
  heatStressRisk?: AiRiskItem;
  recoveryPlan?: { year: string; title: string; detailUrdu: string }[];
}

export const SoilIntelligenceView: React.FC<{ onStartRotation?: () => void }> = ({ onStartRotation }) => {
  const { farmer, cropHistory, currentPlan, language } = useFarm();
  const [aiSoilResult, setAiSoilResult] = useState<AiSoilResult | null>(null);
  const [isCheckingSoil, setIsCheckingSoil] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const levelToColor = (level?: string) => {
    if (level === 'High') return 'bg-red-500';
    if (level === 'Low') return 'bg-emerald-500';
    return 'bg-amber-500';
  };

  const handleCheckSoilWithAi = async () => {
    setIsCheckingSoil(true);
    setAiError(null);
    try {
      const res = await fetch('/api/gemini/soil-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          city: farmer.location.village || 'Faisalabad',
          soilType: farmer.soilType,
          acres: farmer.location.areaAcres,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setAiError(data.error || 'API Key lagao phir AI chalegi');
      } else {
        setAiSoilResult(data);
      }
    } catch {
      setAiError('API Key lagao phir AI chalegi');
    } finally {
      setIsCheckingSoil(false);
    }
  };

  // Farm Risk Radar Evaluation (existing hardcoded values preserved until AI click)
  const riskDimensions = [
    {
      name: 'Water Shortage & Drought Risk',
      urdu: 'پانی کی قلت کا خطرہ',
      level:
        aiSoilResult?.waterShortageRisk?.level ||
        (farmer.waterSource === 'rainwater' ? 'High' : farmer.waterSource === 'tubewell' ? 'Medium' : 'Low'),
      color: aiSoilResult?.waterShortageRisk
        ? levelToColor(aiSoilResult.waterShortageRisk.level)
        : farmer.waterSource === 'rainwater'
        ? 'bg-red-500'
        : farmer.waterSource === 'tubewell'
        ? 'bg-amber-500'
        : 'bg-emerald-500',
      desc:
        aiSoilResult?.waterShortageRisk?.reasonUrdu ||
        'Canal turns availability in Faisalabad division vs aquifer recharge rate.',
    },
    {
      name: 'Soil Degradation & Compaction',
      urdu: 'مٹی کے کٹاؤ اور سخت پن کا خطرہ',
      level:
        aiSoilResult?.soilDegradationRisk?.level ||
        (cropHistory.lastCrop === 'rice' || cropHistory.currentProblem === 'soil_hardness' ? 'High' : 'Medium'),
      color: aiSoilResult?.soilDegradationRisk
        ? levelToColor(aiSoilResult.soilDegradationRisk.level)
        : cropHistory.lastCrop === 'rice' || cropHistory.currentProblem === 'soil_hardness'
        ? 'bg-red-500'
        : 'bg-amber-500',
      desc:
        aiSoilResult?.soilDegradationRisk?.reasonUrdu ||
        'Repeated disc-plow subsoil compaction and lack of biological organic matter.',
    },
    {
      name: 'Monoculture / Repetition Risk',
      urdu: 'مسلسل ایک ہی فصل کا خطرہ',
      level: cropHistory.lastCrop === cropHistory.plannedCrop ? 'High' : 'Low',
      color: cropHistory.lastCrop === cropHistory.plannedCrop ? 'bg-red-500' : 'bg-emerald-500',
      desc: 'Consequent root zone depletion and selective micronutrient mining.',
    },
    {
      name: 'Pest & Soil-borne Disease Pressure',
      urdu: 'کیڑوں اور پھپھوندی کا دباؤ',
      level: cropHistory.currentProblem === 'pest_attack' ? 'High' : 'Low',
      color: cropHistory.currentProblem === 'pest_attack' ? 'bg-red-500' : 'bg-emerald-500',
      desc: 'Survival of fungal spores and pest pupae across identical host plants.',
    },
    {
      name: 'Thermal / Heat Stress Vulnerability',
      urdu: 'موسمیاتی تپش اور گرمی کا خطرہ',
      level: aiSoilResult?.heatStressRisk?.level || 'Medium',
      color: aiSoilResult?.heatStressRisk ? levelToColor(aiSoilResult.heatStressRisk.level) : 'bg-amber-500',
      desc:
        aiSoilResult?.heatStressRisk?.reasonUrdu ||
        'Faisalabad summer heat waves exceeding 42°C during grain filling phases.',
    },
  ];

  // 3-Year Soil Recovery Milestones (updates with AI plan after click)
  const recoveryMilestones = [
    {
      month: aiSoilResult?.recoveryPlan?.[0]?.year || 'Month 0-6 (Season 1)',
      title: aiSoilResult?.recoveryPlan?.[0]?.title || 'Legume Inoculation & Root Nodulation',
      metric: 'Organic Matter: +0.12%',
      detail:
        aiSoilResult?.recoveryPlan?.[0]?.detailUrdu ||
        'Rhizobium bacteria colonies establish on Berseem/Gram root hairs, actively capturing atmospheric Nitrogen.',
    },
    {
      month: aiSoilResult?.recoveryPlan?.[1]?.year || 'Month 6-18 (Season 2)',
      title: aiSoilResult?.recoveryPlan?.[1]?.title || 'Subsoil Macropore & Earthworm Revival',
      metric: 'Water Infiltration: +28%',
      detail:
        aiSoilResult?.recoveryPlan?.[1]?.detailUrdu ||
        'Deep tap-root decay creates biopores that break plow pans without diesel-heavy deep ripping.',
    },
    {
      month: aiSoilResult?.recoveryPlan?.[2]?.year || 'Month 18-36 (Season 3)',
      title: aiSoilResult?.recoveryPlan?.[2]?.title || 'Full Soil Microbiome Equilibrium',
      metric: 'Soil Health Score: 85+/100',
      detail:
        aiSoilResult?.recoveryPlan?.[2]?.detailUrdu ||
        'Stabilized humic fractions increase moisture retention by 40%, cutting future irrigation frequency.',
    },
  ];

  return (
    <div className="space-y-10 animate-fadeIn max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-[#E9F7EF] text-[#35A853] flex items-center justify-center font-bold">
              <Satellite className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                Remote Sensing &amp; Agronomy
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A]">
                {language === 'ur'
                  ? 'مٹی کی سمارٹ جانچ (Soil Intelligence Platform)'
                  : 'Soil Intelligence & Satellite Telemetry'}
              </h1>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            NASA Earth Observation sensors combined with soil physics and microbial regeneration metrics tailored to Faisalabad, Punjab.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCheckSoilWithAi}
            disabled={isCheckingSoil}
            className="px-4 py-2 bg-[#123D2A] hover:bg-[#19533a] disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-300 ${isCheckingSoil ? 'animate-spin' : ''}`} />
            <span>{isCheckingSoil ? 'Checking Soil...' : 'Check My Soil with AI ✨'}</span>
          </button>

          {onStartRotation && (
            <button
              onClick={onStartRotation}
              className="px-5 py-2.5 bg-[#35A853] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow transition-all"
            >
              Launch Rotation Wizard →
            </button>
          )}
        </div>
      </div>

      {aiError && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900">
          {aiError}
        </div>
      )}

      {/* Farm Fingerprint Card */}
      <div className="bg-gradient-to-r from-[#123D2A] to-[#102A43] text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-wrap items-center justify-between gap-6 border border-emerald-500/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-[#35A853]">
            <Fingerprint className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 uppercase tracking-widest font-bold">
              Unique Farm Digital Identity
            </span>
            <h3 className="text-xl font-extrabold text-white">
              {farmer.name}'s Agricultural Plot Fingerprint
            </h3>
            <p className="text-xs text-emerald-100">
              {farmer.location.village}, Faisalabad • ID: AGRO-PK-{Math.abs(farmer.location.lat * 100).toFixed(0)}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="bg-white/10 backdrop-blur px-3 py-2 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] text-gray-300 block">Soil Class</span>
            <strong className="text-emerald-300 uppercase">{farmer.soilType} Soil</strong>
          </div>
          <div className="bg-white/10 backdrop-blur px-3 py-2 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] text-gray-300 block">Water Regime</span>
            <strong className="text-blue-300 uppercase">{farmer.waterSource}</strong>
          </div>
          <div className="bg-white/10 backdrop-blur px-3 py-2 rounded-xl border border-white/10 text-center">
            <span className="text-[10px] text-gray-300 block">Land Parcel</span>
            <strong className="text-white">{farmer.location.areaAcres} Acres</strong>
          </div>
        </div>
      </div>

      {/* Smart Farm Risk Radar */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-red-600 tracking-wider">
              Diagnostic Threat Matrix
            </span>
            <h2 className="text-xl font-extrabold text-[#102A43]">
              {language === 'ur' ? 'کھیت کا سمارٹ رسک ریڈار (Risk Radar)' : 'Smart Farm Risk Radar'}
            </h2>
          </div>
        </div>

        <div className="space-y-3">
          {riskDimensions.map((r, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-wrap items-center justify-between gap-4 hover:bg-emerald-50/30 transition-colors"
            >
              <div className="space-y-0.5 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-gray-900">{r.name}</span>
                  <span className="text-xs text-gray-500 font-urdu">{r.urdu}</span>
                </div>
                <p className="text-xs text-gray-600">{r.desc}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-700">{r.level} Risk</span>
                <span className={`w-3.5 h-3.5 rounded-full ${r.color} shadow-sm ring-2 ring-white`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Soil Recovery Journey (3 Years) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#35A853] flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Regenerative Transition
            </span>
            <h2 className="text-xl font-extrabold text-[#102A43]">
              {language === 'ur' ? 'تین سالہ مٹی بحالی کا سفر' : 'Visual Three-Year Soil Recovery Journey'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recoveryMilestones.map((m, idx) => (
            <div
              key={idx}
              className="bg-[#F5F8F5] rounded-2xl p-6 border-2 border-emerald-900/10 hover:border-[#35A853] transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <span className="px-3 py-1 rounded-full bg-[#123D2A] text-white font-extrabold text-xs inline-block mb-2">
                  {m.month}
                </span>
                <h3 className="font-extrabold text-base text-[#123D2A]">{m.title}</h3>
                <p className="text-xs text-gray-600 leading-relaxed mt-2">{m.detail}</p>
              </div>

              <div className="pt-3 border-t border-emerald-900/10">
                <span className="text-xs font-bold text-[#35A853] bg-white px-2.5 py-1 rounded-lg border border-gray-200 inline-block shadow-2xs">
                  {m.metric}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

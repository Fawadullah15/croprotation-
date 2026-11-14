import React, { useState } from 'react';
import {
  Satellite,
  XCircle,
  CheckCircle,
  Calendar,
  Activity,
  Droplets,
  DollarSign,
  MapPin,
  Download,
  Printer,
  RotateCcw,
  Sparkles,
  Info,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
  Sliders,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { generateCropRotationPdf } from '../../utils/pdfGenerator';
import { RotationPlanResult } from '../../types';

interface Step3Props {
  onNewPlan: () => void;
  onOpenMap: () => void;
}

export const Step3RotationResults: React.FC<Step3Props> = ({ onNewPlan, onOpenMap }) => {
  const { currentPlan, language } = useFarm();
  const [customPricePkr, setCustomPricePkr] = useState<number>(3900); // PKR per maund
  const [showPriceAdjuster, setShowPriceAdjuster] = useState(false);

  if (!currentPlan) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
        <p className="text-gray-500 text-sm">Please complete Step 1 and Step 2 to generate your personalized crop rotation plan.</p>
      </div>
    );
  }

  const p = currentPlan;
  const farmerName = p.farmer.name || 'Kisan Bhai';

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    generateCropRotationPdf(p);
  };

  return (
    <div className="space-y-10 animate-fadeIn printable-report">
      {/* Top Header & Action Buttons */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#35A853] uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            {language === 'ur' ? 'مصنوعی ذہانت و سیٹلائٹ تجزیہ مکمل' : 'AI & NASA Satellite Analysis Complete'}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A]">
            {language === 'ur'
              ? `سلام ${farmerName} بھائی! آپ کا سمارٹ روٹیشن پلان تیار ہے`
              : `Salam ${farmerName} Bhai! Your Crop Rotation Plan`}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            {p.farmer.location.village}, {p.farmer.location.district} • {p.farmer.location.areaAcres} Acres ({p.farmer.location.areaHectares} Ha) • {p.farmer.soilType.toUpperCase()} Soil
          </p>
        </div>

        {/* Action Buttons: PDF & Print */}
        <div className="flex flex-wrap items-center gap-2.5 no-print">
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2.5 bg-[#123D2A] hover:bg-[#1b553b] text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-2 active:scale-95"
            title="Download full multi-page PDF"
          >
            <Download className="w-4 h-4 text-[#35A853]" />
            <span>{language === 'ur' ? 'پی ڈی ایف ڈاؤنلوڈ کریں' : 'DOWNLOAD PDF'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2.5 bg-white hover:bg-gray-100 text-[#102A43] border border-gray-300 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-2 active:scale-95"
            title="Open browser print preview"
          >
            <Printer className="w-4 h-4 text-blue-600" />
            <span>{language === 'ur' ? 'پرنٹ رپورٹ' : 'PRINT REPORT'}</span>
          </button>

          <button
            onClick={onNewPlan}
            className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
            title="Start fresh plan"
          >
            <RotateCcw className="w-3.5 h-3.5 text-gray-600" />
            <span>{language === 'ur' ? 'نیا پلان' : 'New Plan'}</span>
          </button>
        </div>
      </div>

      {/* SECTION A: NASA SATELLITE EVIDENCE (MUST APPEAR FIRST) */}
      <section className="bg-gradient-to-br from-[#102A43] to-[#123D2A] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 print-no-break">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#35A853]/20 border border-[#35A853] flex items-center justify-center text-[#35A853]">
              <Satellite className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">
                Geospatial Earth Observation
              </span>
              <h2 className="text-xl font-extrabold text-white">
                {language === 'ur'
                  ? 'A. ناسا سیٹلائٹ شواہد (NASA Earth Observation Data)'
                  : 'A. NASA SATELLITE EVIDENCE'}
              </h2>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
              {p.nasaEvidence.isLiveOrCalibrated === 'live_feed' ? 'Live Geospatial Stream' : 'Calibrated Earth Observation'}
            </span>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Lat {p.nasaEvidence.coordinates.lat.toFixed(4)}, Lng {p.nasaEvidence.coordinates.lng.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* 1. SMAP */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10 hover:border-[#35A853]/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-300 uppercase">1. NASA SMAP L4</span>
              <span className="text-[10px] text-gray-300 bg-white/10 px-2 py-0.5 rounded">
                Soil Moisture
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold text-white">
                {p.nasaEvidence.smap.volumetricPercent}%
              </span>
              <span className="text-xs text-emerald-300 font-mono">
                ({p.nasaEvidence.smap.soilMoisture} m³/m³)
              </span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden my-2">
              <div
                className="bg-[#35A853] h-full rounded-full transition-all duration-1000"
                style={{ width: `${Math.min(100, p.nasaEvidence.smap.volumetricPercent * 2.5)}%` }}
              />
            </div>
            <p className="text-xs text-gray-200 leading-relaxed mt-2">
              {p.nasaEvidence.smap.description}
            </p>
            <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-gray-400 flex justify-between">
              <span>Status: <strong className="text-emerald-300 uppercase">{p.nasaEvidence.smap.status}</strong></span>
              <span>{p.nasaEvidence.smap.observationDate}</span>
            </div>
          </div>

          {/* 2. MODIS NDVI */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10 hover:border-[#35A853]/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-300 uppercase">2. MODIS MOD13Q1</span>
              <span className="text-[10px] text-gray-300 bg-white/10 px-2 py-0.5 rounded">
                Canopy NDVI
              </span>
            </div>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="text-3xl font-extrabold text-[#35A853]">
                {p.nasaEvidence.modis.ndvi}
              </span>
              <span className="text-xs text-white/80">/ 1.0 Index</span>
            </div>
            <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden my-2">
              <div
                className="bg-emerald-400 h-full rounded-full transition-all duration-1000"
                style={{ width: `${p.nasaEvidence.modis.ndvi * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-200 leading-relaxed mt-2">
              {p.nasaEvidence.modis.description}
            </p>
            <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-gray-400 flex justify-between">
              <span>Vigor: <strong className="text-emerald-300">{p.nasaEvidence.modis.vegetativeStatus}</strong></span>
              <span>Trend: <strong className="text-white capitalize">{p.nasaEvidence.modis.trend}</strong></span>
            </div>
          </div>

          {/* 3. NASA POWER Agroclimatology */}
          <div className="bg-white/10 backdrop-blur rounded-2xl p-5 border border-white/10 hover:border-[#35A853]/50 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-emerald-300 uppercase">3. NASA POWER AG</span>
              <span className="text-[10px] text-gray-300 bg-white/10 px-2 py-0.5 rounded">
                Climate &amp; Solar
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="text-[10px] text-gray-400 block">Temperature</span>
                <span className="text-lg font-bold text-white">{p.nasaEvidence.power.temperatureC} °C</span>
              </div>
              <div className="bg-white/5 p-2 rounded-lg">
                <span className="text-[10px] text-gray-400 block">Monthly Rain</span>
                <span className="text-lg font-bold text-blue-300">{p.nasaEvidence.power.rainfallMmMonthly} mm</span>
              </div>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed">
              Solar: {p.nasaEvidence.power.solarRadiationMj} MJ/m²/day. {p.nasaEvidence.power.description}
            </p>
            <div className="mt-3 pt-2 border-t border-white/10 text-[10px] text-gray-400 flex justify-between">
              <span>Source: NASA Langley RC</span>
              <span>{p.nasaEvidence.power.observationDate}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-2.5 rounded-xl bg-black/20 border border-white/5 text-[11px] text-emerald-200 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {language === 'ur'
              ? 'وضاحت: تمام پیمائشیں امریکی خلائی ادارے ناسا کے سیٹلائٹس سے حاصل کردہ فیصل آباد کی جغرافیائی معلومات پر مبنی ہیں۔'
              : 'Observation Note: All measurements are georeferenced from NASA Earthdata sensors calibrated for Faisalabad agricultural coordinates.'}
          </span>
        </div>
      </section>

      {/* SECTION B & C: DON'T PLANT THIS & DO PLANT THIS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 print-no-break">
        {/* SECTION B: DON'T PLANT THIS (Red Warning Card) */}
        <section className="bg-red-50/90 border-2 border-red-500 rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-red-500 text-white text-[11px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
            Critical Agronomic Alert
          </div>

          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-red-100 border border-red-300 flex items-center justify-center shrink-0 text-red-600 shadow-sm">
              <XCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-red-700 uppercase tracking-wide">
                B. Avoidance Warning
              </span>
              <h2 className="text-xl font-extrabold text-red-950">
                {language === 'ur' ? 'یہ ہرگز نہ لگائیں (DON\'T PLANT THIS)' : 'DON\'T PLANT THIS'}
              </h2>
            </div>
          </div>

          <div className="bg-white/80 rounded-2xl p-4 border border-red-200 mb-4">
            <h3 className="font-extrabold text-red-900 text-base mb-1">
              {p.dontPlantThis.title}
            </h3>
            <p className="text-xs text-red-700 italic">
              {p.dontPlantThis.agronomicDanger}
            </p>
          </div>

          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-red-900 uppercase tracking-wider">
              {language === 'ur' ? 'سائنسی اور زرعی وجوہات:' : 'Agronomic Reasons for Avoidance:'}
            </h4>
            <ul className="space-y-2">
              {p.dontPlantThis.reasons.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-red-900 bg-white/60 p-2.5 rounded-xl border border-red-100">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* SECTION C: DO PLANT THIS (Premium Green Recommendation Card) */}
        <section className="bg-emerald-50/90 border-2 border-[#35A853] rounded-3xl p-6 sm:p-7 shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[#35A853] text-white text-[11px] font-extrabold uppercase px-4 py-1 rounded-bl-xl tracking-wider">
            Top Recommendation Match
          </div>

          <div className="flex items-start gap-3.5 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 border border-emerald-300 flex items-center justify-center shrink-0 text-[#35A853] shadow-sm">
              <CheckCircle className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#123D2A] uppercase tracking-wide">
                C. Optimal Rotational Crop
              </span>
              <h2 className="text-xl font-extrabold text-[#123D2A]">
                {language === 'ur' ? 'یہ لگائیں (DO PLANT THIS)' : 'DO PLANT THIS'}
              </h2>
            </div>
          </div>

          <div className="bg-white/90 rounded-2xl p-4 border border-emerald-200 mb-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#35A853] font-bold uppercase tracking-wider">
                  Season: {p.doPlantThis.season} Cycle
                </span>
                <h3 className="font-extrabold text-2xl text-[#123D2A]">
                  {p.doPlantThis.urduName}
                </h3>
              </div>
              <span className="px-3 py-1 bg-[#E9F7EF] text-[#123D2A] text-xs font-extrabold rounded-lg border border-[#35A853]/30">
                Variety: {p.doPlantThis.varietyRecommended}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-emerald-100 text-xs">
              <div>
                <span className="text-gray-500 text-[10px] block">Water Requirement</span>
                <strong className="text-emerald-800">{p.doPlantThis.waterRequirement.category} ({p.doPlantThis.waterRequirement.amountMm} mm)</strong>
              </div>
              <div>
                <span className="text-gray-500 text-[10px] block">Water Savings</span>
                <strong className="text-emerald-800">+{p.doPlantThis.waterRequirement.savingsComparedToConventional}% vs Conventional</strong>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-[#123D2A] uppercase tracking-wider">
              {language === 'ur' ? 'متوقع فوائد اور مٹی کی بحالی:' : 'Why It Is Recommended & Expected Benefits:'}
            </h4>
            <ul className="space-y-1.5">
              {p.doPlantThis.whyRecommended.map((why, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-gray-800 bg-white/70 p-2.5 rounded-xl border border-emerald-100">
                  <ShieldCheck className="w-4 h-4 text-[#35A853] shrink-0 mt-0.5" />
                  <span>{why}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>

      {/* SECTION D: THREE-YEAR CROP ROTATION TIMELINE */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm print-no-break">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-purple-600 tracking-wider">
              Long-Term Agronomic Roadmap
            </span>
            <h2 className="text-xl font-extrabold text-[#102A43]">
              {language === 'ur'
                ? 'D. تین سالہ سمارٹ فصل روٹیشن ٹائم لائن (Three-Year Timeline)'
                : 'D. THREE-YEAR CROP ROTATION TIMELINE'}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {p.timeline.map((step, idx) => (
            <div
              key={idx}
              className="bg-[#F5F8F5] rounded-2xl p-5 border-2 border-emerald-900/10 hover:border-[#35A853] transition-all relative flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full bg-[#123D2A] text-white font-extrabold text-xs">
                  Year {step.year}
                </span>
                <span className="text-[11px] font-bold text-emerald-800">
                  {step.season}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="font-extrabold text-lg text-[#123D2A]">
                  {step.primaryCrop}
                </h3>
                <p className="text-xs text-emerald-900 font-semibold">{step.urduName}</p>
                <div className="inline-block bg-white px-2 py-0.5 rounded text-[10px] text-gray-600 border border-gray-200">
                  Family: {step.cropFamily}
                </div>
                <p className="text-xs text-gray-700 leading-relaxed pt-1">
                  {step.soilImpact}
                </p>
              </div>

              <div className="pt-3 border-t border-emerald-900/10 flex items-center justify-between text-xs">
                <span className="text-gray-500">Water: <strong>{step.waterNeed}</strong></span>
                <span className="font-bold text-[#123D2A]">
                  Net: PKR {step.expectedNetPkrPerAcre.toLocaleString()}/ac
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION E, F, G: SOIL HEALTH SCORE, WATER BUDGET, PROFIT POTENTIAL */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print-no-break">
        {/* SECTION E: SOIL HEALTH SCORE GAUGE */}
        <section className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-emerald-600" />
              <h3 className="font-extrabold text-base text-[#102A43]">
                {language === 'ur' ? 'E. مٹی کی صحت کا اسکور' : 'E. Soil Health Score'}
              </h3>
            </div>

            {/* Circular Gauge Visual */}
            <div className="flex flex-col items-center justify-center my-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Background Circle */}
                  <circle cx="50" cy="50" r="42" className="text-gray-200" strokeWidth="8" stroke="currentColor" fill="transparent" />
                  {/* Progress Circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    className="text-[#35A853] transition-all duration-1000"
                    strokeWidth="8"
                    strokeDasharray={264}
                    strokeDashoffset={264 - (264 * p.soilHealth.projectedThreeYearScore) / 100}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xs font-bold text-gray-400 block">Target Score</span>
                  <span className="text-3xl font-extrabold text-[#123D2A]">
                    {p.soilHealth.projectedThreeYearScore}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold block">
                    +{p.soilHealth.improvementPercent}% Gain
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Current Baseline:</span>
                <strong className="text-gray-800">{p.soilHealth.currentScore} / 100</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Projected (Year 3):</span>
                <strong className="text-emerald-700">{p.soilHealth.projectedThreeYearScore} / 100</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Organic Matter:</span>
                <strong className="text-gray-800">{p.soilHealth.organicMatterChange.from}% → {p.soilHealth.organicMatterChange.to}%</strong>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 italic mt-4">
            {p.soilHealth.disclaimer}
          </p>
        </section>

        {/* SECTION F: WATER BUDGET */}
        <section className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Droplets className="w-5 h-5 text-blue-600" />
              <h3 className="font-extrabold text-base text-[#102A43]">
                {language === 'ur' ? 'F. واٹر بجٹ و بچت' : 'F. Water Budget'}
              </h3>
            </div>

            <div className="text-center py-2 mb-4 bg-blue-50/70 rounded-2xl p-4 border border-blue-100">
              <span className="text-xs text-blue-700 font-bold block">Total Water Savings</span>
              <span className="text-3xl font-extrabold text-blue-900">
                {p.waterBudget.savingsPercent}% Less
              </span>
              <span className="text-xs text-blue-600 block mt-0.5">
                {p.waterBudget.potentialSavingsM3.toLocaleString()} m³ Saved Across Field
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Conventional Need:</span>
                  <span className="font-bold">{p.waterBudget.conventionalRequirementM3.toLocaleString()} m³</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-400 h-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>AgroSpace Recommended:</span>
                  <span className="font-bold text-emerald-700">{p.waterBudget.recommendedRequirementM3.toLocaleString()} m³</span>
                </div>
                <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#35A853] h-full"
                    style={{ width: `${100 - p.waterBudget.savingsPercent}%` }}
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-600">
                <p>Saved: <strong>{p.waterBudget.acreInchesSaved} acre-inches</strong> of groundwater &amp; canal quota.</p>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 italic mt-4">
            {p.waterBudget.canalTurnRequirement}
          </p>
        </section>

        {/* SECTION G: PROFIT POTENTIAL */}
        <section className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-[#102A43]">
                  {language === 'ur' ? 'G. منافع کا تخمینہ' : 'G. Profit Potential'}
                </h3>
              </div>
              <button
                onClick={() => setShowPriceAdjuster(!showPriceAdjuster)}
                className="text-xs text-[#35A853] hover:underline flex items-center gap-1 font-semibold no-print"
              >
                <Sliders className="w-3 h-3" />
                Adjust Rate
              </button>
            </div>

            {/* Price Adjuster Drawer */}
            {showPriceAdjuster && (
              <div className="mb-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs no-print">
                <label className="block text-gray-700 font-bold mb-1">
                  Local Market Rate (PKR / Maund)
                </label>
                <input
                  type="number"
                  step="100"
                  value={customPricePkr}
                  onChange={e => setCustomPricePkr(parseFloat(e.target.value) || 3900)}
                  className="w-full p-1.5 bg-white border border-gray-300 rounded font-bold"
                />
              </div>
            )}

            <div className="text-center py-2 mb-4 bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <span className="text-xs text-emerald-800 font-bold block">Estimated Net Profit Increase</span>
              <span className="text-3xl font-extrabold text-[#123D2A]">
                +PKR {p.profit.netGainPkr.toLocaleString()}
              </span>
              <span className="text-xs text-emerald-600 font-bold block mt-0.5">
                +{p.profit.gainPercentage}% Higher Margin
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Gross Return:</span>
                <strong className="text-gray-900">PKR {p.profit.recommendedGrossPkr.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100">
                <span className="text-gray-500">Cultivation Cost:</span>
                <strong className="text-red-700">-PKR {p.profit.recommendedCostPkr.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-100 font-bold">
                <span className="text-gray-800">Net Estimated Profit:</span>
                <strong className="text-emerald-800">PKR {p.profit.recommendedNetPkr.toLocaleString()}</strong>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-gray-400 italic mt-4">
            {p.profit.disclaimer}
          </p>
        </section>
      </div>

      {/* SECTION H: FARM LOCATION SUMMARY */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm print-no-break">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#35A853] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                Geospatial Boundary Overview
              </span>
              <h2 className="text-xl font-extrabold text-[#102A43]">
                {language === 'ur'
                  ? 'H. فارم لوکیشن کا خلاصہ (Farm Location Summary)'
                  : 'H. FARM LOCATION SUMMARY'}
              </h2>
            </div>
          </div>

          <button
            onClick={onOpenMap}
            className="text-xs font-bold text-[#35A853] hover:underline flex items-center gap-1 no-print"
          >
            Open in Google Maps MapView
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F5F8F5] border border-emerald-900/10 text-xs">
          <div>
            <span className="text-gray-500 text-[10px] uppercase font-bold block">Village / Chak</span>
            <strong className="text-[#123D2A] text-sm">{p.farmer.location.village}</strong>
          </div>
          <div>
            <span className="text-gray-500 text-[10px] uppercase font-bold block">District</span>
            <strong className="text-[#123D2A] text-sm">{p.farmer.location.district}</strong>
          </div>
          <div>
            <span className="text-gray-500 text-[10px] uppercase font-bold block">Coordinates</span>
            <strong className="text-[#123D2A] text-sm">
              {p.farmer.location.lat.toFixed(4)} N, {p.farmer.location.lng.toFixed(4)} E
            </strong>
          </div>
          <div>
            <span className="text-gray-500 text-[10px] uppercase font-bold block">Total Mapped Land</span>
            <strong className="text-[#35A853] text-sm">
              {p.farmer.location.areaAcres.toFixed(1)} Acres ({p.farmer.location.areaHectares.toFixed(2)} Ha)
            </strong>
          </div>
        </div>
      </section>

      {/* Floating Bottom Print Bar for easy access on mobile */}
      <div className="bg-[#123D2A] text-white p-4 rounded-2xl shadow-xl flex flex-wrap items-center justify-between gap-3 no-print">
        <div className="flex items-center gap-2">
          <Printer className="w-5 h-5 text-[#35A853]" />
          <div>
            <p className="text-xs font-bold">Print &amp; Official Records Ready</p>
            <p className="text-[10px] text-emerald-200">Export or print this plan directly for your agriculture records or bank loans.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            className="px-4 py-2 bg-[#35A853] hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            PDF Export
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-white text-[#123D2A] hover:bg-gray-100 rounded-xl text-xs font-bold shadow flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-blue-600" />
            Print A4
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Sprout,
  AlertTriangle,
  ArrowLeft,
  Sparkles,
  TrendingUp,
  Droplets,
  Check,
  Wheat,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { CropType, CropProblem } from '../../types';
import { PUNJAB_CROPS_METADATA } from '../../data/punjabAgriData';

interface Step2Props {
  onBack: () => void;
  onGenerate: () => void;
}

export const Step2CropInfo: React.FC<Step2Props> = ({ onBack, onGenerate }) => {
  const { cropHistory, updateCropHistory, language, isGenerating } = useFarm();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const cropsList: { id: CropType; label: string; urdu: string }[] = [
    { id: 'wheat', label: 'Wheat (گندم)', urdu: 'گندم' },
    { id: 'rice', label: 'Rice / Paddy (چاول)', urdu: 'چاول / دھان' },
    { id: 'cotton', label: 'Cotton (کپاس)', urdu: 'کپاس' },
    { id: 'maize', label: 'Maize (مکئی)', urdu: 'مکئی' },
    { id: 'sugarcane', label: 'Sugarcane (کماد)', urdu: 'کماد' },
    { id: 'berseem', label: 'Berseem Clover (برسیم)', urdu: 'برسیم' },
    { id: 'chickpea', label: 'Chickpea (چنا)', urdu: 'چنا' },
    { id: 'lentils', label: 'Lentils (مسور)', urdu: 'مسور' },
    { id: 'other', label: 'Other Crop (دیگر)', urdu: 'دیگر فصل' },
  ];

  const problemsList: { id: CropProblem; label: string; urdu: string; color: string }[] = [
    { id: 'none', label: 'No Problem (Healthy)', urdu: 'کوئی مسئلہ نہیں (سب ٹھیک)', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
    { id: 'yellow_leaves', label: 'Yellow Leaves (Chlorosis / N-Deficiency)', urdu: 'پیلے پتے (نائٹروجن کی کمی)', color: 'border-amber-300 bg-amber-50 text-amber-800' },
    { id: 'pest_attack', label: 'Pest Attack (Bollworm, Whitefly, Rust)', urdu: 'کیڑوں یا سنڈیوں کا حملہ', color: 'border-red-300 bg-red-50 text-red-800' },
    { id: 'soil_hardness', label: 'Soil Hardness (Plow-pan compaction)', urdu: 'مٹی کا سخت پن (Hardpan)', color: 'border-stone-300 bg-stone-50 text-stone-800' },
    { id: 'water_shortage', label: 'Water Shortage (Canal / Tubewell issue)', urdu: 'پانی کی شدید قلت', color: 'border-blue-300 bg-blue-50 text-blue-800' },
    { id: 'heat_stress', label: 'Heat Stress / Terminal Heat', urdu: 'گرمی کی لہر کا اثر', color: 'border-orange-300 bg-orange-50 text-orange-800' },
  ];

  const handleValidateAndGenerate = () => {
    const errs: Record<string, string> = {};
    if (!cropHistory.lastCrop) {
      errs.lastCrop = language === 'ur' ? 'پچھلی فصل منتخب کریں' : 'Please select last grown crop';
    }
    if (!cropHistory.plannedCrop) {
      errs.plannedCrop = language === 'ur' ? 'آئندہ لگانے والی فصل منتخب کریں' : 'Please select planned crop';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    onGenerate();
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E9F7EF] text-[#35A853] flex items-center justify-center font-bold text-lg">
            2
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#123D2A]">
              {language === 'ur' ? 'اب اپنی فصل بتائیں' : 'Step 2: Crop History & Intent'}
            </h2>
            <p className="text-xs text-gray-500">
              {language === 'ur'
                ? 'پچھلی فصلوں کی ہسٹری اور آئندہ کے ارادے کی مدد سے روٹیشن کی خرابیوں کو دور کیا جاتا ہے'
                : 'Crop sequence history helps our agronomic engine identify nutrient depletion and break pest cycles.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Field 1: Last Grown Crop */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
          <label className="block text-sm font-bold text-[#102A43]">
            {language === 'ur' ? '1. پچھلی کٹائی والی فصل (Last Grown Crop) *' : '1. Last Grown Crop (Harvested) *'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cropsList.slice(0, 6).map(c => (
              <button
                type="button"
                key={`last-${c.id}`}
                onClick={() => updateCropHistory({ lastCrop: c.id })}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  cropHistory.lastCrop === c.id
                    ? 'border-[#35A853] bg-[#E9F7EF] text-[#123D2A] font-bold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-semibold">{c.label.split(' ')[0]}</div>
                <div className="text-[11px] text-gray-500">{language === 'ur' ? c.urdu : c.label.split('(')[1]?.replace(')', '')}</div>
              </button>
            ))}
          </div>
          {errors.lastCrop && <p className="text-xs text-red-500">{errors.lastCrop}</p>}
        </div>

        {/* Field 2: Crop Before That */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
          <label className="block text-sm font-bold text-[#102A43]">
            {language === 'ur' ? '2. اس سے پہلے کون سی فصل تھی؟ (Crop Before That)' : '2. Crop Before That (Two cycles ago)'}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {cropsList.slice(0, 6).map(c => (
              <button
                type="button"
                key={`before-${c.id}`}
                onClick={() => updateCropHistory({ cropBeforeThat: c.id })}
                className={`p-3 rounded-xl border text-left text-xs transition-all ${
                  cropHistory.cropBeforeThat === c.id
                    ? 'border-[#35A853] bg-[#E9F7EF] text-[#123D2A] font-bold shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-semibold">{c.label.split(' ')[0]}</div>
                <div className="text-[11px] text-gray-500">{language === 'ur' ? c.urdu : c.label.split('(')[1]?.replace(')', '')}</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Field 3: What Do You Plan to Plant Now? */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-bold text-[#102A43]">
            {language === 'ur' ? '3. اب آپ کا کیا لگانے کا ارادہ ہے؟ (Planned Next Crop) *' : '3. What Do You Currently Plan to Plant Now? *'}
          </label>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
            AI will evaluate if this is safe or recommend better
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {cropsList.map(c => (
            <button
              type="button"
              key={`plan-${c.id}`}
              onClick={() => updateCropHistory({ plannedCrop: c.id })}
              className={`p-3.5 rounded-xl border text-left text-xs transition-all flex flex-col justify-between ${
                cropHistory.plannedCrop === c.id
                  ? 'border-[#35A853] bg-[#123D2A] text-white font-bold shadow-md scale-[1.02]'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="font-bold text-sm">{c.label.split(' ')[0]}</span>
              <span className={`text-[11px] mt-1 ${cropHistory.plannedCrop === c.id ? 'text-emerald-300' : 'text-gray-500'}`}>
                {c.urdu}
              </span>
            </button>
          ))}
        </div>
        {errors.plannedCrop && <p className="text-xs text-red-500">{errors.plannedCrop}</p>}
      </div>

      {/* Field 4: Current Crop Problems */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
        <label className="block text-sm font-bold text-[#102A43]">
          {language === 'ur' ? '4. کھیت میں موجودہ مسائل یا بیماریاں (Current Crop Problems)' : '4. Current Crop / Field Soil Problems'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {problemsList.map(pr => (
            <button
              type="button"
              key={`prob-${pr.id}`}
              onClick={() => updateCropHistory({ currentProblem: pr.id })}
              className={`p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                cropHistory.currentProblem === pr.id
                  ? `${pr.color} ring-2 ring-[#35A853] font-bold shadow-sm`
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <span>{language === 'ur' ? pr.urdu : pr.label}</span>
              {cropHistory.currentProblem === pr.id && <Check className="w-4 h-4 text-current" />}
            </button>
          ))}
        </div>
      </div>

      {/* Optional Details: Yield & Irrigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-gray-700">
            {language === 'ur' ? '5. پچھلی فصل کی پیداوار (من فی ایکڑ - اختیاری)' : '5. Previous Crop Yield (Maunds / Acre - Optional)'}
          </label>
          <div className="relative">
            <input
              type="number"
              placeholder="e.g. 38"
              value={cropHistory.previousYield || ''}
              onChange={e => updateCropHistory({ previousYield: parseFloat(e.target.value) || undefined })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#35A853] outline-none"
            />
            <span className="absolute right-3 top-2 text-xs text-gray-400 font-bold">Maunds/Ac</span>
          </div>
          <p className="text-[11px] text-gray-500">1 Maund (من) = 40 kg. Punjab average is ~32-40 maunds/acre for wheat.</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-3">
          <label className="block text-xs font-bold text-gray-700">
            {language === 'ur' ? '6. آبپاشی کی دستیابی (Irrigation Availability)' : '6. Irrigation Availability Level'}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'full', label: 'Full / Normal', urdu: 'مکمل تسلی بخش' },
              { id: 'moderate', label: 'Moderate', urdu: 'درمیانی' },
              { id: 'scarce', label: 'Scarce / Low', urdu: 'شدید قلت' },
            ].map(irr => (
              <button
                type="button"
                key={irr.id}
                onClick={() => updateCropHistory({ irrigationAvailability: irr.id as any })}
                className={`p-2.5 rounded-xl border text-center text-xs transition-all ${
                  cropHistory.irrigationAvailability === irr.id
                    ? 'border-[#35A853] bg-[#E9F7EF] text-[#123D2A] font-bold'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {language === 'ur' ? irr.urdu : irr.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-3 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded-xl font-bold text-xs transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ur' ? 'واپس مرحلہ 1' : 'Back to Step 1'}</span>
        </button>

        <button
          type="button"
          disabled={isGenerating}
          onClick={handleValidateAndGenerate}
          className="px-8 py-3.5 bg-gradient-to-r from-[#123D2A] to-[#35A853] hover:from-emerald-950 hover:to-emerald-700 text-white rounded-xl font-extrabold text-sm shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          <span>
            {isGenerating
              ? language === 'ur'
                ? 'روٹیشن پلان بن رہا ہے...'
                : 'Analyzing NASA Data & Generating...'
              : language === 'ur'
              ? 'میرا روٹیشن پلان بنائیں'
              : 'Generate My Crop Rotation Plan'}
          </span>
        </button>
      </div>
    </div>
  );
};

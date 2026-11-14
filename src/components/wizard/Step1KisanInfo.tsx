import React, { useState } from 'react';
import {
  User,
  Phone,
  MapPin,
  Maximize2,
  Droplets,
  Award,
  Sparkles,
  ArrowRight,
  TestTube,
  Check,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { SoilType, WaterSource, FarmingPriority } from '../../types';

interface Step1Props {
  onNext: () => void;
  onOpenMap: () => void;
}

export const Step1KisanInfo: React.FC<Step1Props> = ({ onNext, onOpenMap }) => {
  const { farmer, updateFarmer, language } = useFarm();
  const [showSoilTest, setShowSoilTest] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateAndProceed = () => {
    const errs: Record<string, string> = {};
    if (!farmer.name.trim()) {
      errs.name = language === 'ur' ? 'کسان بھائی کا نام درج کریں' : 'Farmer name is required';
    }
    if (!farmer.village.trim()) {
      errs.village = language === 'ur' ? 'گاؤں یا شہر کا نام درج کریں' : 'Village/City is required';
    }
    if (farmer.location.areaAcres <= 0) {
      errs.area = language === 'ur' ? 'زمین کا رقبہ درج کریں' : 'Land area must be greater than 0';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    onNext();
  };

  const soilTypes: { id: SoilType; name: string; urdu: string; desc: string; img: string }[] = [
    {
      id: 'loamy',
      name: 'Loamy Soil (Maira)',
      urdu: 'میرا مٹی (زرخیز ترین)',
      desc: 'Ideal silt-sand-clay balance. Faisalabad heartland soil with high fertility.',
      img: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a40?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'sandy',
      name: 'Sandy Soil (Retli)',
      urdu: 'ریتلی مٹی',
      desc: 'Quick draining, loose texture. Prone to nutrient leaching; needs water-saving legumes.',
      img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'clay',
      name: 'Clay Soil (Paki / Chikni)',
      urdu: 'چکنی مٹی',
      desc: 'Dense, holds heavy moisture. Easily compacts without deep-rooted rotational crops.',
      img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=400&q=80',
    },
  ];

  const waterSources: { id: WaterSource; name: string; urdu: string }[] = [
    { id: 'canal', name: 'Canal Irrigation', urdu: 'نہری پانی' },
    { id: 'tubewell', name: 'Tubewell Water', urdu: 'ٹیوب ویل' },
    { id: 'rainwater', name: 'Rainwater / Barani', urdu: 'بارانی' },
    { id: 'mixed', name: 'Canal + Tubewell Mixed', urdu: 'مکسڈ سورس' },
  ];

  const priorities: { id: FarmingPriority; name: string; urdu: string; color: string }[] = [
    { id: 'profit', name: 'More Profit', urdu: 'زیادہ منافع', color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
    { id: 'water', name: 'Save Water', urdu: 'پانی کی بچت', color: 'border-blue-500 bg-blue-50 text-blue-800' },
    { id: 'soil', name: 'Restore Soil', urdu: 'مٹی کی صحت', color: 'border-amber-500 bg-amber-50 text-amber-800' },
    { id: 'balanced', name: 'Balanced Farming', urdu: 'متوازن کاشتکاری', color: 'border-purple-500 bg-purple-50 text-purple-800' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Step Header */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E9F7EF] text-[#35A853] flex items-center justify-center font-bold text-lg">
            1
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-[#123D2A]">
              {language === 'ur' ? 'پہلے اپنے بارے میں بتائیں' : 'Step 1: Kisan & Land Information'}
            </h2>
            <p className="text-xs text-gray-500">
              {language === 'ur'
                ? 'اپنے فارم کی تفصیلات درج کریں تاکہ مصنوعی ذہانت آپ کے لیے بہترین روٹیشن بنا سکے'
                : 'Enter your farm details so our AI can tailor recommendations to your exact soil and water conditions.'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Form Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info Card */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2 border-b pb-3 border-gray-100">
            <User className="w-4 h-4 text-[#35A853]" />
            {language === 'ur' ? 'کسان کا بنیادی تعارف' : 'Farmer & Village Identity'}
          </h3>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {language === 'ur' ? 'کسان بھائی کا نام *' : 'Farmer Full Name *'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={farmer.name}
                onChange={e => updateFarmer({ name: e.target.value })}
                placeholder="e.g. Muhammad Aslam"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                  errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#35A853]'
                } outline-none transition-colors`}
              />
            </div>
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {language === 'ur' ? 'موبائل نمبر (اختیاری)' : 'Mobile Number (Optional)'}
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="tel"
                value={farmer.mobile || ''}
                onChange={e => updateFarmer({ mobile: e.target.value })}
                placeholder="0300-1234567"
                className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 focus:border-[#35A853] outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              {language === 'ur' ? 'گاؤں / چک / شہر *' : 'Village / Chak / City *'}
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={farmer.village}
                onChange={e => updateFarmer({ village: e.target.value })}
                placeholder="e.g. Chak 204 RB, Faisalabad"
                className={`w-full pl-9 pr-3 py-2 text-sm rounded-xl border ${
                  errors.village ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#35A853]'
                } outline-none transition-colors`}
              />
            </div>
            {errors.village && <p className="text-xs text-red-500 mt-1">{errors.village}</p>}
          </div>

          {/* Land Area with Polygon Link */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-gray-700">
                {language === 'ur' ? 'زرعی رقبہ (ایکڑ) *' : 'Land Area in Acres *'}
              </label>
              <button
                type="button"
                onClick={onOpenMap}
                className="text-xs text-[#35A853] hover:underline font-semibold flex items-center gap-1"
              >
                <Maximize2 className="w-3 h-3" />
                {farmer.location.confirmed ? 'Location Selected ✓ (Change)' : 'Select on Free Map'}
              </button>
            </div>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.1"
                value={farmer.location.areaAcres || ''}
                onChange={e => {
                  const val = parseFloat(e.target.value) || 0;
                  updateFarmer({
                    location: {
                      ...farmer.location,
                      areaAcres: val,
                      areaHectares: Math.round((val / 2.471) * 100) / 100,
                    },
                  });
                }}
                className={`w-full px-3 py-2 text-sm rounded-xl border ${
                  errors.area ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-[#35A853]'
                } outline-none transition-colors font-semibold`}
              />
              <span className="absolute right-3 top-2 text-xs font-bold text-gray-400">Acres</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-1">
              Calculated approx {(farmer.location.areaAcres / 2.471).toFixed(2)} Hectares. You can manually adjust this value anytime.
            </p>
          </div>
        </div>

        {/* Water & Priority Card */}
        <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-[#102A43] flex items-center gap-2 border-b pb-3 border-gray-100">
            <Droplets className="w-4 h-4 text-blue-500" />
            {language === 'ur' ? 'پانی کا ذریعہ اور ترجیح' : 'Water Availability & Priority'}
          </h3>

          {/* Water Sources */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {language === 'ur' ? 'آبپاشی کا ذریعہ *' : 'Primary Water Source *'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {waterSources.map(w => (
                <button
                  type="button"
                  key={w.id}
                  onClick={() => updateFarmer({ waterSource: w.id })}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    farmer.waterSource === w.id
                      ? 'border-[#35A853] bg-[#E9F7EF] text-[#123D2A] font-bold shadow-sm'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span>{language === 'ur' ? w.urdu : w.name}</span>
                  {farmer.waterSource === w.id && <Check className="w-4 h-4 text-[#35A853]" />}
                </button>
              ))}
            </div>
          </div>

          {/* Farming Priorities */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">
              {language === 'ur' ? 'کاشتکاری کا بنیادی مقصد / ترجیح *' : 'Farming Priority / Goal *'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {priorities.map(p => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => updateFarmer({ priority: p.id })}
                  className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    farmer.priority === p.id
                      ? `${p.color} font-bold shadow-sm ring-1 ring-[#35A853]`
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-current" />
                    {language === 'ur' ? p.urdu : p.name}
                  </span>
                  {farmer.priority === p.id && <Check className="w-4 h-4 text-current" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Map Status Banner */}
          <div className="bg-[#F5F8F5] p-3 rounded-xl border border-emerald-900/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-4 h-4 text-[#35A853]" />
              <span>
                Coordinates: {farmer.location.lat.toFixed(4)}, {farmer.location.lng.toFixed(4)}
              </span>
            </div>
            <button
              type="button"
              onClick={onOpenMap}
              className="text-[#35A853] font-bold hover:underline"
            >
              {language === 'ur' ? 'نقشہ دیکھیں' : 'View Map'}
            </button>
          </div>
        </div>
      </div>

      {/* Soil Type Visual Cards */}
      <div className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[#102A43]">
            {language === 'ur' ? 'مٹی کی قسم منتخب کریں *' : 'Select Your Farm Soil Type *'}
          </h3>
          <span className="text-xs text-gray-400">Click a photograph to select</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {soilTypes.map(st => (
            <div
              key={st.id}
              onClick={() => updateFarmer({ soilType: st.id })}
              className={`cursor-pointer rounded-2xl overflow-hidden border-2 transition-all relative ${
                farmer.soilType === st.id
                  ? 'border-[#35A853] ring-2 ring-[#35A853]/20 shadow-md scale-[1.01]'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="h-32 w-full relative overflow-hidden">
                <img
                  src={st.img}
                  alt={st.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 text-white">
                  <p className="font-extrabold text-sm">{language === 'ur' ? st.urdu : st.name}</p>
                </div>
                {farmer.soilType === st.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#35A853] text-white flex items-center justify-center shadow">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="p-3 bg-white">
                <p className="text-xs text-gray-600 line-clamp-2">{st.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Soil Test Section */}
      <div className="bg-white rounded-2xl border border-emerald-900/10 shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => setShowSoilTest(!showSoilTest)}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-2">
            <TestTube className="w-4 h-4 text-purple-600" />
            <div>
              <span className="text-sm font-bold text-[#102A43]">
                {language === 'ur'
                  ? 'مٹی کے لیب ٹیسٹ کی تفصیلات (اختیاری - نہ معلوم ہو تو چھوڑ دیں)'
                  : 'Optional Soil Test Information (Can be skipped)'}
              </span>
              <p className="text-[11px] text-gray-500">
                pH, Organic Matter %, Nitrogen, Phosphorus, Potassium
              </p>
            </div>
          </div>
          {showSoilTest ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {showSoilTest && (
          <div className="p-6 pt-2 border-t border-gray-100 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs bg-[#F5F8F5]/50">
            <div>
              <label className="block text-gray-600 font-medium mb-1">Soil pH</label>
              <input
                type="number"
                step="0.1"
                placeholder="7.8"
                value={farmer.soilTest.pH || ''}
                onChange={e =>
                  updateFarmer({
                    soilTest: { ...farmer.soilTest, pH: parseFloat(e.target.value) || undefined },
                  })
                }
                className="w-full p-2 bg-white rounded-lg border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Organic Matter %</label>
              <input
                type="number"
                step="0.05"
                placeholder="0.8%"
                value={farmer.soilTest.organicMatter || ''}
                onChange={e =>
                  updateFarmer({
                    soilTest: { ...farmer.soilTest, organicMatter: parseFloat(e.target.value) || undefined },
                  })
                }
                className="w-full p-2 bg-white rounded-lg border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Nitrogen (kg/ha)</label>
              <input
                type="number"
                placeholder="45"
                value={farmer.soilTest.nitrogen || ''}
                onChange={e =>
                  updateFarmer({
                    soilTest: { ...farmer.soilTest, nitrogen: parseFloat(e.target.value) || undefined },
                  })
                }
                className="w-full p-2 bg-white rounded-lg border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Phosphorus (kg/ha)</label>
              <input
                type="number"
                placeholder="15"
                value={farmer.soilTest.phosphorus || ''}
                onChange={e =>
                  updateFarmer({
                    soilTest: { ...farmer.soilTest, phosphorus: parseFloat(e.target.value) || undefined },
                  })
                }
                className="w-full p-2 bg-white rounded-lg border border-gray-200 outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-1">Potassium (kg/ha)</label>
              <input
                type="number"
                placeholder="180"
                value={farmer.soilTest.potassium || ''}
                onChange={e =>
                  updateFarmer({
                    soilTest: { ...farmer.soilTest, potassium: parseFloat(e.target.value) || undefined },
                  })
                }
                className="w-full p-2 bg-white rounded-lg border border-gray-200 outline-none"
              />
            </div>
          </div>
        )}
      </div>

      {/* Submit Next Button */}
      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={validateAndProceed}
          className="px-8 py-3.5 bg-[#35A853] hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 group active:scale-95"
        >
          <span>
            {language === 'ur' ? 'اگلا مرحلہ: اپنی فصل بتائیں' : 'Next: Crop Information'}
          </span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Satellite,
  Compass,
  Sprout,
  Droplets,
  Activity,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  MapPin,
  TrendingUp,
  Cpu,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

interface HomePageProps {
  onStartRotation: () => void;
  onExploreMap: () => void;
  onNavigate: (tab: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartRotation,
  onExploreMap,
  onNavigate,
}) => {
  const { language, farmer } = useFarm();

  const howItWorksSteps = [
    {
      num: '01',
      title: 'Map Your Farm Boundaries',
      urdu: 'کھیت کی حدود منتخب کریں',
      desc: 'Use Google Maps satellite imagery to mark your exact agricultural plot in Faisalabad or Punjab.',
      icon: MapPin,
    },
    {
      num: '02',
      title: 'Input Crop & Soil History',
      urdu: 'فصل و مٹی کی معلومات درج کریں',
      desc: 'Share your previous crops, irrigation source (canal/tubewell), and field soil observations.',
      icon: Sprout,
    },
    {
      num: '03',
      title: 'Receive Crop Rotation Plan',
      urdu: 'مکمل روٹیشن پلان حاصل کریں',
      desc: 'Get instant DO and DONT crop advisories, 3-year timeline, soil health gauges, and printable PDF reports.',
      icon: CheckCircle,
    },
  ];

  const coreFeatures = [
    {
      title: 'Soil Moisture & NDVI Telemetry',
      urdu: 'سیٹلائٹ مٹی اور پودوں کی جانچ',
      desc: 'Real root-zone soil moisture (0-100cm depth) and vegetation vigor telemetry georeferenced to your farm coordinates.',
      icon: Activity,
      color: 'text-[#35A853] bg-emerald-50',
    },
    {
      title: 'Agronomic Disease Break Engine',
      urdu: 'بیماریوں کا خاتمہ اور روٹیشن',
      desc: 'Disrupt repetitive monoculture pests (Bollworms, Leaf Blight, Root Rot) and stubborn Canary Grass (Dumbi Sitti) weeds.',
      icon: ShieldCheck,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      title: '35%+ Irrigation Water Conservation',
      urdu: 'پانی کی 35 فیصد تک بچت',
      desc: 'Prevent groundwater depletion by calculating seasonal evapotranspiration deficits and pairing low-water legumes.',
      icon: Droplets,
      color: 'text-cyan-600 bg-cyan-50',
    },
    {
      title: 'Biological Nitrogen Restoration',
      urdu: 'قدرتی نائٹروجن کی بحالی',
      desc: 'Integrate Berseem, Gram, or Mungbean to fix 35-45 kg of atmospheric nitrogen naturally, saving heavy DAP/Urea expenses.',
      icon: Activity,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="space-y-20 animate-fadeIn">
      {/* HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#123D2A] via-[#154631] to-[#102A43] text-white shadow-2xl border border-emerald-500/20">
        {/* Background Decorative Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#35A853_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-[#35A853]/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-6 py-16 sm:py-24 text-center space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur border border-white/20 text-xs font-bold text-emerald-300 shadow-sm">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Faisalabad &amp; Punjab Agricultural Intelligence Platform</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {language === 'ur' ? (
              <span className="font-urdu leading-normal">
                مصنوعی ذہانت سے اپنی کاشتکاری کو بدلیں
              </span>
            ) : (
              <>
                Transform Your Farming with <span className="text-[#35A853] underline decoration-[#35A853]/50">AI Intelligence</span>.
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-emerald-100/90 leading-relaxed">
            {language === 'ur'
              ? 'مٹی کی گہری جانچ اور جدید سمارٹ فصل روٹیشن کے ذریعے زیادہ منافع حاصل کریں، پانی بچائیں اور مٹی کو دوبارہ زرخیز بنائیں۔'
              : 'CropRotation Pakistan harnesses interactive land boundary selection, soil telemetry, and agricultural intelligence to prescribe optimal crop rotations, save water, and maximize farm profitability.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartRotation}
              className="px-8 py-4 bg-[#35A853] hover:bg-emerald-500 text-white rounded-2xl font-extrabold text-sm shadow-xl hover:shadow-2xl transition-all flex items-center gap-2 group active:scale-95"
            >
              <span>{language === 'ur' ? 'سمارٹ فصل روٹیشن شروع کریں' : 'Start Smart Crop Rotation'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onExploreMap}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur text-white border border-white/30 rounded-2xl font-bold text-sm shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Compass className="w-4 h-4 text-[#35A853]" />
              <span>{language === 'ur' ? 'نقشے پر اپنا کھیت دیکھیں' : 'Explore Your Farm on Map'}</span>
            </button>
          </div>

          {/* Trust Metric Strip */}
          <div className="pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#35A853] block">35%+</span>
              <span className="text-[11px] text-gray-300">Irrigation Water Saved</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#35A853] block">+42%</span>
              <span className="text-[11px] text-gray-300">Soil Health Score</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#35A853] block">PKR 45K+</span>
              <span className="text-[11px] text-gray-300">Net Profit Boost / Acre</span>
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-extrabold text-[#35A853] block">100%</span>
              <span className="text-[11px] text-gray-300">Soil &amp; Climate Telemetry</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 1: HOW IT WORKS */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold text-[#35A853] tracking-widest block">
            Streamlined 3-Step Decision Flow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
            {language === 'ur' ? 'یہ نظام کیسے کام کرتا ہے؟' : 'How CropRotation Works'}
          </h2>
          <p className="text-xs text-gray-500 max-w-xl mx-auto">
            From field boundary polygon mapping to comprehensive 3-year crop rotation roadmaps in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {howItWorksSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm relative hover:border-[#35A853]/50 transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E9F7EF] text-[#35A853] flex items-center justify-center font-bold shadow-xs group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-gray-200">{step.num}</span>
                </div>
                <h3 className="text-lg font-bold text-[#102A43] mb-1">{step.title}</h3>
                <p className="text-xs text-emerald-800 font-semibold mb-2 font-urdu">{step.urdu}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: CORE FEATURES GRID */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-900/10 shadow-sm space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase font-bold text-[#35A853] tracking-widest block">
              Built For Central Punjab
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
              Intelligent Agronomy Meets Satellite Tech
            </h2>
          </div>
          <button
            onClick={() => onNavigate('soil')}
            className="text-xs font-bold text-[#35A853] hover:underline flex items-center gap-1"
          >
            Explore Soil Intelligence →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreFeatures.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#F5F8F5] border border-emerald-900/10 hover:bg-white hover:border-[#35A853] transition-all space-y-3"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${feat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-base text-[#123D2A]">{feat.title}</h3>
                <p className="text-xs text-emerald-900 font-urdu">{feat.urdu}</p>
                <p className="text-xs text-gray-600 leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: SATELLITE PREVIEW STRIP */}
      <section className="bg-gradient-to-r from-[#102A43] to-[#123D2A] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-500/20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs uppercase font-bold text-emerald-300 tracking-wider">
              Regional Satellite &amp; Soil Telemetry
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Real Soil &amp; Climate Evidence Before Every Crop Advice
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              CropRotation Pakistan integrates satellite soil moisture, NDVI vegetation vigor, and regional agroclimatology telemetry directly for your farm coordinates in Faisalabad and across Punjab.
            </p>
            <div className="pt-2">
              <button
                onClick={onStartRotation}
                className="px-6 py-3 bg-[#35A853] hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-2"
              >
                <span>Run Satellite Diagnostic for My Farm</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-emerald-300 font-bold block uppercase">NASA SMAP</span>
              <span className="text-2xl font-extrabold text-white block my-1">22-26%</span>
              <p className="text-[11px] text-gray-300">Root-zone volumetric moisture in Faisalabad canal belt.</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-emerald-300 font-bold block uppercase">MODIS NDVI</span>
              <span className="text-2xl font-extrabold text-emerald-400 block my-1">0.64 Index</span>
              <p className="text-[11px] text-gray-300">Active photosynthetic vegetative canopy index.</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-emerald-300 font-bold block uppercase">NASA POWER</span>
              <span className="text-2xl font-extrabold text-white block my-1">19.2 MJ/m²</span>
              <p className="text-[11px] text-gray-300">Solar irradiance &amp; crop evapotranspiration models.</p>
            </div>
            <div className="bg-white/10 backdrop-blur p-5 rounded-2xl border border-white/10">
              <span className="text-[10px] text-emerald-300 font-bold block uppercase">Resolution</span>
              <span className="text-2xl font-extrabold text-blue-300 block my-1">High-Res</span>
              <p className="text-[11px] text-gray-300">Aligned with Punjab agricultural district grid.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: UNIQUE AI TOOLS BANNER */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase font-bold text-[#35A853] tracking-widest block">
            Farmer-Centric Innovation
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#102A43]">
            Unique AI Tools Designed for You
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            onClick={() => onNavigate('simulator')}
            className="p-5 rounded-2xl bg-white border border-emerald-900/10 hover:border-[#35A853] shadow-xs cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Activity className="w-7 h-7 text-[#35A853] mb-3" />
            <h4 className="font-extrabold text-sm text-[#102A43]">What-If Simulator</h4>
            <p className="text-xs text-gray-500 mt-1">
              Compare 2 rotation paths side-by-side for 3-year profit and water draw.
            </p>
          </div>

          <div
            onClick={() => onNavigate('voice')}
            className="p-5 rounded-2xl bg-white border border-emerald-900/10 hover:border-[#35A853] shadow-xs cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Cpu className="w-7 h-7 text-blue-600 mb-3" />
            <h4 className="font-extrabold text-sm text-[#102A43]">Kisan Voice Assistant</h4>
            <p className="text-xs text-gray-500 mt-1">
              Speak questions in Punjabi, Urdu or English with audio answers.
            </p>
          </div>

          <div
            onClick={() => onNavigate('disease')}
            className="p-5 rounded-2xl bg-white border border-emerald-900/10 hover:border-[#35A853] shadow-xs cursor-pointer transition-all hover:scale-[1.02]"
          >
            <ShieldCheck className="w-7 h-7 text-red-600 mb-3" />
            <h4 className="font-extrabold text-sm text-[#102A43]">Camera Leaf Doctor</h4>
            <p className="text-xs text-gray-500 mt-1">
              Snap a crop photograph for instant multimodal pathology screening.
            </p>
          </div>

          <div
            onClick={() => onNavigate('diary')}
            className="p-5 rounded-2xl bg-white border border-emerald-900/10 hover:border-[#35A853] shadow-xs cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Sprout className="w-7 h-7 text-purple-600 mb-3" />
            <h4 className="font-extrabold text-sm text-[#102A43]">Kisan Field Diary</h4>
            <p className="text-xs text-gray-500 mt-1">
              Log sowing, irrigation dates, and fertilizer expenses persistently.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="bg-gradient-to-r from-[#123D2A] to-[#35A853] text-white rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-4">
        <h2 className="text-2xl sm:text-4xl font-extrabold">
          Ready to Modernize Your Faisalabad Farm?
        </h2>
        <p className="max-w-xl mx-auto text-xs sm:text-sm text-emerald-100">
          Join farmers across Punjab making informed, data-driven decisions backed by satellite physics and regenerative agronomy.
        </p>
        <div className="pt-2">
          <button
            onClick={onStartRotation}
            className="px-8 py-3.5 bg-white text-[#123D2A] hover:bg-emerald-50 rounded-2xl font-extrabold text-sm shadow-xl transition-all"
          >
            Generate My Crop Rotation Plan Now →
          </button>
        </div>
      </section>
    </div>
  );
};

import React, { useState, useRef } from 'react';
import {
  Camera,
  Sparkles,
  Info,
  ShieldCheck,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

export const DiseaseDetector: React.FC = () => {
  const { language } = useFarm();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/jpeg');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preset sample leaf images for instant testing
  const sampleImages = [
    {
      label: 'Wheat Rust Sample',
      crop: 'Wheat',
      url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Cotton Leaf Curl Sample',
      crop: 'Cotton',
      url: 'https://images.unsplash.com/photo-1599818816942-01c34a2e8c25?auto=format&fit=crop&w=600&q=80',
    },
    {
      label: 'Maize Blight Sample',
      crop: 'Maize',
      url: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setSelectedImage(base64);
        setSelectedMimeType(file.type || 'image/jpeg');
        setAiResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckDiseaseWithAI = async () => {
    if (!selectedImage) {
      setAiResult('Photo upload karo aur Check dabao');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/gemini/disease', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: selectedMimeType,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setAiResult(data.error || 'API Key lagao phir AI chalegi');
      } else {
        setAiResult(data.answer || 'Photo upload karo aur Check dabao');
      }
    } catch {
      setAiResult('API Key lagao phir AI chalegi');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#35A853] flex items-center justify-center">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              AI Vision Pathology
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A]">
              {language === 'ur'
                ? 'فصل و پتہ ڈاکٹر (Crop & Leaf Disease Detection)'
                : 'Disease Detection by Camera'}
            </h1>
          </div>
        </div>
        <p className="text-xs text-gray-500 max-w-3xl">
          {language === 'ur'
            ? 'اپنے موبائل کیمرے سے بیمار پتے کی تصویر کھینچیں یا اپلوڈ کریں۔ مصنوعی ذہانت پیلی کنگی، سنڈیوں اور فنگس کے حملے کی فوری نشاندہی کرے گی۔'
            : 'Capture or upload a clear photo of an infected leaf or crop. Gemini AI vision inspects visible chlorosis, necrosis, pustules, and leaf curl symptoms with immediate management advice.'}
        </p>
      </div>

      {/* Upload & Camera Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Upload Zone */}
        <div className="md:col-span-1 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="font-bold text-sm text-[#102A43] mb-3">
              {language === 'ur' ? 'تصویر اپلوڈ یا کیمرہ کھولیں' : 'Upload or Snap Leaf Photo'}
            </h3>

            <input
              type="file"
              accept="image/*"
              capture="environment"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#35A853]/50 hover:border-[#35A853] bg-[#F5F8F5] rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-emerald-50/50"
            >
              <div className="w-12 h-12 rounded-2xl bg-[#E9F7EF] text-[#35A853] mx-auto flex items-center justify-center mb-3 shadow-xs">
                <Camera className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-[#123D2A] mb-1">
                {language === 'ur' ? 'کیمرہ آن کریں یا فوٹو چنیں' : 'Take Photo or Browse Gallery'}
              </p>
              <p className="text-[10px] text-gray-400">JPG, PNG, WebP up to 15MB</p>
            </div>
            {/* Check Disease with AI Button below photo upload */}
            <button
              type="button"
              onClick={handleCheckDiseaseWithAI}
              disabled={isAnalyzing}
              className="mt-4 w-full py-3 px-4 rounded-2xl bg-[#123D2A] hover:bg-[#19533a] disabled:opacity-60 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className={`w-4 h-4 text-amber-300 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>{isAnalyzing ? 'Checking Leaf...' : 'Check Disease with AI ✨'}</span>
            </button>
          </div>

          {/* Preset Sample Buttons */}
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 block mb-2">
              Or Try A Preset Sample:
            </span>
            <div className="space-y-1.5">
              {sampleImages.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSelectedImage(s.url);
                    setSelectedMimeType('image/jpeg');
                    setAiResult(null);
                  }}
                  className="w-full text-left p-2 rounded-xl bg-gray-50 hover:bg-emerald-50 text-xs font-medium text-gray-700 hover:text-emerald-800 border border-gray-200 transition-colors flex items-center justify-between"
                >
                  <span>{s.label}</span>
                  <span className="text-[10px] text-[#35A853] font-bold">Select →</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Image Preview & Scanner Visual */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-col items-center justify-center min-h-[350px]">
          {selectedImage ? (
            <div className="relative w-full max-w-md h-80 rounded-2xl overflow-hidden shadow-md">
              <img
                src={selectedImage}
                alt="Selected leaf"
                className="w-full h-full object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white">
                  <div className="w-12 h-12 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin mb-3" />
                  <p className="text-xs font-bold animate-pulse">
                    Analyzing leaf pathology with Gemini AI...
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center p-8">
              <Camera className="w-14 h-14 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-bold text-gray-600">No Leaf Image Selected</p>
              <p className="text-xs text-gray-400 mt-1">
                Upload or capture a close-up photo of infected leaves or crop stems to begin.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Disease Diagnosis Result Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/40 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#35A853]" />
            <h2 className="text-lg font-extrabold text-[#123D2A]">
              Crop Doctor AI Diagnosis
            </h2>
          </div>
          <span className="text-[10px] font-bold uppercase text-emerald-700 bg-[#E9F7EF] px-2.5 py-1 rounded-full">
            Faisalabad Desi Ilaj &amp; Pathology
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#F5F8F5] border border-emerald-900/10 text-xs sm:text-sm text-gray-800 whitespace-pre-line leading-relaxed">
          {isAnalyzing
            ? 'Gemini AI patte ki tasveer check kar raha hai...'
            : aiResult || 'Photo upload karo aur Check dabao'}
        </div>

        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>
            AI preliminary screening. Confirm symptoms with local Agriculture Extension Officer before applying chemical sprays.
          </span>
        </div>
      </div>
    </div>
  );
};

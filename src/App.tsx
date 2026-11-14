import React, { useState } from 'react';
import { FarmProvider, useFarm } from './context/FarmContext';
import { QuotaBanner } from './components/QuotaBanner';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/home/HomePage';
import { FarmMapSelector } from './components/map/FarmMapSelector';
import { Step1KisanInfo } from './components/wizard/Step1KisanInfo';
import { Step2CropInfo } from './components/wizard/Step2CropInfo';
import { Step3RotationResults } from './components/wizard/Step3RotationResults';
import { WhatIfSimulator } from './components/simulator/WhatIfSimulator';
import { KisanVoiceAssistant } from './components/voice/KisanVoiceAssistant';
import { DiseaseDetector } from './components/disease/DiseaseDetector';
import { FieldDiary } from './components/diary/FieldDiary';
import { FarmHistory } from './components/history/FarmHistory';
import { SoilIntelligenceView } from './components/soil/SoilIntelligenceView';
import { AboutUs } from './components/about/AboutUs';
import {
  Mic,
  X,
  MapPin,
  CheckCircle2,
  ChevronRight,
  Layers,
  Sparkles,
  RotateCcw,
} from 'lucide-react';

const MainContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState('home');
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  const {
    activeStep,
    setActiveStep,
    currentPlan,
    generatePlan,
    resetWizard,
    loadSavedPlan,
    language,
    farmer,
  } = useFarm();

  const handleStartRotation = () => {
    setCurrentTab('wizard');
    setActiveStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenMapDedicated = () => {
    setCurrentTab('map');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGenerate = async () => {
    try {
      await generatePlan();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert('Error generating crop rotation plan. Please check inputs.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F8F5] text-[#102A43]">
      {/* Google Maps Quota Defense Banner (Case A Demo Key) */}
      <QuotaBanner />

      {/* Main Navigation */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Body View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* TAB 1: HOME */}
        {currentTab === 'home' && (
          <HomePage
            onStartRotation={handleStartRotation}
            onExploreMap={handleOpenMapDedicated}
            onNavigate={tab => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* TAB 2: SMART CROP ROTATION (3-STEP WIZARD) */}
        {currentTab === 'wizard' && (
          <div className="space-y-8">
            {/* Progress Bar (STEP 1 - STEP 2 - STEP 3) */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm no-print">
              <div className="flex items-center justify-between max-w-3xl mx-auto">
                {/* Step 1 Indicator */}
                <div
                  onClick={() => setActiveStep(1)}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm transition-all shadow-sm ${
                      activeStep === 1
                        ? 'bg-[#123D2A] text-white ring-4 ring-[#35A853]/20'
                        : activeStep > 1
                        ? 'bg-[#35A853] text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {activeStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      STEP 1
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        activeStep === 1 ? 'text-[#123D2A]' : 'text-gray-600'
                      }`}
                    >
                      {language === 'ur' ? 'کسان و رقبہ' : 'Kisan Information'}
                    </span>
                  </div>
                </div>

                <div className={`flex-1 h-1 mx-4 rounded-full ${activeStep >= 2 ? 'bg-[#35A853]' : 'bg-gray-200'}`} />

                {/* Step 2 Indicator */}
                <div
                  onClick={() => {
                    if (farmer.name) setActiveStep(2);
                  }}
                  className={`flex items-center gap-3 transition-all ${
                    farmer.name ? 'cursor-pointer group' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm transition-all shadow-sm ${
                      activeStep === 2
                        ? 'bg-[#123D2A] text-white ring-4 ring-[#35A853]/20'
                        : activeStep > 2
                        ? 'bg-[#35A853] text-white'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {activeStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      STEP 2
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        activeStep === 2 ? 'text-[#123D2A]' : 'text-gray-600'
                      }`}
                    >
                      {language === 'ur' ? 'فصل کی معلومات' : 'Crop Information'}
                    </span>
                  </div>
                </div>

                <div className={`flex-1 h-1 mx-4 rounded-full ${activeStep >= 3 ? 'bg-[#35A853]' : 'bg-gray-200'}`} />

                {/* Step 3 Indicator */}
                <div
                  className={`flex items-center gap-3 ${
                    currentPlan ? 'cursor-pointer group' : 'cursor-not-allowed opacity-50'
                  }`}
                  onClick={() => {
                    if (currentPlan) setActiveStep(3);
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm transition-all shadow-sm ${
                      activeStep === 3
                        ? 'bg-[#35A853] text-white ring-4 ring-[#35A853]/20'
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    3
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                      STEP 3
                    </span>
                    <span
                      className={`text-xs font-bold ${
                        activeStep === 3 ? 'text-[#35A853]' : 'text-gray-600'
                      }`}
                    >
                      {language === 'ur' ? 'روٹیشن پلان' : 'Rotation Results'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Separate Wizard Step Screens */}
            {activeStep === 1 && (
              <Step1KisanInfo
                onNext={() => setActiveStep(2)}
                onOpenMap={() => setShowMapModal(true)}
              />
            )}

            {activeStep === 2 && (
              <Step2CropInfo
                onBack={() => setActiveStep(1)}
                onGenerate={handleGenerate}
              />
            )}

            {activeStep === 3 && (
              <Step3RotationResults
                onNewPlan={() => {
                  if (confirm('Start a new crop rotation plan? Previous records will remain saved in your history.')) {
                    resetWizard();
                  }
                }}
                onOpenMap={handleOpenMapDedicated}
              />
            )}
          </div>
        )}

        {/* TAB 3: EXPLORE FARM MAP (Free Leaflet + OpenStreetMap & Manual Backup) */}
        {currentTab === 'map' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-[#123D2A] flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-[#35A853]" />
                  {language === 'ur'
                    ? 'اپنے کھیت کا نقشہ اور رقبہ منتخب کریں'
                    : 'Explore & Select Your Agricultural Land'}
                </h1>
                <p className="text-xs text-gray-500">
                  Free interactive OpenStreetMap (Leaflet) centered on Faisalabad — no API key required. Click anywhere on the map to pick your farm, draw boundaries, or use the Manual Form backup.
                </p>
              </div>

              <button
                onClick={handleStartRotation}
                className="px-5 py-2.5 bg-[#35A853] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-2"
              >
                <span>Proceed to Crop Rotation Wizard →</span>
              </button>
            </div>

            <FarmMapSelector
              standalone
              onLocationConfirmed={() => {
                // Location saved cleanly in FarmContext and displayed in selector status bar
              }}
            />
          </div>
        )}

        {/* TAB 4: SOIL INTELLIGENCE */}
        {currentTab === 'soil' && (
          <SoilIntelligenceView onStartRotation={handleStartRotation} />
        )}

        {/* TAB 5: ROTATION SIMULATOR */}
        {currentTab === 'simulator' && <WhatIfSimulator />}

        {/* TAB 6: KISAN VOICE ASSISTANT */}
        {currentTab === 'voice' && <KisanVoiceAssistant />}

        {/* TAB 7: LEAF DOCTOR / DISEASE DETECTION */}
        {currentTab === 'disease' && <DiseaseDetector />}

        {/* TAB 8: FIELD DIARY */}
        {currentTab === 'diary' && <FieldDiary />}

        {/* TAB 9: REPORTS & HISTORY */}
        {currentTab === 'history' && (
          <FarmHistory
            onOpenPlan={plan => {
              loadSavedPlan(plan);
              setCurrentTab('wizard');
            }}
            onNewPlan={handleStartRotation}
          />
        )}

        {/* TAB 10: ABOUT US */}
        {currentTab === 'about' && (
          <AboutUs onStartRotation={handleStartRotation} />
        )}
      </main>

      {/* Floating Kisan Voice Assistant Trigger Button */}
      <div className="fixed bottom-6 right-6 z-30 no-print">
        <button
          onClick={() => setShowVoiceModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-[#123D2A] to-[#35A853] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border-2 border-white group"
          title="Open Kisan Voice Assistant"
        >
          <Mic className="w-6 h-6 group-hover:animate-bounce" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white animate-pulse" />
        </button>
      </div>

      {/* Modal: Floating Voice Assistant Dialog */}
      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="w-full max-w-2xl animate-scaleUp">
            <KisanVoiceAssistant
              isOpen
              onClose={() => setShowVoiceModal(false)}
            />
          </div>
        </div>
      )}

      {/* Modal: Inline Google Map Selector from Step 1 */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto animate-scaleUp">
            <div className="flex items-center justify-between border-b pb-3 border-gray-100">
              <h3 className="font-extrabold text-lg text-[#102A43] flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#35A853]" />
                Select Farm Location (Free Faisalabad Map / Manual Form)
              </h3>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-500"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <FarmMapSelector
              onLocationConfirmed={() => {
                setShowMapModal(false);
              }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        onNavigate={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
};

export default function App() {
  return (
    <FarmProvider>
      <MainContent />
    </FarmProvider>
  );
}

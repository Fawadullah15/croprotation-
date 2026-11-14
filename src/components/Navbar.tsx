import React, { useState } from 'react';
import {
  Sprout,
  Satellite,
  Compass,
  Activity,
  Mic,
  Camera,
  BookOpen,
  FileText,
  Menu,
  X,
  Globe,
  Sparkles,
} from 'lucide-react';
import { useFarm } from '../context/FarmContext';
import { SupportedLanguage } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { language, setLanguage, setActiveStep, resetWizard } = useFarm();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', urdu: 'ہوم' },
    { id: 'wizard', label: 'Smart Crop Rotation', urdu: 'سمارٹ فصل روٹیشن' },
    { id: 'map', label: 'Explore Farm Map', urdu: 'کھیت کا نقشہ' },
    { id: 'soil', label: 'Soil Intelligence', urdu: 'مٹی کی جانچ' },
    { id: 'simulator', label: 'Rotation Simulator', urdu: 'سمولیٹر' },
    { id: 'voice', label: 'Kisan Voice AI', urdu: 'کسان وائس' },
    { id: 'disease', label: 'Leaf Doctor', urdu: 'فصل ڈاکٹر' },
    { id: 'diary', label: 'Field Diary', urdu: 'کھیت ڈائری' },
    { id: 'history', label: 'Reports', urdu: 'رپورٹس' },
    { id: 'about', label: 'About Us', urdu: 'ہمارے متعلق' },
  ];

  const handleNavClick = (id: string) => {
    setCurrentTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartRotation = () => {
    resetWizard();
    setCurrentTab('wizard');
    setActiveStep(1);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-40 bg-[#123D2A] text-white shadow-md border-b border-[#35A853]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#35A853] to-emerald-400 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Satellite className="w-6 h-6 text-[#123D2A]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white">
                  AGROSPACE
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded bg-[#35A853] text-[#123D2A] font-extrabold uppercase">
                  Pakistan
                </span>
              </div>
              <p className="text-[10px] text-emerald-200/90 tracking-wide font-medium">
                {language === 'ur'
                  ? 'سمارٹ کاشتکاری • زرخیز مٹی • روشن مستقبل'
                  : 'Smart Farming • Healthy Soil • Sustainable Future'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.slice(0, 7).map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                  currentTab === item.id
                    ? 'bg-[#35A853] text-white shadow-sm'
                    : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {language === 'ur' ? item.urdu : item.label}
              </button>
            ))}

            {/* More dropdown or secondary links */}
            <div className="flex items-center border-l border-emerald-800/80 pl-2 space-x-1">
              {navItems.slice(7).map(item => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    currentTab === item.id
                      ? 'bg-[#35A853] text-white'
                      : 'text-emerald-200 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {language === 'ur' ? item.urdu : item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right Action: Language Selector & CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language Switcher */}
            <div className="flex items-center bg-emerald-950/70 p-1 rounded-lg border border-emerald-700/50 text-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-300 ml-1.5 mr-1" />
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 rounded font-semibold transition-colors ${
                  language === 'en' ? 'bg-[#35A853] text-white' : 'text-emerald-300 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('ur')}
                className={`px-2 py-1 rounded font-semibold transition-colors ${
                  language === 'ur' ? 'bg-[#35A853] text-white' : 'text-emerald-300 hover:text-white'
                }`}
              >
                اردو
              </button>
              <button
                onClick={() => setLanguage('roman')}
                className={`px-2 py-1 rounded font-semibold transition-colors ${
                  language === 'roman'
                    ? 'bg-[#35A853] text-white'
                    : 'text-emerald-300 hover:text-white'
                }`}
              >
                Roman
              </button>
            </div>

            {/* Primary CTA */}
            <button
              onClick={handleStartRotation}
              className="px-4 py-2 bg-[#35A853] hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              {language === 'ur' ? 'روٹیشن پلان بنائیں' : 'Start Smart Rotation'}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'en' ? 'ur' : language === 'ur' ? 'roman' : 'en')}
              className="p-1.5 rounded-lg bg-emerald-900 text-xs font-bold text-emerald-200"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-emerald-900/80 text-emerald-200 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#102A43] border-t border-emerald-800 px-4 pt-3 pb-6 space-y-2">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-3 py-2.5 rounded-lg text-left text-xs font-semibold ${
                  currentTab === item.id
                    ? 'bg-[#35A853] text-white'
                    : 'text-emerald-100 bg-white/5 hover:bg-white/10'
                }`}
              >
                {language === 'ur' ? item.urdu : item.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleStartRotation}
            className="w-full py-3 bg-[#35A853] text-white font-bold rounded-xl text-center text-sm shadow flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            {language === 'ur' ? 'سمارٹ فصل روٹیشن شروع کریں' : 'Start Smart Crop Rotation'}
          </button>
        </div>
      )}
    </nav>
  );
};

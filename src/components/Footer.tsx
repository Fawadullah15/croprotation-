import React from 'react';
import { Sprout, ShieldCheck, Heart, MapPin, Mail, Phone } from 'lucide-react';
import { useFarm } from '../context/FarmContext';

export const Footer: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { language } = useFarm();

  return (
    <footer className="bg-[#102A43] text-white border-t border-emerald-950 no-print mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#35A853] flex items-center justify-center">
                <Sprout className="w-5 h-5 text-[#102A43]" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">CROPROTATION</span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              Empowering farmers across Faisalabad and Punjab with AI-driven crop rotation, soil health analysis, and regenerative agronomic intelligence.
            </p>
            <div className="text-xs text-emerald-400 font-semibold">
              Tagline: "Smart Farming. Healthy Soil. Sustainable Future."
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
              {language === 'ur' ? 'اہم سروسز' : 'Key Modules'}
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li>
                <button onClick={() => onNavigate('wizard')} className="hover:text-[#35A853] transition-colors">
                  3-Step Crop Rotation Wizard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('map')} className="hover:text-[#35A853] transition-colors">
                  Interactive Field Boundary Map
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('soil')} className="hover:text-[#35A853] transition-colors">
                  Soil Health &amp; NDVI Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('simulator')} className="hover:text-[#35A853] transition-colors">
                  What-If Rotation Simulator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('voice')} className="hover:text-[#35A853] transition-colors">
                  Kisan Voice Assistant (Urdu/EN)
                </button>
              </li>
            </ul>
          </div>

          {/* Punjab Agri Context */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
              Faisalabad Agriculture Hub
            </h4>
            <ul className="space-y-2 text-xs text-gray-300">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#35A853]" />
                University of Agriculture Faisalabad (UAF)
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#35A853]" />
                Ayub Agricultural Research Institute (AARI)
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#35A853]" />
                Punjab Agriculture Extension Dept
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#35A853]" />
                Regional Agroclimatology &amp; Soil Telemetry
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
              Kisan Helpline
            </h4>
            <div className="space-y-2 text-xs text-gray-300">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                Toll Free: 0800-15000 (Punjab Agri)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-emerald-400" />
                support@croprotation.pk
              </p>
              <p className="text-[11px] text-gray-400 pt-2 border-t border-gray-800">
                Specially designed for canal &amp; tubewell farmers in Central Punjab.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p>© {new Date().getFullYear()} CropRotation Pakistan. All rights reserved.</p>
          <p className="flex items-center gap-1 text-gray-400">
            Dedicated to the prosperity of Pakistani Kisan Brothers <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Satellite, Award, Heart, MapPin, Users, BookOpen } from 'lucide-react';
import { useFarm } from '../../context/FarmContext';

export const AboutUs: React.FC<{ onStartRotation?: () => void }> = ({ onStartRotation }) => {
  const { language } = useFarm();

  return (
    <div className="space-y-12 animate-fadeIn max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#123D2A] to-[#102A43] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-500/20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#35A853] text-[#123D2A] flex items-center justify-center mx-auto shadow-lg">
          <Satellite className="w-8 h-8" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          About AgroSpace Pakistan
        </h1>
        <p className="text-emerald-300 font-bold text-sm">
          Tagline: "Smart Farming. Healthy Soil. Sustainable Future."
        </p>
        <p className="max-w-2xl mx-auto text-xs sm:text-sm text-gray-200 leading-relaxed">
          Pioneering the intersection of Google Maps geospatial intelligence, NASA Earth observation satellite observations, and Punjabi agronomic wisdom to help farmers in Faisalabad and across Pakistan break destructive monoculture cycles.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-3">
          <h3 className="font-extrabold text-xl text-[#123D2A] flex items-center gap-2">
            <Award className="w-5 h-5 text-[#35A853]" />
            Our Mission
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            To rescue Punjab's fertile Indus basin soils from progressive salinization, organic matter depletion, and groundwater overdraft by putting actionable, satellite-verified crop rotation intelligence directly into the hands of every farmer.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-3">
          <h3 className="font-extrabold text-xl text-[#123D2A] flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#35A853]" />
            Why Faisalabad, Punjab?
          </h3>
          <p className="text-xs text-gray-600 leading-relaxed">
            Faisalabad (historically Lyallpur) is Pakistan's agricultural knowledge capital, home to the University of Agriculture Faisalabad (UAF) and Ayub Agricultural Research Institute (AARI). Its canal-irrigated command area provides the ideal proving ground for smart crop rotations.
          </p>
        </div>
      </div>

      {/* Agronomic Pillars */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm space-y-6">
        <h3 className="font-extrabold text-xl text-[#102A43]">
          Core Agronomic Foundations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-gray-600">
          <div className="p-4 rounded-2xl bg-[#F5F8F5] border border-gray-100 space-y-2">
            <strong className="text-[#123D2A] font-bold block text-sm">1. Legume Nitrogen Fixation</strong>
            <p>Berseem, Chickpeas, and Mungbeans host Rhizobium bacteria that naturally capture free atmospheric nitrogen, replacing heavy synthetic chemical fertilizers.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F8F5] border border-gray-100 space-y-2">
            <strong className="text-[#123D2A] font-bold block text-sm">2. Root-Zone Diversity</strong>
            <p>Alternating shallow fibrous root crops (Wheat, Rice) with deep tap-root crops (Cotton, Pigeonpea) prevents hardpan compaction and accesses deeper subsoil nutrients.</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F5F8F5] border border-gray-100 space-y-2">
            <strong className="text-[#123D2A] font-bold block text-sm">3. Pest &amp; Weed Disruption</strong>
            <p>Disrupting monocultures starves host-specific pests like Pink Bollworm and wipes out persistent weeds like Phalaris minor (Dumbi Sitti).</p>
          </div>
        </div>
      </div>

      {onStartRotation && (
        <div className="text-center pt-4">
          <button
            onClick={onStartRotation}
            className="px-8 py-3.5 bg-[#35A853] hover:bg-emerald-600 text-white rounded-2xl font-extrabold text-sm shadow-lg transition-all"
          >
            Start Your Farm Evaluation Now →
          </button>
        </div>
      )}
    </div>
  );
};

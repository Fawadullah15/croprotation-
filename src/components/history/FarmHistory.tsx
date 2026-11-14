import React from 'react';
import {
  FileText,
  Download,
  Printer,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { generateCropRotationPdf } from '../../utils/pdfGenerator';
import { RotationPlanResult } from '../../types';

export const FarmHistory: React.FC<{ onOpenPlan: (plan: RotationPlanResult) => void; onNewPlan: () => void }> = ({
  onOpenPlan,
  onNewPlan,
}) => {
  const { savedPlans, language } = useFarm();

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#35A853] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                Historical Records &amp; Audits
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A]">
                {language === 'ur'
                  ? 'محفوظ شدہ فارم رپورٹس اور ہسٹری'
                  : 'Saved Farm Reports & History'}
              </h1>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Access previous AI crop rotation plans, download official PDF certificates, or re-print for agricultural bank financing and advisory.
          </p>
        </div>

        <button
          onClick={onNewPlan}
          className="px-5 py-2.5 bg-[#35A853] hover:bg-emerald-600 text-white rounded-xl text-xs font-bold shadow transition-all flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-amber-200" />
          <span>{language === 'ur' ? 'نیا روٹیشن پلان بنائیں' : 'Create New Plan'}</span>
        </button>
      </div>

      {/* Reports Grid */}
      {savedPlans.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
          <FileText className="w-12 h-12 text-gray-300 mx-auto" />
          <h3 className="text-base font-bold text-gray-700">No Saved Reports Yet</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            Run the 3-Step Smart Crop Rotation Wizard to generate and save your first farm recommendation report.
          </p>
          <button
            onClick={onNewPlan}
            className="px-5 py-2.5 bg-[#123D2A] text-white text-xs font-bold rounded-xl"
          >
            Start First Plan
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedPlans.map(plan => (
            <div
              key={plan.id}
              className="bg-white rounded-2xl p-6 border border-emerald-900/10 shadow-sm hover:border-[#35A853]/40 transition-all flex flex-wrap items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#E9F7EF] text-[#123D2A] text-[11px] font-extrabold">
                    {plan.doPlantThis.crop.toUpperCase()} ROTATION
                  </span>
                  <span className="text-xs text-gray-400">
                    ID: {plan.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-[#102A43]">
                  {plan.farmer.name} • {plan.farmer.location.village} ({plan.farmer.location.areaAcres} Acres)
                </h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 pt-1">
                  <span>Soil Health: <strong className="text-emerald-700">{plan.soilHealth.currentScore} → {plan.soilHealth.projectedThreeYearScore}</strong></span>
                  <span>Water Saving: <strong className="text-blue-700">-{plan.waterBudget.savingsPercent}%</strong></span>
                  <span>Net Profit: <strong className="text-gray-900">PKR {plan.profit.recommendedNetPkr.toLocaleString()}</strong></span>
                  <span>Date: {new Date(plan.generatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenPlan(plan)}
                  className="px-3.5 py-2 bg-[#E9F7EF] hover:bg-emerald-100 text-[#123D2A] text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => generateCropRotationPdf(plan)}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4 text-[#35A853]" />
                </button>
                <button
                  onClick={() => {
                    onOpenPlan(plan);
                    setTimeout(() => window.print(), 200);
                  }}
                  className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl"
                  title="Print Report"
                >
                  <Printer className="w-4 h-4 text-blue-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

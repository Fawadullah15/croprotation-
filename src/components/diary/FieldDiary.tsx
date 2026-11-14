import React, { useState } from 'react';
import {
  BookOpen,
  PlusCircle,
  Calendar,
  Droplets,
  Sprout,
  AlertTriangle,
  Award,
  Trash2,
  DollarSign,
  Tag,
} from 'lucide-react';
import { useFarm } from '../../context/FarmContext';
import { FieldDiaryEntry } from '../../types';

export const FieldDiary: React.FC = () => {
  const { fieldDiary, addDiaryEntry, deleteDiaryEntry, language } = useFarm();
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [activityType, setActivityType] = useState<FieldDiaryEntry['activityType']>('irrigation');
  const [crop, setCrop] = useState('Berseem Clover');
  const [notes, setNotes] = useState('');
  const [costPkr, setCostPkr] = useState<string>('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    addDiaryEntry({
      date,
      activityType,
      crop,
      notes,
      costPkr: costPkr ? parseFloat(costPkr) : undefined,
    });

    setNotes('');
    setCostPkr('');
    setShowAddModal(false);
  };

  const activityIcons: Record<FieldDiaryEntry['activityType'], { icon: any; color: string; label: string; urdu: string }> = {
    sowing: { icon: Sprout, color: 'text-emerald-600 bg-emerald-100', label: 'Sowing / Seeding', urdu: 'بوائی' },
    irrigation: { icon: Droplets, color: 'text-blue-600 bg-blue-100', label: 'Canal / Tubewell Irrigation', urdu: 'آبپاشی' },
    fertilizer: { icon: Tag, color: 'text-purple-600 bg-purple-100', label: 'Fertilizer Application', urdu: 'کھاد کا استعمال' },
    pest_scouting: { icon: AlertTriangle, color: 'text-red-600 bg-red-100', label: 'Pest Scouting & Spray', urdu: 'پیسٹ سکاؤٹنگ' },
    growth_monitoring: { icon: Award, color: 'text-amber-600 bg-amber-100', label: 'Crop Growth Observation', urdu: 'فصل کی بڑھوتری' },
    harvest: { icon: Calendar, color: 'text-[#123D2A] bg-[#E9F7EF]', label: 'Harvesting & Threshing', urdu: 'کٹائی' },
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-900/10 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#35A853] flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                Field Operations Journal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#123D2A]">
                {language === 'ur' ? 'کسان فیلڈ ڈائری (Kisan Field Diary)' : 'Kisan Field Diary'}
              </h1>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {language === 'ur'
              ? 'اپنے کھیت کی بوائی، آبپاشی، کھاد اور اسپرے کے تمام اخراجات اور تاریخیں باقاعدگی سے نوٹ کریں'
              : 'Log crop management milestones, canal water turns, seed treatments, and expenses to maintain a transparent agronomic audit trail.'}
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 bg-[#35A853] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{language === 'ur' ? 'نئی انٹری درج کریں' : 'Log New Farm Event'}</span>
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 space-y-4 animate-scaleUp">
            <h3 className="font-extrabold text-lg text-[#102A43]">Record Field Activity</h3>
            <form onSubmit={handleAdd} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-bold mb-1">Activity Type</label>
                  <select
                    value={activityType}
                    onChange={e => setActivityType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-gray-200"
                  >
                    <option value="sowing">Sowing (بوائی)</option>
                    <option value="irrigation">Irrigation (آبپاشی)</option>
                    <option value="fertilizer">Fertilizer (کھاد)</option>
                    <option value="pest_scouting">Pest / Spray (کیڑے مار)</option>
                    <option value="growth_monitoring">Growth Monitoring (نگرانی)</option>
                    <option value="harvest">Harvesting (کٹائی)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Target Crop / Plot</label>
                <input
                  type="text"
                  value={crop}
                  onChange={e => setCrop(e.target.value)}
                  placeholder="e.g. Berseem Plot 1 or Wheat Akbar-19"
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Detailed Observation &amp; Notes</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Applied first canal irrigation after laser leveling. No signs of fungal leaf spots."
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 font-bold mb-1">Cost Incurred (PKR - Optional)</label>
                <input
                  type="number"
                  value={costPkr}
                  onChange={e => setCostPkr(e.target.value)}
                  placeholder="e.g. 4500"
                  className="w-full p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#35A853] text-white font-bold rounded-xl shadow"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Chronological Timeline */}
      <div className="space-y-4">
        {fieldDiary.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 text-gray-400">
            No entries recorded yet. Click "Log New Farm Event" to add your first milestone.
          </div>
        ) : (
          fieldDiary.map(entry => {
            const config = activityIcons[entry.activityType] || activityIcons.irrigation;
            const Icon = config.icon;

            return (
              <div
                key={entry.id}
                className="bg-white rounded-2xl p-5 border border-emerald-900/10 shadow-xs flex flex-wrap items-start justify-between gap-4 hover:border-[#35A853]/40 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-[#102A43]">
                        {language === 'ur' ? config.urdu : config.label}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-md bg-gray-100 font-semibold text-gray-600">
                        {entry.crop}
                      </span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed max-w-2xl">{entry.notes}</p>
                    <span className="text-[10px] text-gray-400 block pt-1">{entry.date}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {entry.costPkr !== undefined && (
                    <span className="text-xs font-bold text-[#123D2A] bg-[#E9F7EF] px-3 py-1 rounded-lg">
                      PKR {entry.costPkr.toLocaleString()}
                    </span>
                  )}
                  <button
                    onClick={() => deleteDiaryEntry(entry.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

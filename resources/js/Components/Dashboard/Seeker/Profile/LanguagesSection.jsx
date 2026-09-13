import React from 'react';
import { Plus } from 'lucide-react';

export default function LanguagesSection() {
  const languages = [
    { name: 'English', level: 'Native', percentage: 100 },
    { name: 'Spanish', level: 'Professional', percentage: 75 },
    { name: 'French', level: 'Beginner', percentage: 30 },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-base">Languages</h3>
        <button type="button" className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {languages.map((lang, index) => (
          <div key={index} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800">{lang.name}</span>
              <span className="font-semibold text-slate-400">{lang.level}</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#014D55] rounded-full transition-all duration-300"
                style={{ width: `${lang.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import React from 'react';
import { Plus } from 'lucide-react';

export default function SkillsSection({ skills = ['React', 'TypeScript', 'Figma', 'Node.js', 'GraphQL', 'CSS', 'UX Research', 'Prototyping', 'A/B Testing', 'SQL'] }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-base">Skills</h3>
        <button type="button" className="p-1 text-slate-400 hover:text-slate-600 transition-colors">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <span key={index} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors select-none cursor-default">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

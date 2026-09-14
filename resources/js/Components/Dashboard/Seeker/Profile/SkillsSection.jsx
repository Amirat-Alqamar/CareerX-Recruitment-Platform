import React from 'react';
import { Plus } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function SkillsSection({ skills = [] }) {
  const { __, locale } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-base">{__('Skills')}</h3>
        <a
          href={`/${locale}/job-seeker/profile/edit`}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title={__('Add Skills')}
        >
          <Plus className="w-4 h-4" />
        </a>
      </div>

      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <span key={index} className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors select-none cursor-default">
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-slate-400">
          <p className="text-xs font-medium">{__('No skills added yet.')}</p>
          <a
            href={`/${locale}/job-seeker/profile/edit`}
            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#008A7B] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{__('Add Skills')}</span>
          </a>
        </div>
      )}
    </div>
  );
}


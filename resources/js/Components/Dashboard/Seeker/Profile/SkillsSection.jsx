import React from 'react';
import { Plus } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function SkillsSection({ skills = [], onManage }) {
  const { __ } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-base">{__('Skills')}</h3>
        <button
          type="button"
          onClick={onManage}
          className="p-1 text-slate-400 hover:text-[#008A7B] transition-colors cursor-pointer"
          title={__('Manage Skills')}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {skills && skills.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => {
            const name = skill.name || skill;
            return (
              <span
                key={index}
                onClick={onManage}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-[#E6F8F6] hover:text-[#008A7B] text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer select-none"
                title={__('Click to manage skills')}
              >
                {name}
              </span>
            );
          })}
        </div>
      ) : (
        <div className="py-4 text-center text-slate-400">
          <p className="text-xs font-medium">{__('No skills added yet.')}</p>
          <button
            type="button"
            onClick={onManage}
            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#008A7B] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{__('Add Skills')}</span>
          </button>
        </div>
      )}
    </div>
  );
}


import React from 'react';
import { Plus, Pencil, GraduationCap } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function EducationSection({ educations = [], onAdd, onEdit }) {
  const { __ } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#008A7B]" />
          <h3 className="font-extrabold text-slate-900 text-base">{__('Education')}</h3>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="p-1 text-slate-400 hover:text-[#008A7B] transition-colors cursor-pointer"
          title={__('Add Education')}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {educations && educations.length > 0 ? (
        <div className="space-y-5">
          {educations.map((edu, index) => {
            const initials = edu.university
              ? edu.university.trim().slice(0, 2).toUpperCase()
              : 'ED';

            return (
              <div key={edu.id || index} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#E6F8F6] text-[#008A7B] font-extrabold text-sm flex items-center justify-center shrink-0">
                  {initials}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">{edu.degree}</h4>
                    <button
                      type="button"
                      onClick={() => onEdit(edu)}
                      className="p-1 text-slate-400 hover:text-[#008A7B] transition-colors cursor-pointer"
                      title={__('Edit Education')}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    {edu.university}
                  </p>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                    <span>
                      {edu.start_year} – {edu.end_year || __('Present')}
                    </span>
                    {edu.gpa && (
                      <>
                        <span>•</span>
                        <span>{__('GPA')}: {edu.gpa}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center text-slate-400">
          <p className="text-sm font-medium">{__('No education details added yet.')}</p>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#008A7B] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{__('Add Education')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

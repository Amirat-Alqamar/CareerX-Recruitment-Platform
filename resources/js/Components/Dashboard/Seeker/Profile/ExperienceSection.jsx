import React from 'react';
import { Plus, Pencil } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function ExperienceSection({ experiences = [] }) {
  const { __, locale } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-base">{__('Experience')}</h3>
        <a
          href={`/${locale}/job-seeker/profile/edit`}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title={__('Add Experience')}
        >
          <Plus className="w-4 h-4" />
        </a>
      </div>

      {experiences && experiences.length > 0 ? (
        <div className="space-y-6">
          {experiences.map((exp, index) => {
            const initials = exp.company_name
              ? exp.company_name.trim().slice(0, 2).toUpperCase()
              : 'EX';

            return (
              <div key={exp.id || index} className="flex gap-4 items-start">
                <div className="w-12 h-12 rounded-2xl bg-[#014D55] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                  {initials}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-slate-900 text-sm">{exp.job_title}</h4>
                    <a
                      href={`/${locale}/job-seeker/profile/edit`}
                      className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </a>
                  </div>
                  <p className="text-xs font-bold text-slate-500">
                    {exp.company_name} {exp.employment_type ? `· ${exp.employment_type}` : ''}
                  </p>
                  <p className="text-xs font-semibold text-slate-400">
                    {exp.start_date} – {exp.is_current ? __('Present') : (exp.end_date || '')}
                  </p>
                  {exp.description && (
                    <p className="text-xs font-medium text-slate-600 mt-2 leading-normal whitespace-pre-line">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-6 text-center text-slate-400">
          <p className="text-sm font-medium">{__('No work experience added yet.')}</p>
          <a
            href={`/${locale}/job-seeker/profile/edit`}
            className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#008A7B] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{__('Add Experience')}</span>
          </a>
        </div>
      )}
    </div>
  );
}


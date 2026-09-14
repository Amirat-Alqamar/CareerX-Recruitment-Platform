import React from 'react';
import { Plus } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function LanguagesSection({ languages = [] }) {
  const { __, locale } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-base">{__('Languages')}</h3>
        <a
          href={`/${locale}/job-seeker/profile/edit`}
          className="p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          title={__('Add Languages')}
        >
          <Plus className="w-4 h-4" />
        </a>
      </div>

      {languages && languages.length > 0 ? (
        <div className="space-y-4">
          {languages.map((lang, index) => (
            <div key={index} className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-800">{__(lang.name)}</span>
                <span className="font-semibold text-slate-400">{__(lang.level)}</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#014D55] rounded-full transition-all duration-300"
                  style={{ width: `${lang.percentage || 70}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-slate-400">
          <p className="text-xs font-medium">{__('No languages added yet.')}</p>
          <a
            href={`/${locale}/job-seeker/profile/edit`}
            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#008A7B] hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{__('Add Languages')}</span>
          </a>
        </div>
      )}
    </div>
  );
}


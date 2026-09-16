import React from 'react';
import { Pencil } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function ProfessionalSummary({ summary, onEdit }) {
  const { __ } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-slate-900 text-base">{__('Professional Summary')}</h3>
        <button
          type="button"
          onClick={onEdit}
          className="p-1.5 text-slate-400 hover:text-[#008A7B] transition-colors cursor-pointer"
          title={__('Edit Summary')}
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
      {summary ? (
        <p className="text-slate-600 text-sm leading-relaxed font-medium whitespace-pre-line">
          {summary}
        </p>
      ) : (
        <div className="flex items-center justify-between py-2">
          <p className="text-slate-400 text-sm leading-relaxed font-medium italic">
            {__('No summary added yet. Add a short bio to introduce yourself to employers.')}
          </p>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#008A7B] hover:underline shrink-0 ml-4 rtl:ml-0 rtl:mr-4 cursor-pointer"
          >
            <span>+</span>
            <span>{__('Add Summary')}</span>
          </button>
        </div>
      )}
    </div>
  );
}


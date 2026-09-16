import React from 'react';
import { Plus, FileText, Download, Upload } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function ResumesSection({ resumes = [], onManage }) {
  const { __, locale } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#008A7B]" />
          <h3 className="font-extrabold text-slate-900 text-base">{__('Resume & CV')}</h3>
        </div>
        <button
          type="button"
          onClick={onManage}
          className="p-1 text-slate-400 hover:text-[#008A7B] transition-colors cursor-pointer"
          title={__('Manage Resumes')}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {resumes && resumes.length > 0 ? (
        <div className="space-y-3">
          {resumes.map((res, index) => (
            <div
              key={res.id || index}
              className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-[#E6F8F6] text-[#008A7B] flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-xs truncate">
                    {res.title || __('Resume Document')}
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    {res.created_at ? new Date(res.created_at).toLocaleDateString() : ''}
                  </span>
                </div>
              </div>

              <a
                href={`/${locale}/job-seeker/resumes/${res.id}/download`}
                className="p-1.5 text-slate-400 hover:text-[#008A7B] transition-colors"
                title={__('Download')}
              >
                <Download className="w-4 h-4" />
              </a>
            </div>
          ))}

          <button
            type="button"
            onClick={onManage}
            className="w-full py-2 text-xs font-bold text-[#008A7B] bg-[#E6F8F6]/50 hover:bg-[#E6F8F6] rounded-xl transition-colors cursor-pointer text-center block"
          >
            {__('Manage / Upload CV')}
          </button>
        </div>
      ) : (
        <div className="py-4 text-center text-slate-400">
          <p className="text-xs font-medium">{__('No resumes uploaded yet.')}</p>
          <button
            type="button"
            onClick={onManage}
            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#008A7B] hover:underline cursor-pointer"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{__('Upload CV')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

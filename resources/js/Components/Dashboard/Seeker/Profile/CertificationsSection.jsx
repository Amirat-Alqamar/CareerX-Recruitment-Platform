import React from 'react';
import { Plus, Pencil, Award, ExternalLink } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function CertificationsSection({ certifications = [], onAdd, onEdit }) {
  const { __ } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-[#008A7B]" />
          <h3 className="font-extrabold text-slate-900 text-base">{__('Certificates')}</h3>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="p-1 text-slate-400 hover:text-[#008A7B] transition-colors cursor-pointer"
          title={__('Add Certificate')}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {certifications && certifications.length > 0 ? (
        <div className="space-y-4">
          {certifications.map((cert, index) => (
            <div key={cert.id || index} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start justify-between gap-3">
              <div className="space-y-1 min-w-0">
                <h4 className="font-extrabold text-slate-900 text-sm truncate">
                  {cert.name}
                </h4>
                <p className="text-xs font-bold text-slate-600">
                  {cert.issuer}
                </p>
                {cert.issue_date && (
                  <p className="text-[11px] font-semibold text-slate-400">
                    {__('Issued')}: {cert.issue_date}
                  </p>
                )}
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#008A7B] hover:underline pt-1"
                  >
                    <span>{__('View Credential')}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <button
                type="button"
                onClick={() => onEdit(cert)}
                className="p-1 text-slate-400 hover:text-[#008A7B] transition-colors cursor-pointer shrink-0"
                title={__('Edit Certificate')}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-4 text-center text-slate-400">
          <p className="text-xs font-medium">{__('No certificates added yet.')}</p>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-[#008A7B] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{__('Add Certificate')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

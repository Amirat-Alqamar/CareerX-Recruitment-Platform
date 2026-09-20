import React from 'react';
import { Plus, Pencil, FolderKanban, ExternalLink, Globe } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function PortfolioSection({ portfolio = [], onAdd, onEdit }) {
  const { __ } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderKanban className="w-5 h-5 text-[#008A7B]" />
          <h3 className="font-extrabold text-slate-900 text-base">{__('Portfolio & Projects')}</h3>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="p-1 text-slate-400 hover:text-[#008A7B] transition-colors cursor-pointer"
          title={__('Add Project')}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {portfolio && portfolio.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolio.map((item, index) => (
            <div
              key={item.id || index}
              className="group rounded-2xl border border-slate-100 overflow-hidden bg-white hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="h-32 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                {item.file_path ? (
                  <img
                    src={`/storage/${item.file_path}`}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#E6F8F6] text-[#008A7B] flex items-center justify-center font-bold">
                    <Globe className="w-6 h-6" />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => onEdit(item)}
                  className="absolute top-2 right-2 rtl:right-auto rtl:left-2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 shadow-sm flex items-center justify-center transition-all cursor-pointer"
                  title={__('Edit Project')}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#E6F8F6] text-[#008A7B]">
                      {__(item.type || 'Project')}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm line-clamp-1">
                    {item.title}
                  </h4>
                </div>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008A7B] hover:underline pt-2 border-t border-slate-50"
                  >
                    <span>{__('View Project')}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-6 text-center text-slate-400">
          <p className="text-sm font-medium">{__('No portfolio projects added yet.')}</p>
          <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-[#008A7B] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{__('Add Project')}</span>
          </button>
        </div>
      )}
    </div>
  );
}

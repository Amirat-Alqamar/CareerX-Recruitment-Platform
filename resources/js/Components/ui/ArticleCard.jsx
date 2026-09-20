import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ArticleCard({ article, onReadMore }) {
  const { __ } = useTranslation();

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
      <div>
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 text-xs font-semibold">
            <span className="px-3 py-1 rounded-full bg-[#E6F8F6] text-[#008A7B]">
              {__(article.category)}
            </span>
            <span className="text-slate-400 flex items-center gap-1 font-normal">
              <Clock className="w-3.5 h-3.5" />
              {__(article.readTime)}
            </span>
          </div>

          <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#008A7B] transition-colors leading-snug line-clamp-2">
            {__(article.title)}
          </h3>

          <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
            {__(article.summary)}
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
        <span>
          {article.author} · {article.date}
        </span>
        <button
          onClick={() => onReadMore(article)}
          className="text-[#008A7B] font-bold inline-flex items-center gap-1 hover:gap-2 transition-all cursor-pointer"
        >
          <span>{__('Read')}</span>
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
}

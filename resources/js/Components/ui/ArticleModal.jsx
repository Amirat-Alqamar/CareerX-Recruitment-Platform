import React, { useEffect } from 'react';
import { X, Calendar, Clock, User } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ArticleModal({ article, onClose }) {
  const { __ } = useTranslation();

  useEffect(() => {
    if (article) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [article]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/60 backdrop-blur-md">
      {/* Backdrop overlay */}
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[85vh] flex flex-col z-10 shadow-2xl overflow-hidden border border-slate-100">

        {/* Sticky Header Actions */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={onClose}
            className="p-2.5 bg-white/80 hover:bg-white text-slate-600 hover:text-slate-900 rounded-full shadow-md backdrop-blur-sm transition-all duration-200 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6 custom-scrollbar">

          {/* Article Banner Image */}
          <div className="h-64 sm:h-80 w-full overflow-hidden rounded-2xl bg-slate-100">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="px-3 py-1 rounded-full bg-[#E6F8F6] text-[#008A7B]">
              {__(article.category)}
            </span>
            {article.readTime && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {__(article.readTime)}
              </span>
            )}
            {article.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {article.date}
              </span>
            )}
            {article.author && (
              <span className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" />
                {article.author}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
            {__(article.title)}
          </h2>

          {/* Divider */}
          <hr className="border-slate-100" />

          {/* Article Full Content */}
          <div className="text-slate-600 text-base leading-relaxed space-y-4">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: __(article.content) }} />
            ) : (
              <p>{__(article.summary)}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

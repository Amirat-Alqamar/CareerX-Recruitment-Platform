import React, { useState } from 'react';
import ArticleCard from '@/Components/ui/ArticleCard';
import ArticleModal from '@/Components/ui/ArticleModal';
import { articlesData } from '@/Data/articlesData';
import { useTranslation } from '@/hooks/useTranslation';

export default function BlogSection() {
  const { __ } = useTranslation();
  const [selectedArticle, setSelectedArticle] = useState(null);

  return (
    <section id="blog" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00BBA7]">
            {__('CAREER RESOURCES')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {__('Latest from the Blog')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {articlesData.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onReadMore={(art) => setSelectedArticle(art)}
            />
          ))}
        </div>

      </div>

      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </section>
  );
}

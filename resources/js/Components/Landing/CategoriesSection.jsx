import React from 'react';
import CategoryCard from '@/Components/ui/CategoryCard';
import { categories } from '@/Data/categories';
import { useTranslation } from '@/hooks/useTranslation';

export default function CategoriesSection() {
  const { __ } = useTranslation();

  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-primary-accent">
            {__('EXPLORE BY FIELD')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            {__('Browse Job Categories')}
          </h2>
          <p className="text-base text-gray-500">
            {__('Discover opportunities across every industry and discipline')}
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

      </div>
    </section>
  );
}

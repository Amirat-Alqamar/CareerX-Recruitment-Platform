import React from 'react';
import { Link } from '@inertiajs/react';
import { useTranslation } from '@/hooks/useTranslation';
import { Briefcase } from 'lucide-react';

export default function CategoryCard({ category }) {
  const { __, locale } = useTranslation();
  const IconComponent = category.icon || Briefcase;

  const targetCategory = category.slug || category.id;
  const categoryHref = `/${locale}/jobs?category=${encodeURIComponent(targetCategory)}`;

  return (
    <Link
      href={categoryHref}
      className={`${category.cardBg || 'bg-slate-50'} p-6 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer border border-transparent hover:border-gray-200/60 group`}
    >
      <div className={`w-14 h-14 rounded-xl ${category.iconBg || 'bg-primary'} text-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
        <IconComponent className="w-7 h-7" />
      </div>

      <div className="space-y-0.5">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-primary transition-colors">
          {__(category.name)}
        </h3>
        <p className="text-sm font-medium text-gray-500">
          {category.jobs_count !== undefined
            ? `${category.jobs_count} ${__('open roles')}`
            : (category.rolesCount ? `${category.rolesCount} ${__('open roles')}` : __('Explore jobs'))}
        </p>
      </div>
    </Link>
  );
}

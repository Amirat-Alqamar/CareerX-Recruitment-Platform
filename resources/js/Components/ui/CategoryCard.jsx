import React from 'react';
import { Link } from '@inertiajs/react';

export default function CategoryCard({ category }) {
  const IconComponent = category.icon;

  return (
    <Link
      href={`/jobs?category=${category.id}`}
      className={`${category.cardBg} p-6 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer border border-transparent hover:border-gray-200/60 group`}
    >
      {/* Icon Wrapper */}
      <div className={`w-14 h-14 rounded-xl ${category.iconBg} text-white flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105`}>
        <IconComponent className="w-7 h-7" />
      </div>

      {/* Category Info */}
      <div className="space-y-0.5">
        <h3 className="font-bold text-gray-900 text-base sm:text-lg group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-sm font-medium text-gray-500">
          {category.rolesCount} open roles
        </p>
      </div>
    </Link>
  );
}

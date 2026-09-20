import React from 'react';
import CategoryCard from '@/Components/ui/CategoryCard';
import { categories as staticCategories } from '@/Data/categories';
import { useTranslation } from '@/hooks/useTranslation';
import {
  Code2,
  Palette,
  TrendingUp,
  DollarSign,
  Target,
  Users,
  Settings,
  HeartPulse,
  Briefcase,
  Layers
} from 'lucide-react';

const CATEGORY_STYLES = {
  'software-and-it': {
    icon: Code2,
    cardBg: 'bg-[#EBF7F7]',
    iconBg: 'bg-[#018790]',
  },
  'design-and-creative': {
    icon: Palette,
    cardBg: 'bg-[#F2EDFF]',
    iconBg: 'bg-[#7C3AED]',
  },
  'marketing-and-sales': {
    icon: TrendingUp,
    cardBg: 'bg-[#EAFBF3]',
    iconBg: 'bg-[#059669]',
  },
  'finance-and-accounting': {
    icon: DollarSign,
    cardBg: 'bg-[#FFFBEB]',
    iconBg: 'bg-[#D97706]',
  },
  'engineering-and-tech': {
    icon: Settings,
    cardBg: 'bg-[#ECFDF5]',
    iconBg: 'bg-[#0F766E]',
  },
  'human-resources': {
    icon: Users,
    cardBg: 'bg-[#EFF6FF]',
    iconBg: 'bg-[#0284C7]',
  },
  'healthcare-and-medical': {
    icon: HeartPulse,
    cardBg: 'bg-[#FFF0F5]',
    iconBg: 'bg-[#DB2777]',
  },
  'business-and-project-management': {
    icon: Briefcase,
    cardBg: 'bg-[#F1F5F9]',
    iconBg: 'bg-[#475569]',
  },
  'customer-support': {
    icon: Target,
    cardBg: 'bg-[#FFF1F1]',
    iconBg: 'bg-[#E11D48]',
  },
  'writing-and-translation': {
    icon: Layers,
    cardBg: 'bg-[#FDF4FF]',
    iconBg: 'bg-[#A21CAF]',
  },
};

const DEFAULT_STYLE = {
  icon: Briefcase,
  cardBg: 'bg-[#F8FAFC]',
  iconBg: 'bg-[#014D55]',
};

export default function CategoriesSection({ categories = [] }) {
  const { __ } = useTranslation();

  const displayCategories = categories && categories.length > 0
    ? categories.map((cat) => {
        const style = CATEGORY_STYLES[cat.slug] || DEFAULT_STYLE;
        return {
          id: cat.slug || cat.id,
          name: cat.name,
          slug: cat.slug,
          jobs_count: cat.jobs_count ?? 0,
          icon: style.icon,
          cardBg: style.cardBg,
          iconBg: style.iconBg,
        };
      })
    : staticCategories;

  return (
    <section id="categories" className="py-16 sm:py-20 bg-white scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>

      </div>
    </section>
  );
}

import React, { useState } from 'react';
import TestimonialCard from '@/Components/ui/TestimonialCard';
import { testimonialsData } from '@/Data/testimonialsData';
import { useTranslation } from '@/hooks/useTranslation';

export default function TestimonialsSection() {
  const { __ } = useTranslation();
  const [activeTab, setActiveTab] = useState('candidates');

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00BBA7]">
            {__('WHAT PEOPLE SAY')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {__('Trusted by Thousands')}
          </h2>
        </div>

        {/* Toggle Switch Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-slate-200/70 p-1.5 rounded-2xl inline-flex items-center gap-1">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'candidates'
                  ? 'bg-[#014D56] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {__('Candidates')}
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === 'companies'
                  ? 'bg-[#014D56] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {__('Companies')}
            </button>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
          {testimonialsData[activeTab].map((item) => (
            <TestimonialCard key={item.id} testimonial={item} />
          ))}
        </div>

      </div>
    </section>
  );
}

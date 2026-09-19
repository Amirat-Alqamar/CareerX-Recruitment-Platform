import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { howItWorksData } from '@/Data/howItWorksData';
import { useTranslation } from '@/hooks/useTranslation';

export default function HowItWorksSection() {
  const { __, locale } = useTranslation();

  return (
    <section id="about" className="py-20 bg-[#F8FAFC] scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00BBA7]">
            {__('SIMPLE PROCESS')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] tracking-tight">
            {__('How CareerX Works')}
          </h2>
        </div>

        {/* Two Columns Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {howItWorksData.map((column) => {
            const HeaderIcon = column.headerIcon;

            return (
              <div
                key={column.id}
                className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm flex flex-col justify-between"
              >
                <div>
                  {/* Column Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div className={`w-12 h-12 rounded-2xl ${column.cardHeaderBg} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                      <HeaderIcon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                      {__(column.title)}
                    </h3>
                  </div>

                  {/* Steps List */}
                  <div className="space-y-6 mb-10">
                    {column.steps.map((step) => (
                      <div key={step.number} className="flex items-start gap-4 group">
                        {/* Step Number Badge */}
                        <div className="w-9 h-9 rounded-xl bg-[#E6F8F6] text-[#008A7B] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-[#00BBA7] group-hover:text-white transition-colors duration-200">
                          {step.number}
                        </div>

                        {/* Step Content */}
                        <div className="space-y-1">
                          <h4 className="text-base font-bold text-slate-900 group-hover:text-[#008A7B] transition-colors duration-200">
                            {__(step.title)}
                          </h4>
                          <p className="text-sm text-slate-500 leading-relaxed">
                            {__(step.description)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call To Action Button */}
                <Link
                  href={column.ctaHref?.startsWith('/') ? `/${locale}${column.ctaHref}` : column.ctaHref}
                  className={`w-full py-4 px-6 rounded-2xl ${column.btnBg} text-white font-bold text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg active:scale-[0.99]`}
                >
                  <span>{__(column.ctaText)}</span>
                  <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

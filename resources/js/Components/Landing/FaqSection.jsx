import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { faqData } from '@/Data/faqData';
import useTranslation from '@/hooks/useTranslation';

export default function FaqSection() {
  const { __ } = useTranslation();
  const [openId, setOpenId] = useState('faq-1');

  const toggleFaq = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-[#F8FAFC]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#00BBA7]">
            {__('GOT QUESTIONS?')}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {__('Frequently Asked Questions')}
          </h2>
        </div>

        {/* Accordion Container */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqData.map((item) => {
            const isOpen = openId === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#00BBA7]/40 shadow-sm'
                    : 'bg-white border-slate-100 hover:border-slate-200'
                }`}
              >
                {/* Accordion Header Button */}
                <button
                  onClick={() => toggleFaq(item.id)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className={`font-bold text-base sm:text-lg transition-colors ${
                    isOpen ? 'text-[#014D55]' : 'text-slate-900'
                  }`}>
                    {__(item.question)}
                  </span>

                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 bg-[#E6F8F6] text-[#008A7B]' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {/* Accordion Content */}
                {isOpen && (
                  <div className="px-6 pb-6 pt-0 text-slate-500 text-sm sm:text-base leading-relaxed border-t border-slate-50 mt-1 animate-fade-in">
                    <p className="pt-4">{__(item.answer)}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

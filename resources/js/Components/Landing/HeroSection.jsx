import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Search, MapPin, Briefcase } from 'lucide-react';
import { popularTags } from '@/Data/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function HeroSection() {
  const { __, locale } = useTranslation();
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('keyword', keyword.trim());
    if (location.trim()) params.set('location', location.trim());
    const qs = params.toString();
    router.visit(`/${locale}/jobs${qs ? `?${qs}` : ''}`);
  };

  const handleTagClick = (tag) => {
    router.visit(`/${locale}/jobs?keyword=${encodeURIComponent(tag)}`);
  };

  return (
    <section className="bg-gradient-to-b from-primary-light/60 via-white to-white py-12 lg:py-20">

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column - Text Content */}
          <div className="lg:col-span-6 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light border border-gray-200 text-primary font-semibold text-xs">
              <span className="w-2 h-2 rounded-full bg-primary-accent animate-pulse"></span>
              {__('50,000+ active job listings this week')}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
              {__('Find Your Dream Job or')} <span className="text-primary">{__('Hire the Perfect')}</span> {__('Candidate.')}
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-2xl leading-relaxed">
              {__("CareerX connects top professionals with world-class companies. Whether you're launching a career or scaling a team, we make hiring simple, fast, and effective.")}
            </p>

            {/* Search Box Card */}
            <form onSubmit={handleSearch} className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-gray-100 flex flex-col sm:flex-row items-center gap-3">
              <div className="flex items-center gap-3 px-3 w-full sm:w-1/2">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={__('Job title, skill, or keyword')}
                  className="w-full text-sm border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400 bg-transparent"
                />
              </div>

              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

              <div className="flex items-center gap-3 px-3 w-full sm:w-1/2">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={__('City, state, or remote')}
                  className="w-full text-sm border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400 bg-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg shrink-0 cursor-pointer"
              >
                {__('Search Jobs')}
              </button>
            </form>

            {/* Popular Searches */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-semibold text-gray-400">{__('Popular:')}</span>
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="text-xs font-medium text-gray-600 bg-primary-light hover:bg-gray-200 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                >
                  {__(tag)}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column - Image & Floating Cards */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">
              <img
                src="/images/hero.webp"
                alt="Office Team"
                className="w-full h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating Badge 1 - AI Match Rate */}
            <div className="absolute top-6 right-6 rtl:right-auto rtl:left-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-light text-primary-accent flex items-center justify-center font-bold text-sm">
                98%
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">{__('Match Rate')}</p>
                <p className="text-[11px] text-gray-500">{__('AI powered matching')}</p>
              </div>
            </div>

            {/* Floating Badge 2 - New Jobs */}
            <div className="absolute -bottom-6 -left-6 rtl:-left-auto rtl:-right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 flex items-center gap-3.5 hidden sm:flex">
              <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center shadow-md">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900">{__('2,483 New Jobs')}</p>
                <p className="text-xs text-gray-500">{__('Posted this week')}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

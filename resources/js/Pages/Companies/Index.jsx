import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import useTranslation from '@/hooks/useTranslation';
import {
  Building2,
  Search,
  MapPin,
  Users,
  Briefcase,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight
} from 'lucide-react';

const COMPANY_AVATAR_COLORS = [
  'bg-teal-900',
  'bg-purple-600',
  'bg-emerald-600',
  'bg-rose-600',
  'bg-sky-600',
  'bg-amber-600',
  'bg-indigo-600',
  'bg-[#014D55]',
];

export default function Index({ companies = { data: [], links: [], total: 0 }, filters = {} }) {
  const { __, locale } = useTranslation();
  const [keyword, setKeyword] = useState(filters.keyword || '');

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    router.get(
      `/${locale}/companies`,
      { keyword: keyword || undefined },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleClear = () => {
    setKeyword('');
    router.get(`/${locale}/companies`, {}, { preserveState: false, preserveScroll: true });
  };

  return (
    <MainLayout>
      <Head title={__('Top Hiring Companies')} />

      <section className="bg-gradient-to-b from-primary-light/40 via-gray-50/50 to-gray-50/50 pt-12 pb-16 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-accent inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-primary-accent" />
              {__('EXPLORE EMPLOYERS')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              {__('Top Hiring Companies')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {__('Discover leading employers and find companies that match your career ambitions')}
            </p>
          </div>

          <div className="mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl border border-gray-200/80 flex items-center gap-2"
            >
              <div className="flex items-center gap-3 px-3 flex-1">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={__('Search companies by name or industry...')}
                  className="w-full text-sm border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400 bg-transparent"
                />
              </div>

              {keyword && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-xs font-semibold text-gray-400 hover:text-gray-600 px-2 cursor-pointer"
                >
                  {__('Clear')}
                </button>
              )}

              <button
                type="submit"
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
              >
                {__('Search')}
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50/30 min-h-[600px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8">

          <div className="flex items-center justify-between text-xs font-semibold text-gray-500">
            <span>
              {companies?.total > 0
                ? `${companies.total} ${__('Companies Registered')}`
                : __('No companies recorded.')}
            </span>
          </div>

          {companies?.data && companies.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {companies.data.map((company, index) => {
                const initials = company.name
                  ? company.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
                  : 'CO';
                const avatarBg = COMPANY_AVATAR_COLORS[index % COMPANY_AVATAR_COLORS.length];

                return (
                  <div
                    key={company.id}
                    className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-600/30 transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          {company.logo ? (
                            <img
                              src={company.logo.startsWith('http') ? company.logo : `/storage/${company.logo}`}
                              alt={company.name}
                              className="w-13 h-13 rounded-2xl object-cover border border-gray-100 shrink-0"
                            />
                          ) : (
                            <div
                              className={`w-13 h-13 rounded-2xl ${avatarBg} text-white font-black flex items-center justify-center text-base shadow-sm shrink-0`}
                            >
                              {initials}
                            </div>
                          )}

                          <div>
                            <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary transition-colors">
                              {company.name}
                            </h3>
                            {company.address && (
                              <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                                <span>{company.address}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {company.jobs_count > 0 && (
                          <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 text-[11px] font-extrabold shrink-0 border border-teal-100">
                            {company.jobs_count} {__('open roles')}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                        {company.description || __('No description provided.')}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-gray-500 font-medium">
                        {company.company_size && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700">
                            <Users className="w-3.5 h-3.5 text-gray-400" />
                            <span>{company.company_size} {__('Employees')}</span>
                          </span>
                        )}
                        {company.website && (
                          <a
                            href={company.website.startsWith('http') ? company.website : `https://${company.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>{__('Website')}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    <div className="pt-5 mt-4 border-t border-gray-50 flex items-center justify-between">
                      <Link
                        href={`/${locale}/jobs?company_id=${company.id}`}
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light hover:bg-primary text-primary hover:text-white text-xs font-bold transition-all"
                      >
                        <Briefcase className="w-4 h-4" />
                        <span>{__('View Open Jobs')}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-full bg-teal-50 text-primary flex items-center justify-center mx-auto">
                <Building2 className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-gray-800 text-base">{__('No companies recorded.')}</h3>
              {keyword && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-hover transition-colors"
                >
                  {__('Clear Search')}
                </button>
              )}
            </div>
          )}

          {companies?.links && companies.links.length > 3 && (
            <div className="flex items-center justify-center gap-1.5 pt-6">
              {companies.links.map((link, idx) => {
                const isLabelNext = link.label.includes('Next');
                const isLabelPrev = link.label.includes('Previous');

                return (
                  <Link
                    key={idx}
                    href={link.url || '#'}
                    preserveScroll
                    preserveState
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                      link.active
                        ? 'bg-primary text-white shadow-sm'
                        : !link.url
                        ? 'text-gray-300 pointer-events-none'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {isLabelPrev ? (
                      <ChevronLeft className="w-4 h-4 rtl:rotate-180 inline" />
                    ) : isLabelNext ? (
                      <ChevronRight className="w-4 h-4 rtl:rotate-180 inline" />
                    ) : (
                      <span dangerouslySetInnerHTML={{ __html: link.label }} />
                    )}
                  </Link>
                );
              })}
            </div>
          )}

        </div>
      </section>
    </MainLayout>
  );
}

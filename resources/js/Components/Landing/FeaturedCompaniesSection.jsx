import React from 'react';
import { Link } from '@inertiajs/react';
import { Building2, MapPin, Users, ArrowRight, ExternalLink } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

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

export default function FeaturedCompaniesSection({
  companies = [],
  totalCompaniesCount = 0,
}) {
  const { __, locale } = useTranslation();
  const companiesRoute = `/${locale}/companies`;
  const displayCompanies = (companies || []).slice(0, 6);

  return (
    <section id="companies" className="py-16 bg-white scroll-mt-20 border-b border-gray-100">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-accent">
              {__('TOP EMPLOYERS')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              {__('Featured Companies')}
            </h2>
          </div>
          <Link
            href={companiesRoute}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>{__('View all companies')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        {displayCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayCompanies.map((company, index) => {
              const initials = company.name
                ? company.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
                : 'CO';
              const avatarBg = COMPANY_AVATAR_COLORS[index % COMPANY_AVATAR_COLORS.length];
              const locationText = company.city?.name || company.address || null;

              return (
                <div
                  key={company.id}
                  className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-teal-600/30 transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3.5 min-w-0">
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

                        <div className="min-w-0">
                          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary transition-colors truncate">
                            {company.name}
                          </h3>
                          {locationText && (
                            <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5 truncate">
                              <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                              <span className="truncate">{locationText}</span>
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
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 text-gray-700 border border-gray-100">
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

                  <div className="pt-5 mt-4 border-t border-gray-50">
                    <Link
                      href={company.jobs_count > 0 ? `/${locale}/jobs?company_id=${company.id}` : companiesRoute}
                      className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-light hover:bg-primary text-primary hover:text-white text-xs font-bold transition-all"
                    >
                      <span>{company.jobs_count > 0 ? __('View Open Jobs') : __('Browse Companies')}</span>
                      <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-primary flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-700">
              {__('No companies found')}
            </p>
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href={companiesRoute}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm group"
          >
            <span>
              {totalCompaniesCount && totalCompaniesCount > 0
                ? `${__('Browse All Companies')} (${totalCompaniesCount})`
                : __('Browse All Companies')}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors rtl:rotate-180" />
          </Link>
        </div>

      </div>
    </section>
  );
}

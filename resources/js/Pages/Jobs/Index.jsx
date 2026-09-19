import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import JobCard from '@/Components/ui/JobCard';
import JobDetailsModal from '@/Components/Jobs/JobDetailsModal';
import useTranslation from '@/hooks/useTranslation';
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  SlidersHorizontal,
  X,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  RotateCcw
} from 'lucide-react';

export default function Index({
  jobs = { data: [], links: [], total: 0, from: 0, to: 0 },
  totalJobsCount = 0,
  selectedCompany = null,
  categories = [],
  cities = [],
  savedJobIds = [],
  appliedJobIds = [],
  resumes = [],
  filters = {},
  selectedJobId = null,
}) {
  const { __, locale } = useTranslation();

  // Filter state
  const [keyword, setKeyword] = useState(filters.keyword || '');
  const [selectedCategory, setSelectedCategory] = useState(filters.category || filters.category_id || '');
  const [workType, setWorkType] = useState(filters.work_type || '');
  const [jobType, setJobType] = useState(filters.job_type || '');
  const [cityId, setCityId] = useState(filters.city_id || '');
  const [selectedJob, setSelectedJob] = useState(null);

  // Auto sync filters when URL changes
  useEffect(() => {
    setKeyword(filters.keyword || '');
    setSelectedCategory(filters.category || filters.category_id || '');
    setWorkType(filters.work_type || '');
    setJobType(filters.job_type || '');
    setCityId(filters.city_id || '');
  }, [filters]);

  // Auto open modal if selectedJobId provided
  useEffect(() => {
    if (selectedJobId && jobs?.data) {
      const found = jobs.data.find((j) => String(j.id) === String(selectedJobId));
      if (found) setSelectedJob(found);
    }
  }, [selectedJobId, jobs]);

  // Submit filter changes
  const applyFilters = (newFilters = {}) => {
    const query = {
      keyword: keyword || undefined,
      category: selectedCategory || undefined,
      company_id: filters.company_id || undefined,
      work_type: workType || undefined,
      job_type: jobType || undefined,
      city_id: cityId || undefined,
      ...newFilters,
    };

    // Remove empty/undefined
    Object.keys(query).forEach((key) => {
      if (!query[key]) delete query[key];
    });

    router.get(`/${locale}/jobs`, query, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    applyFilters();
  };

  const handleCategoryClick = (catSlugOrId) => {
    const updated = selectedCategory === String(catSlugOrId) ? '' : String(catSlugOrId);
    setSelectedCategory(updated);
    applyFilters({ category: updated || undefined });
  };

  const handleClearFilters = () => {
    setKeyword('');
    setSelectedCategory('');
    setWorkType('');
    setJobType('');
    setCityId('');
    router.get(`/${locale}/jobs`, {}, { preserveState: false, preserveScroll: true });
  };

  const hasActiveFilters = Boolean(keyword || selectedCategory || workType || jobType || cityId || filters.company_id);

  // Work type options
  const workTypeOptions = [
    { value: '', label: __('All Types') },
    { value: 'remote', label: __('Remote') },
    { value: 'on_site', label: __('On-site') },
    { value: 'hybrid', label: __('Hybrid') },
  ];

  // Job type options
  const jobTypeOptions = [
    { value: '', label: __('All Types') },
    { value: 'full_time', label: __('Full-time') },
    { value: 'part_time', label: __('Part-time') },
    { value: 'contract', label: __('Contract') },
    { value: 'internship', label: __('Internship') },
  ];

  return (
    <MainLayout>
      <Head title={__('Featured Job Listings')} />

      {/* Hero / Section Header (Identical branding & titles to section on Landing Page) */}
      <section className="bg-gradient-to-b from-primary-light/40 via-gray-50/50 to-gray-50/50 pt-12 pb-16 border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary-accent inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-gray-200 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-primary-accent" />
              {__('LATEST OPPORTUNITIES')}
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              {__('Featured Job Listings')}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
              {__('Discover opportunities across every industry and discipline')}
            </p>
          </div>

          {/* Search Toolbar */}
          <div className="mt-8 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-gray-200/80 flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="flex items-center gap-3 px-3 w-full sm:flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 shrink-0" />
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder={__('Search by job title or keyword...')}
                  className="w-full text-sm border-none focus:outline-none focus:ring-0 text-gray-800 placeholder-gray-400 bg-transparent pr-7"
                />
                {keyword && (
                  <button
                    type="button"
                    onClick={() => {
                      setKeyword('');
                      applyFilters({ keyword: undefined });
                    }}
                    className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer shrink-0"
                    title={__('Clear search')}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="hidden sm:block w-px h-8 bg-gray-200"></div>

              <div className="flex items-center gap-3 px-3 w-full sm:w-56">
                <MapPin className="w-5 h-5 text-gray-400 shrink-0" />
                <select
                  value={cityId}
                  onChange={(e) => {
                    setCityId(e.target.value);
                    applyFilters({ city_id: e.target.value || undefined });
                  }}
                  className="w-full text-sm border-none focus:outline-none focus:ring-0 text-gray-700 bg-transparent cursor-pointer font-medium"
                >
                  <option value="">{__('All Locations')}</option>
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-sm rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
              >
                {__('Search')}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-12 bg-gray-50/30 min-h-[600px]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 space-y-8">

          {/* Categories Navigation Bar (All types from categories section) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-primary" />
                {__('Filter by Category')}
              </span>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="text-xs font-bold text-rose-600 hover:text-rose-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{__('Clear Filters')}</span>
                </button>
              )}
            </div>

            {/* Category Pills Slider */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
              <button
                type="button"
                onClick={() => handleCategoryClick('')}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                  !selectedCategory
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {__('All Categories')} ({totalJobsCount || categories.reduce((sum, c) => sum + (c.jobs_count || 0), 0)})
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === String(cat.slug) || selectedCategory === String(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryClick(cat.slug || cat.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer border flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <span>{__(cat.name)}</span>
                    {cat.jobs_count !== undefined && (
                      <span
                        className={`px-1.5 py-0.5 rounded-md text-[10px] font-extrabold ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {cat.jobs_count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Active Filters Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {keyword && (
                <div className="flex items-center gap-1.5 bg-gray-100 border border-gray-200 px-3 py-1 rounded-xl text-xs font-bold text-gray-700 shadow-2xs">
                  <Search className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                  <span>{__('Search:')} "{keyword}"</span>
                  <button
                    type="button"
                    onClick={() => {
                      setKeyword('');
                      applyFilters({ keyword: undefined });
                    }}
                    className="text-gray-400 hover:text-rose-600 ml-1 cursor-pointer p-0.5 transition-colors"
                    title={__('Clear search')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {selectedCompany && (
                <div className="flex items-center gap-1.5 bg-teal-50 border border-teal-200/80 px-3 py-1 rounded-xl text-xs font-bold text-teal-900 shadow-2xs">
                  <Building2 className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{__('Company:')} {selectedCompany.name}</span>
                  <button
                    type="button"
                    onClick={() => applyFilters({ company_id: undefined })}
                    className="text-teal-600 hover:text-teal-900 ml-1 cursor-pointer p-0.5"
                    title={__('Clear company filter')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {selectedCategory && (
                <div className="flex items-center gap-1.5 bg-teal-50/60 border border-teal-200/70 px-3 py-1 rounded-xl text-xs font-bold text-primary shadow-2xs">
                  <Layers className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>
                    {__('Category:')}{' '}
                    {__(
                      categories.find(
                        (c) => String(c.slug) === String(selectedCategory) || String(c.id) === String(selectedCategory)
                      )?.name || selectedCategory
                    )}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('');
                      applyFilters({ category: undefined });
                    }}
                    className="text-primary hover:text-rose-600 ml-1 cursor-pointer p-0.5 transition-colors"
                    title={__('Clear category filter')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Secondary Filters: Work Type & Job Type Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-3">
              {/* Work Type Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">{__('Work Type:')}</span>
                <select
                  value={workType}
                  onChange={(e) => {
                    setWorkType(e.target.value);
                    applyFilters({ work_type: e.target.value || undefined });
                  }}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  {workTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Job Type Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">{__('Job Type:')}</span>
                <select
                  value={jobType}
                  onChange={(e) => {
                    setJobType(e.target.value);
                    applyFilters({ job_type: e.target.value || undefined });
                  }}
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  {jobTypeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Results Count */}
            <div className="text-xs font-semibold text-gray-500">
              {jobs?.total > 0 ? (
                <span>
                  {__('Showing :count of :total jobs', {
                    count: jobs.data.length,
                    total: jobs.total,
                  })}
                </span>
              ) : (
                <span>{__('0 jobs found')}</span>
              )}
            </div>
          </div>

          {/* Jobs Grid */}
          {jobs?.data && jobs.data.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.data.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  savedJobIds={savedJobIds}
                  appliedJobIds={appliedJobIds}
                  onViewDetails={(j) => setSelectedJob(j)}
                />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 max-w-lg mx-auto space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-teal-50 text-primary flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  {__('No jobs found')}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {__('Try clearing or adjusting your search filters to see more results.')}
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-hover transition-all cursor-pointer shadow-sm"
                >
                  {__('Clear Filters')}
                </button>
              )}
            </div>
          )}

          {/* Pagination */}
          {jobs?.links && jobs.links.length > 3 && (
            <div className="flex items-center justify-center gap-1.5 pt-6">
              {jobs.links.map((link, idx) => {
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

      {/* Modal for Job Details & Application */}
      <JobDetailsModal
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
        savedJobIds={savedJobIds}
        appliedJobIds={appliedJobIds}
        resumes={resumes}
      />
    </MainLayout>
  );
}

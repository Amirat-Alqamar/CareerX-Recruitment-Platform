import React, { useState, useEffect } from 'react';
import { Head, router, usePage, Link } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ModalWrapper from '@/Components/Dashboard/Seeker/Profile/Modals/ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import {
  Search,
  MapPin,
  Building2,
  Briefcase,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  Eye,
  Filter,
  X,
  Send,
  FileText,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export default function Jobs({
  jobs = { data: [], links: [] },
  categories = [],
  cities = [],
  savedJobIds = [],
  appliedJobIds = [],
  resumes = [],
  filters = {},
  selectedJobId = null,
}) {
  const { __, locale } = useTranslation();
  const { flash } = usePage().props;

  // Local state for search & filters
  const [keyword, setKeyword] = useState(filters.keyword || '');
  const [categoryId, setCategoryId] = useState(filters.category_id || '');
  const [cityId, setCityId] = useState(filters.city_id || '');
  const [workType, setWorkType] = useState(filters.work_type || '');

  // Modal states
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyResumeId, setApplyResumeId] = useState(resumes[0]?.id || '');
  const [applyCoverLetter, setApplyCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [savingJobId, setSavingJobId] = useState(null);

  // Flash notification banner
  const [showFlash, setShowFlash] = useState(false);
  useEffect(() => {
    if (flash?.success || flash?.error) {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  // Open modal if selectedJobId is in props or query params
  useEffect(() => {
    if (selectedJobId && jobs?.data) {
      const match = jobs.data.find((j) => String(j.id) === String(selectedJobId));
      if (match) {
        setSelectedJob(match);
      }
    }
  }, [selectedJobId, jobs]);

  // Handle Search & Filter Submission
  const handleSearch = (e) => {
    if (e) e.preventDefault();
    router.get(
      `/${locale}/job-seeker/jobs`,
      {
        keyword: keyword || undefined,
        category_id: categoryId || undefined,
        city_id: cityId || undefined,
        work_type: workType || undefined,
      },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleClearFilters = () => {
    setKeyword('');
    setCategoryId('');
    setCityId('');
    setWorkType('');
    router.get(`/${locale}/job-seeker/jobs`, {}, { preserveState: false, preserveScroll: true });
  };

  // Toggle Save Job
  const handleToggleSave = (jobId, e) => {
    if (e) e.stopPropagation();
    setSavingJobId(jobId);
    router.post(
      `/${locale}/job-seeker/saved-jobs/${jobId}/toggle`,
      {},
      {
        preserveScroll: true,
        onFinish: () => setSavingJobId(null),
      }
    );
  };

  // Handle Apply
  const handleApply = (e) => {
    e.preventDefault();
    if (!selectedJob) return;

    setApplying(true);
    router.post(
      `/${locale}/job-seeker/apply`,
      {
        job_post_id: selectedJob.id,
        resume_id: applyResumeId || null,
        cover_letter: applyCoverLetter || null,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setApplying(false);
          setSelectedJob(null);
          setApplyCoverLetter('');
        },
        onError: () => {
          setApplying(false);
        },
      }
    );
  };

  const hasActiveFilters = Boolean(keyword || categoryId || cityId || workType);

  const formatWorkType = (type) => {
    if (!type) return __('Full-time');
    if (type === 'remotely' || type === 'remote') return __('Remote');
    if (type === 'on_site') return __('On-site');
    if (type === 'hybrid') return __('Hybrid');
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };

  return (
    <DashboardLayout userRole="seeker">
      <Head title={__('Browse Jobs')} />

      {/* Floating Flash Message Toast */}
      {showFlash && (flash?.success || flash?.error) && (
        <div className="fixed top-20 right-6 rtl:right-auto rtl:left-6 z-50 max-w-md animate-fade-in shadow-xl rounded-2xl overflow-hidden border border-slate-200">
          <div
            className={`p-4 flex items-center justify-between gap-3 text-sm font-bold text-white ${
              flash.success ? 'bg-[#008A7B]' : 'bg-red-600'
            }`}
          >
            <div className="flex items-center gap-2" dir="auto">
              {flash.success ? <CheckCircle2 className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span dir="auto" className="leading-snug">
                {__(flash.success || flash.error)}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setShowFlash(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6 pb-12">
        {/* Page Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-80 h-full bg-gradient-to-l rtl:bg-gradient-to-r from-[#008A7B]/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F8F6] text-[#008A7B] font-extrabold text-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{__('Explore Opportunities')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {__('Find Your Next Career Move')}
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
              {__('Discover verified positions from top employers and apply directly with your profile.')}
            </p>
          </div>
        </div>

        {/* Search & Filters Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Keyword Search */}
            <div className="md:col-span-4 relative">
              <Search className="w-4 h-4 absolute top-3.5 left-3.5 rtl:left-auto rtl:right-3.5 text-slate-400" />
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder={__('Job title, skill, or keyword...')}
                className="w-full pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all"
              />
            </div>

            {/* Category Dropdown */}
            <div className="md:col-span-3">
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  router.get(
                    `/${locale}/job-seeker/jobs`,
                    {
                      keyword: keyword || undefined,
                      category_id: e.target.value || undefined,
                      city_id: cityId || undefined,
                      work_type: workType || undefined,
                    },
                    { preserveState: true, preserveScroll: true }
                  );
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all bg-white"
              >
                <option value="">{__('All Categories')}</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.jobs_count > 0 ? `(${cat.jobs_count})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* City Dropdown */}
            <div className="md:col-span-2">
              <select
                value={cityId}
                onChange={(e) => {
                  setCityId(e.target.value);
                  router.get(
                    `/${locale}/job-seeker/jobs`,
                    {
                      keyword: keyword || undefined,
                      category_id: categoryId || undefined,
                      city_id: e.target.value || undefined,
                      work_type: workType || undefined,
                    },
                    { preserveState: true, preserveScroll: true }
                  );
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all bg-white"
              >
                <option value="">{__('All Cities')}</option>
                {cities.map((city) => (
                  <option key={city.id} value={city.id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Work Type Dropdown */}
            <div className="md:col-span-2">
              <select
                value={workType}
                onChange={(e) => {
                  setWorkType(e.target.value);
                  router.get(
                    `/${locale}/job-seeker/jobs`,
                    {
                      keyword: keyword || undefined,
                      category_id: categoryId || undefined,
                      city_id: cityId || undefined,
                      work_type: e.target.value || undefined,
                    },
                    { preserveState: true, preserveScroll: true }
                  );
                }}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all bg-white"
              >
                <option value="">{__('Workplace')}</option>
                <option value="remotely">{__('Remote')}</option>
                <option value="on_site">{__('On-site')}</option>
                <option value="hybrid">{__('Hybrid')}</option>
              </select>
            </div>

            {/* Submit Button */}
            <div className="md:col-span-1 flex items-center gap-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-[#014D55] hover:bg-[#01383E] text-white rounded-xl font-bold text-sm flex items-center justify-center transition-colors cursor-pointer shadow-sm"
                title={__('Search')}
              >
                <Search className="w-4 h-4" />
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="p-2.5 border border-slate-200 hover:border-red-300 text-slate-500 hover:text-red-600 rounded-xl transition-colors cursor-pointer"
                  title={__('Clear Filters')}
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>

          {/* Quick Filter Info & Count */}
          <div className="flex items-center justify-between flex-wrap gap-2 mt-4 pt-3 border-t border-slate-100 text-xs font-bold text-slate-500">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#008A7B]" />
              <span>
                {jobs?.total ?? jobs?.data?.length ?? 0} {__('Available Jobs')}
              </span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="text-xs font-bold text-[#008A7B] hover:underline cursor-pointer"
              >
                {__('Reset all filters')}
              </button>
            )}
          </div>
        </div>

        {/* Job Cards Grid */}
        <div className="space-y-4">
          {jobs?.data?.length > 0 ? (
            jobs.data.map((job) => {
              const isSaved = savedJobIds.includes(job.id);
              const isApplied = appliedJobIds.includes(job.id);

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Job Details Left */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h2 className="text-lg font-black text-slate-900 group-hover:text-[#008A7B] transition-colors">
                          {job.title}
                        </h2>
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#008A7B] text-xs font-extrabold">
                          {formatWorkType(job.work_type)}
                        </span>
                        {job.job_type && (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
                            {formatWorkType(job.job_type)}
                          </span>
                        )}
                        {isApplied && (
                          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {__('Applied')}
                          </span>
                        )}
                      </div>

                      {/* Company & Location Details */}
                      <div className="flex items-center gap-4 flex-wrap text-xs font-semibold text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.company?.name || __('CareerX Partner')}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.city?.name || __('Global')}</span>
                        </div>
                        {job.salary_min && job.salary_max && (
                          <div className="flex items-center gap-1 text-[#008A7B] font-extrabold">
                            <DollarSign className="w-3.5 h-3.5" />
                            <span>
                              ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()} /mo
                            </span>
                          </div>
                        )}
                        {job.category && (
                          <span className="text-slate-400 font-medium">
                            • {job.category.name}
                          </span>
                        )}
                      </div>

                      {/* Brief description */}
                      {job.description && (
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {job.description}
                        </p>
                      )}

                      {/* Skills tags */}
                      {job.skills && job.skills.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {job.skills.slice(0, 5).map((skill) => (
                            <span
                              key={skill.id}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-semibold"
                            >
                              {skill.name}
                            </span>
                          ))}
                          {job.skills.length > 5 && (
                            <span className="text-[11px] font-bold text-slate-400">
                              +{job.skills.length - 5}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Actions Right */}
                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={(e) => handleToggleSave(job.id, e)}
                        disabled={savingJobId === job.id}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isSaved
                            ? 'bg-rose-50 border-rose-200 text-rose-600'
                            : 'border-slate-200 hover:border-slate-300 text-slate-400 hover:text-slate-700'
                        }`}
                        title={isSaved ? __('Remove from saved') : __('Save Job')}
                      >
                        {isSaved ? (
                          <BookmarkCheck className="w-4 h-4 fill-current" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedJob(job);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#014D55] hover:bg-[#01383E] text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                      >
                        <span>{__('View Details')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Briefcase className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {__('No jobs found')}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {__('Try clearing or adjusting your search filters to see more results.')}
                </p>
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="px-5 py-2.5 rounded-xl bg-[#008A7B] text-white text-xs font-bold hover:bg-[#007467] transition-all cursor-pointer"
                >
                  {__('Clear All Filters')}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Pagination */}
        {jobs?.links && jobs.links.length > 3 && (
          <div className="flex items-center justify-center gap-1.5 pt-4">
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
                      ? 'bg-[#014D55] text-white'
                      : !link.url
                      ? 'text-slate-300 pointer-events-none'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
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

      {/* Job Details & Apply Modal */}
      <ModalWrapper
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        title={selectedJob?.title || __('Job Details')}
        maxWidth="max-w-2xl"
      >
        {selectedJob && (
          <div className="space-y-6">
            {/* Header badges */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#008A7B]" />
                  <span className="font-bold text-slate-800 text-sm">
                    {selectedJob.company?.name || __('CareerX Partner')}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-500 mt-1">
                  <span>{selectedJob.city?.name || __('Global')}</span>
                  <span>•</span>
                  <span>{formatWorkType(selectedJob.work_type)}</span>
                  <span>•</span>
                  <span>{formatWorkType(selectedJob.job_type)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => handleToggleSave(selectedJob.id, e)}
                disabled={savingJobId === selectedJob.id}
                className={`p-2 rounded-xl border transition-all cursor-pointer ${
                  savedJobIds.includes(selectedJob.id)
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                {savedJobIds.includes(selectedJob.id) ? (
                  <BookmarkCheck className="w-4 h-4 fill-current" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <p className="text-slate-400 font-semibold">{__('Salary')}</p>
                <p className="text-slate-800 font-bold mt-0.5">
                  {selectedJob.salary_min && selectedJob.salary_max
                    ? `$${Number(selectedJob.salary_min).toLocaleString()} - $${Number(selectedJob.salary_max).toLocaleString()}`
                    : __('Negotiable')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold">{__('Experience')}</p>
                <p className="text-slate-800 font-bold mt-0.5">
                  {selectedJob.experience_years} {__('Years')}
                </p>
              </div>
              <div>
                <p className="text-slate-400 font-semibold">{__('Views')}</p>
                <p className="text-slate-800 font-bold mt-0.5">
                  {selectedJob.views_count ?? 0}
                </p>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                {__('Job Description')}
              </h4>
              <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedJob.description}
              </p>
            </div>

            {/* Responsibilities */}
            {selectedJob.responsibilities && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  {__('Responsibilities')}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedJob.responsibilities}
                </p>
              </div>
            )}

            {/* Requirements */}
            {selectedJob.requirements && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  {__('Requirements')}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedJob.requirements}
                </p>
              </div>
            )}

            {/* Skills */}
            {selectedJob.skills && selectedJob.skills.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  {__('Required Skills')}
                </h4>
                <div className="flex items-center gap-2 flex-wrap">
                  {selectedJob.skills.map((s) => (
                    <span
                      key={s.id}
                      className="px-3 py-1 rounded-full bg-[#E6F8F6] text-[#008A7B] text-xs font-bold"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Section */}
            <div className="pt-4 border-t border-slate-100">
              {appliedJobIds.includes(selectedJob.id) ? (
                <div className="p-4 bg-emerald-50 text-[#008A7B] rounded-2xl flex items-center gap-3 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>{__('You have already applied for this job position.')}</span>
                </div>
              ) : (
                <form onSubmit={handleApply} className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Send className="w-4 h-4 text-[#008A7B]" />
                    <span>{__('Apply for this position')}</span>
                  </h4>

                  {/* Select Resume */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      {__('Select Resume / CV')}
                    </label>
                    {resumes.length > 0 ? (
                      <select
                        value={applyResumeId}
                        onChange={(e) => setApplyResumeId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all bg-white"
                      >
                        {resumes.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.title || __('Resume')} {r.is_primary ? `(${__('Primary')})` : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-xs text-amber-600 bg-amber-50 p-3 rounded-xl flex items-center justify-between">
                        <span>{__('You do not have any uploaded resumes yet.')}</span>
                        <Link
                          href={`/${locale}/seeker/profile?modal=resumes`}
                          className="font-bold underline text-[#008A7B]"
                        >
                          {__('Upload CV')}
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Cover Letter */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 block">
                      {__('Cover Letter (Optional)')}
                    </label>
                    <textarea
                      rows={3}
                      value={applyCoverLetter}
                      onChange={(e) => setApplyCoverLetter(e.target.value)}
                      placeholder={__('Write a short note explaining why you are a great fit...')}
                      className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
                    >
                      {__('Cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={applying}
                      className="px-6 py-2.5 rounded-xl bg-[#008A7B] hover:bg-[#007467] text-white font-extrabold text-xs transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{applying ? __('Submitting...') : __('Submit Application')}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </ModalWrapper>
    </DashboardLayout>
  );
}

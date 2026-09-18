import React, { useState, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ModalWrapper from '@/Components/Dashboard/Seeker/Profile/Modals/ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import {
  Bookmark,
  BookmarkX,
  Building2,
  MapPin,
  DollarSign,
  Briefcase,
  Send,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  ExternalLink,
  Sparkles,
  Calendar,
} from 'lucide-react';

export default function SavedJobs({ savedJobs = [], resumes = [], appliedJobIds = [] }) {
  const { __, locale } = useTranslation();
  const { flash } = usePage().props;

  const [selectedJob, setSelectedJob] = useState(null);
  const [applyResumeId, setApplyResumeId] = useState(resumes[0]?.id || '');
  const [applyCoverLetter, setApplyCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [removingId, setRemovingId] = useState(null);

  // Flash notification toast
  const [showFlash, setShowFlash] = useState(false);
  useEffect(() => {
    if (flash?.success || flash?.error) {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  // Remove from saved
  const handleRemove = (jobId, e) => {
    if (e) e.stopPropagation();
    setRemovingId(jobId);
    router.post(
      `/${locale}/job-seeker/saved-jobs/${jobId}/toggle`,
      {},
      {
        preserveScroll: true,
        onFinish: () => setRemovingId(null),
      }
    );
  };

  // Handle direct apply
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

  const formatWorkType = (type) => {
    if (!type) return __('Full-time');
    if (type === 'remotely' || type === 'remote') return __('Remote');
    if (type === 'on_site') return __('On-site');
    if (type === 'hybrid') return __('Hybrid');
    return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
  };

  return (
    <DashboardLayout userRole="seeker">
      <Head title={__('Saved Jobs')} />

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
        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 rtl:right-auto rtl:left-0 w-80 h-full bg-gradient-to-l rtl:bg-gradient-to-r from-[#008A7B]/10 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E6F8F6] text-[#008A7B] font-extrabold text-xs mb-3">
              <Bookmark className="w-3.5 h-3.5 fill-current" />
              <span>{__('Saved Positions')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {__('Your Bookmarked Jobs')}
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
              {__('Quickly review and apply to the opportunities you have shortlisted.')}
            </p>
          </div>
        </div>

        {/* Count Bar */}
        <div className="flex items-center justify-between px-2 text-xs font-bold text-slate-500">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[#008A7B]" />
            <span>
              {savedJobs.length} {__('Saved Jobs')}
            </span>
          </div>
          <Link
            href={`/${locale}/job-seeker/jobs`}
            className="text-xs font-bold text-[#008A7B] hover:underline"
          >
            +{__('Browse More Jobs')}
          </Link>
        </div>

        {/* Saved Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedJobs.length > 0 ? (
            savedJobs.map((saved) => {
              const job = saved.job_post || saved.jobPost || saved.job;
              if (!job) return null;

              return (
                <div
                  key={saved.id}
                  className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-2.5">
                    {/* Header: Title & Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#008A7B] text-[11px] font-extrabold inline-block">
                          {formatWorkType(job.work_type)}
                        </span>
                        <h2 className="text-base font-black text-slate-900 group-hover:text-[#008A7B] transition-colors line-clamp-1">
                          {job.title}
                        </h2>
                      </div>

                      {/* Remove from saved */}
                      <button
                        type="button"
                        onClick={(e) => handleRemove(job.id, e)}
                        disabled={removingId === job.id}
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title={__('Remove from saved')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Company and Location */}
                    <div className="flex items-center gap-3 flex-wrap text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.company?.name || __('CareerX Partner')}</span>
                      </div>
                      {job.city && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{job.city.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Salary */}
                    {job.salary_min && job.salary_max && (
                      <div className="text-xs font-extrabold text-[#008A7B] flex items-center gap-1">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>
                          ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()} /mo
                        </span>
                      </div>
                    )}

                    {/* Snippet */}
                    {job.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {job.description}
                      </p>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                    {appliedJobIds.includes(job.id) ? (
                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="flex-1 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-[#008A7B] border border-emerald-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#008A7B]" />
                        <span>{__('Already Applied')}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedJob(job)}
                        className="flex-1 py-2.5 rounded-xl bg-[#014D55] hover:bg-[#01383E] text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{__('Apply Now')}</span>
                      </button>
                    )}

                    <Link
                      href={`/${locale}/job-seeker/jobs?job_id=${job.id}`}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                      title={__('View Details')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {__('No saved jobs yet')}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {__('Save interesting positions while browsing to apply or review them later.')}
                </p>
              </div>
              <Link
                href={`/${locale}/job-seeker/jobs`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008A7B] text-white text-xs font-bold hover:bg-[#007467] transition-all cursor-pointer shadow-sm"
              >
                <Briefcase className="w-4 h-4" />
                <span>{__('Explore Jobs')}</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Quick Apply Modal */}
      <ModalWrapper
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        title={selectedJob ? (appliedJobIds.includes(selectedJob.id) ? selectedJob.title : `${__('Apply for')}: ${selectedJob.title}`) : ''}
        maxWidth="max-w-xl"
      >
        {selectedJob && (
          appliedJobIds.includes(selectedJob.id) ? (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900">{selectedJob.title}</h4>
                <p className="text-xs text-slate-600 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#008A7B]" />
                  <span>{selectedJob.company?.name || __('CareerX Partner')}</span>
                </p>
              </div>

              <div className="p-4 bg-emerald-50 text-[#008A7B] border border-emerald-200 rounded-2xl flex items-center gap-3 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{__('You have already applied for this job position.')}</span>
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  {__('Close')}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                <h4 className="font-extrabold text-sm text-slate-900">{selectedJob.title}</h4>
                <p className="text-xs text-slate-600 flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-[#008A7B]" />
                  <span>{selectedJob.company?.name || __('CareerX Partner')}</span>
                </p>
              </div>

              {/* Resume Selection */}
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

              {/* Actions */}
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
          )
        )}
      </ModalWrapper>
    </DashboardLayout>
  );
}

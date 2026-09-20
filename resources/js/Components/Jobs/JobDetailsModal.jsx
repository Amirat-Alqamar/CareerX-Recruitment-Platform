import React, { useState, useEffect } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import ModalWrapper from '@/Components/Dashboard/Seeker/Profile/Modals/ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import {
  Building2,
  MapPin,
  Briefcase,
  DollarSign,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  Send,
  Lock,
  User,
  ExternalLink,
  FileText,
  AlertCircle
} from 'lucide-react';

export default function JobDetailsModal({
  isOpen,
  onClose,
  job,
  savedJobIds = [],
  appliedJobIds = [],
  resumes = [],
  onToggleSaveSuccess,
}) {
  const { __, locale } = useTranslation();
  const { auth } = usePage().props;

  const [applyResumeId, setApplyResumeId] = useState('');
  const [applyCoverLetter, setApplyCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [savingJobId, setSavingJobId] = useState(null);

  useEffect(() => {
    if (resumes && resumes.length > 0) {
      const primary = resumes.find((r) => r.is_primary) || resumes[0];
      setApplyResumeId(primary.id);
    }
  }, [resumes]);

  if (!job) return null;

  const isJobSeeker = auth?.user?.role === 'job_seeker';
  const isEmployer = auth?.user?.role === 'employer';
  const isAdmin = auth?.user?.role === 'admin';
  const isAuthenticated = Boolean(auth?.user);

  const isSaved = savedJobIds.includes(job.id);
  const isApplied = appliedJobIds.includes(job.id);

  const formatWorkType = (type) => {
    if (!type) return __('Full-time');
    if (type === 'remotely' || type === 'remote') return __('Remote');
    if (type === 'on_site') return __('On-site');
    if (type === 'hybrid') return __('Hybrid');
    return __(type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '));
  };

  const formatJobType = (type) => {
    if (!type) return __('Full-time');
    if (type === 'full_time') return __('Full-time');
    if (type === 'part_time') return __('Part-time');
    if (type === 'contract') return __('Contract');
    if (type === 'internship') return __('Internship');
    if (type === 'freelance') return __('Freelance');
    return __(type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' '));
  };

  const formatSalary = () => {
    if (job.salary_min && job.salary_max) {
      return `$${Number(job.salary_min).toLocaleString()} – $${Number(job.salary_max).toLocaleString()}`;
    }
    if (job.salary) return job.salary;
    if (job.salary_min) return `$${Number(job.salary_min).toLocaleString()}+`;
    return __('Negotiable');
  };

  const handleToggleSave = (e) => {
    if (e) e.stopPropagation();
    if (!isAuthenticated) {
      router.visit(`/${locale}/login`);
      return;
    }

    if (!isJobSeeker) {
      return;
    }

    setSavingJobId(job.id);
    router.post(
      `/${locale}/job-seeker/saved-jobs/${job.id}/toggle`,
      {},
      {
        preserveScroll: true,
        onFinish: () => {
          setSavingJobId(null);
          if (onToggleSaveSuccess) onToggleSaveSuccess(job.id);
        },
      }
    );
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.visit(`/${locale}/login`);
      return;
    }

    setApplying(true);
    router.post(
      `/${locale}/job-seeker/apply`,
      {
        job_post_id: job.id,
        resume_id: applyResumeId || null,
        cover_letter: applyCoverLetter || null,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setApplying(false);
          onClose();
          setApplyCoverLetter('');
        },
        onError: () => {
          setApplying(false);
        },
      }
    );
  };

  const companyName = job.company?.name || job.company || __('CareerX Partner');
  const companyInitials = companyName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={job.title || __('Job Details')}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={companyName}
                className="w-12 h-12 rounded-2xl object-cover border border-slate-100"
              />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-teal-800 text-white font-black flex items-center justify-center text-sm shadow-sm">
                {companyInitials}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary" />
                <span className="font-extrabold text-slate-900 text-sm sm:text-base">
                  {companyName}
                </span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-500 mt-1 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.city?.name || job.location || __('Global')}
                </span>
                <span>•</span>
                <span className="text-primary font-bold">
                  {formatWorkType(job.work_type)}
                </span>
                <span>•</span>
                <span>{formatJobType(job.job_type)}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            disabled={savingJobId === job.id}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
              isSaved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-800'
            }`}
            title={isSaved ? __('Remove from saved') : __('Save Job')}
          >
            {isSaved ? (
              <BookmarkCheck className="w-4 h-4 fill-current" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50/80 p-4 rounded-2xl border border-slate-100 text-xs">
          <div>
            <p className="text-slate-400 font-semibold">{__('Salary')}</p>
            <p className="text-slate-900 font-black mt-0.5 text-sm">
              {formatSalary()}
            </p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold">{__('Experience')}</p>
            <p className="text-slate-900 font-black mt-0.5 text-sm">
              {job.experience_years ? `${job.experience_years} ${__('Years')}` : (job.experience || __('Not specified'))}
            </p>
          </div>
          <div>
            <p className="text-slate-400 font-semibold">{__('Views')}</p>
            <p className="text-slate-900 font-black mt-0.5 text-sm">
              {job.views_count ?? 0}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
            {__('Job Description')}
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {job.description || __('No description provided.')}
          </p>
        </div>

        {job.responsibilities && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {__('Responsibilities')}
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {job.responsibilities}
            </p>
          </div>
        )}

        {job.requirements && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {__('Requirements')}
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
              {job.requirements}
            </p>
          </div>
        )}

        {job.skills && job.skills.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {__('Required Skills')}
            </h4>
            <div className="flex items-center gap-2 flex-wrap">
              {job.skills.map((skill, idx) => {
                const name = typeof skill === 'string' ? skill : skill.name;
                const id = typeof skill === 'object' ? skill.id : idx;
                return (
                  <span
                    key={id}
                    className="px-3 py-1 rounded-lg bg-teal-50 text-teal-800 text-xs font-bold border border-teal-100/60"
                  >
                    {name}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100">
          {!isAuthenticated ? (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/70 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center mx-auto">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">
                  {__('Please log in to apply for this job.')}
                </h5>
                <p className="text-xs text-slate-500 mt-0.5">
                  {__('Join CareerX or log in to submit your resume and connect with top employers.')}
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-1">
                <Link
                  href={`/${locale}/login`}
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-bold transition-all shadow-sm"
                >
                  {__('Sign In to Apply')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
                >
                  {__('Create Free Account')}
                </Link>
              </div>
            </div>
          ) : isApplied ? (
            <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl flex items-center gap-3 font-bold text-sm border border-emerald-100">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{__('You have already applied for this job position.')}</span>
            </div>
          ) : isJobSeeker ? (
            <form onSubmit={handleApply} className="space-y-4">
              <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Send className="w-4 h-4 text-primary" />
                <span>{__('Apply for this position')}</span>
              </h4>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {__('Select Resume / CV')}
                </label>
                {resumes.length > 0 ? (
                  <select
                    value={applyResumeId}
                    onChange={(e) => setApplyResumeId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                  >
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.title || __('Resume')} {r.is_primary ? `(${__('Primary')})` : ''}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="text-xs text-amber-700 bg-amber-50 p-3.5 rounded-xl flex items-center justify-between border border-amber-200/60">
                    <span>{__('You do not have any uploaded resumes yet.')}</span>
                    <Link
                      href={`/${locale}/seeker/profile?modal=resumes`}
                      className="font-bold underline text-primary"
                    >
                      {__('Upload CV')}
                    </Link>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">
                  {__('Cover Letter (Optional)')}
                </label>
                <textarea
                  rows={3}
                  value={applyCoverLetter}
                  onChange={(e) => setApplyCoverLetter(e.target.value)}
                  placeholder={__('Write a short note explaining why you are a great fit...')}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs transition-colors cursor-pointer"
                >
                  {__('Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-xs transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{applying ? __('Submitting...') : __('Submit Application')}</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-slate-50 text-slate-600 rounded-2xl flex items-center gap-3 font-semibold text-xs border border-slate-200">
              <AlertCircle className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{__('Employers and Admins cannot apply for jobs.')}</span>
            </div>
          )}
        </div>
      </div>
    </ModalWrapper>
  );
}

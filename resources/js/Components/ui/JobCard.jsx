import React, { useState } from 'react';
import { MapPin, Bookmark, BookmarkCheck, CheckCircle2, Eye } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { router, usePage } from '@inertiajs/react';

// Background colors palette for company avatars
const AVATAR_BG_COLORS = [
  'bg-teal-900',
  'bg-purple-600',
  'bg-emerald-600',
  'bg-rose-600',
  'bg-sky-600',
  'bg-amber-600',
  'bg-indigo-600',
  'bg-[#014D55]',
];

export default function JobCard({
  job,
  savedJobIds = [],
  appliedJobIds = [],
  onViewDetails,
}) {
  const { __, locale } = useTranslation();
  const { auth } = usePage().props;

  const isSavedProp = savedJobIds.includes(job.id);
  const isApplied = appliedJobIds.includes(job.id);
  const [isSaved, setIsSaved] = useState(isSavedProp);
  const [isSaving, setIsSaving] = useState(false);

  // Sync state if prop changes
  React.useEffect(() => {
    setIsSaved(savedJobIds.includes(job.id));
  }, [savedJobIds, job.id]);

  // Handle Save Bookmark
  const handleToggleSave = (e) => {
    e.stopPropagation();
    if (!auth?.user) {
      router.visit(`/${locale}/login`);
      return;
    }

    if (auth?.user?.role !== 'job_seeker') {
      return;
    }

    setIsSaving(true);
    setIsSaved(!isSaved);
    router.post(
      `/${locale}/job-seeker/saved-jobs/${job.id}/toggle`,
      {},
      {
        preserveScroll: true,
        onFinish: () => setIsSaving(false),
      }
    );
  };

  // Extract Company Name
  const companyName = job.company?.name || (typeof job.company === 'string' ? job.company : __('CareerX Partner'));

  // Company Initials & BG
  const companyInitials = job.logoText || companyName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const colorIndex = Math.abs((job.id || 0) + companyName.length) % AVATAR_BG_COLORS.length;
  const avatarBg = job.logoBg || AVATAR_BG_COLORS[colorIndex];

  // Location string
  const locationText = job.city?.name || job.location || __('Global');

  // Job Type
  const formatJobType = (type) => {
    if (!type) return __('Full-time');
    if (type === 'full_time' || type === 'Full-time') return __('Full-time');
    if (type === 'part_time' || type === 'Part-time') return __('Part-time');
    if (type === 'contract' || type === 'Contract') return __('Contract');
    if (type === 'internship' || type === 'Internship') return __('Internship');
    if (type === 'freelance' || type === 'Freelance') return __('Freelance');
    return __(type);
  };

  const jobType = formatJobType(job.job_type || job.type);

  // Remote check
  const isRemote = job.work_type === 'remote' || job.work_type === 'remotely' || Boolean(job.isRemote);

  // Skills list
  const skillsList = Array.isArray(job.skills)
    ? job.skills.map((s) => (typeof s === 'string' ? s : s.name))
    : [];

  // Salary string
  const salaryText = (() => {
    if (job.salary_min && job.salary_max) {
      return `$${Number(job.salary_min).toLocaleString()} – $${Number(job.salary_max).toLocaleString()}`;
    }
    if (job.salary) return job.salary;
    if (job.salary_min) return `$${Number(job.salary_min).toLocaleString()}+`;
    return __('Negotiable');
  })();

  // Experience text
  const experienceText = job.experience_years
    ? `${job.experience_years} ${__('Years')}`
    : (job.experience ? __(job.experience) : __('Not specified'));

  // Posted At
  const postedAtText = job.postedAt || (job.created_at ? new Date(job.created_at).toLocaleDateString() : '');

  return (
    <div
      onClick={() => onViewDetails && onViewDetails(job)}
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between h-full group cursor-pointer hover:border-teal-600/30"
    >
      <div className="space-y-4">
        {/* Header: Logo, Title, Bookmark */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {job.company?.logo ? (
              <img
                src={job.company.logo}
                alt={companyName}
                className="w-11 h-11 rounded-xl object-cover shrink-0 border border-gray-100"
              />
            ) : (
              <div
                className={`w-11 h-11 rounded-xl ${avatarBg} text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-sm`}
              >
                {companyInitials}
              </div>
            )}
            <div>
              <h3
                onClick={(e) => {
                  e.stopPropagation();
                  if (onViewDetails) onViewDetails(job);
                }}
                className="font-bold text-gray-900 text-base leading-snug group-hover:text-primary transition-colors cursor-pointer"
              >
                {__(job.title)}
              </h3>
              <p className="text-xs text-gray-500 font-medium">{companyName}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleToggleSave}
            disabled={isSaving}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer shrink-0 ${
              isSaved
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-transparent text-gray-400 hover:text-primary hover:bg-gray-50'
            }`}
            title={isSaved ? __('Job Saved') : __('Save Job')}
          >
            {isSaved ? (
              <BookmarkCheck className="w-5 h-5 fill-current" />
            ) : (
              <Bookmark className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Location & Badges */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-medium">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            {locationText}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-teal-50 text-teal-800 text-xs font-medium">
            {jobType}
          </span>
          {isRemote && (
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium">
              {__('Remote')}
            </span>
          )}
          {isApplied && (
            <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-xs font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {__('Applied')}
            </span>
          )}
        </div>

        {/* Skills Tags */}
        {skillsList.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            {skillsList.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 text-xs font-medium border border-gray-100"
              >
                {skill}
              </span>
            ))}
            {skillsList.length > 4 && (
              <span className="px-2 py-1 rounded-lg bg-gray-50 text-gray-400 text-xs font-semibold">
                +{skillsList.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Salary, Details & Apply */}
      <div className="pt-6 mt-4 border-t border-gray-50 flex items-center justify-between gap-2">
        <div>
          <p className="text-base font-bold text-gray-900">{salaryText}</p>
          <p className="text-[11px] text-gray-400 font-medium">
            {experienceText} {postedAtText && `• ${postedAtText}`}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDetails) onViewDetails(job);
            }}
            className="px-3 py-2 border border-gray-200 hover:border-gray-300 text-gray-700 hover:text-gray-900 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            {__('Details')}
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onViewDetails) onViewDetails(job);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors shadow-sm cursor-pointer ${
              isApplied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                : 'bg-primary hover:bg-primary-hover text-white'
            }`}
          >
            {isApplied ? __('Already Applied') : __('Apply Now')}
          </button>
        </div>
      </div>
    </div>
  );
}

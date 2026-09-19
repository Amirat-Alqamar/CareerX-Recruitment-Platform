import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight, Briefcase } from 'lucide-react';
import JobCard from '../ui/JobCard';
import JobDetailsModal from '@/Components/Jobs/JobDetailsModal';
import { featuredJobs as staticFeaturedJobs } from '@/Data/jobs';
import { useTranslation } from '@/hooks/useTranslation';

export default function FeaturedJobsSection({
  jobs = [],
  totalJobsCount,
  savedJobIds = [],
  appliedJobIds = [],
  resumes = [],
}) {
  const { __, locale } = useTranslation();
  const [selectedJob, setSelectedJob] = useState(null);

  // If dynamic jobs are passed and non-empty, use them (limit to max 6 latest). Otherwise fallback to static data.
  const displayJobs = (jobs && jobs.length > 0 ? jobs : staticFeaturedJobs).slice(0, 6);

  const jobsRoute = `/${locale}/jobs`;

  return (
    <section id="jobs" className="py-16 bg-gray-50/50 scroll-mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-accent">
              {__('LATEST OPPORTUNITIES')}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
              {__('Featured Job Listings')}
            </h2>
          </div>
          <Link
            href={jobsRoute}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>{__('View all jobs')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        {/* Cards Grid */}
        {displayJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayJobs.map((job) => (
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
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100 max-w-md mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-teal-50 text-primary flex items-center justify-center mx-auto">
              <Briefcase className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-700">
              {__('No jobs found')}
            </p>
          </div>
        )}

        {/* Bottom Button */}
        <div className="mt-12 text-center">
          <Link
            href={jobsRoute}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm group"
          >
            <span>
              {totalJobsCount && totalJobsCount > 0
                ? `${__('Browse All Jobs')} (${totalJobsCount})`
                : __('Browse All Jobs')}
            </span>
            <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-primary transition-colors rtl:rotate-180" />
          </Link>
        </div>

      </div>

      {/* Job Details Modal */}
      <JobDetailsModal
        isOpen={Boolean(selectedJob)}
        onClose={() => setSelectedJob(null)}
        job={selectedJob}
        savedJobIds={savedJobIds}
        appliedJobIds={appliedJobIds}
        resumes={resumes}
      />
    </section>
  );
}

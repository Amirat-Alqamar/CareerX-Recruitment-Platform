import React from 'react';
import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import JobCard from '../ui/JobCard';
import { featuredJobs } from '@/Data/jobs';
import { useTranslation } from '@/hooks/useTranslation';

export default function FeaturedJobsSection() {
  const { __ } = useTranslation();

  return (
    <section className="py-16 bg-gray-50/50">
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
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>{__('View all jobs')}</span>
            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {/* Bottom Button */}
        <div className="mt-12 text-center">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-800 text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
          >
            <span>{__('Browse All 52,000+ Jobs')}</span>
            <ArrowRight className="w-4 h-4 text-gray-500 rtl:rotate-180" />
          </Link>
        </div>

      </div>
    </section>
  );
}

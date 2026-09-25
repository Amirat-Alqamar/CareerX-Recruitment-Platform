import React from 'react';
import { Head, Link } from '@inertiajs/react';
import {
  Briefcase,
  Users,
  Clock,
  CheckCircle2,
  PlusCircle,
  Building2,
  ExternalLink,
  ChevronRight,
  ArrowRight,
  UserCheck,
  TrendingUp,
  Star,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function EmployerDashboard({
  company,
  stats = { totalJobs: 0, activeJobs: 0, totalApplicants: 0, pendingApplicants: 0, shortlistedApplicants: 0, acceptedApplicants: 0, hiredApplicants: 0, hiringRate: 0 },
  mostAppliedJob = null,
  recentJobs = [],
  recentApplicants = [],
}) {
  const { __, locale, isRtl } = useTranslation();

  const statCards = [
    {
      title: __('Active Jobs'),
      value: stats.activeJobs,
      subtitle: `${stats.totalJobs} ${__('Total Posts')}`,
      icon: Briefcase,
      color: 'text-[#008A7B]',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      title: __('Total Applicants'),
      value: stats.totalApplicants,
      subtitle: `${stats.shortlistedApplicants ?? 0} ${__('Shortlisted')}`,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-100',
    },
    {
      title: __('Pending Review'),
      value: stats.pendingApplicants,
      subtitle: __('Awaiting action'),
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
    {
      title: __('Hiring Rate'),
      value: `${stats.hiringRate ?? 0}%`,
      subtitle: `${stats.hiredApplicants ?? 0} ${__('Hired candidates')}`,
      icon: TrendingUp,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-100',
    },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'hired':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      case 'shortlisted':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'accepted':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'reviewed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-amber-50 text-amber-700 border-amber-200';
    }
  };

  return (
    <DashboardLayout userRole="employer">
      <Head title={__('Dashboard')} />

      <div className="space-y-8">
        <div className="bg-gradient-to-r from-[#014D55] to-[#008A7B] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              {company?.logo ? (
                <img
                  src={company.logo}
                  alt={company.name}
                  className="w-12 h-12 rounded-2xl bg-white object-contain p-1 border border-white/20 shadow-sm"
                />
              ) : (
                <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center font-black text-xl text-white">
                  {company?.name ? company.name.charAt(0).toUpperCase() : 'C'}
                </div>
              )}
              <div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {__('Welcome')}, {company?.name || __('Company')}! 
                </h1>
                <p className="text-emerald-100/90 text-sm font-medium">
                  {__('Manage your job openings and review candidate applications with ease.')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={`/${locale}/employer/jobs/create`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-white text-[#014D55] hover:bg-emerald-50 shadow-md hover:shadow-lg transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4 text-[#008A7B]" />
              <span>{__('Post a Job')}</span>
            </a>
            <a
              href={`/${locale}/employer/company`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-colors"
            >
              <Building2 className="w-4 h-4" />
              <span>{__('Company Profile')}</span>
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.border} border`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <div className="text-3xl font-black text-slate-800 tracking-tight mb-1">
                  {stat.value}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {stat.subtitle}
                </p>
              </div>
            );
          })}
        </div>

        {mostAppliedJob && (
          <div className="bg-gradient-to-r from-teal-500/10 via-emerald-500/5 to-teal-500/10 border border-teal-200/70 rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-teal-100 text-[#014D55] text-[11px] font-black mb-1.5">
                <span>{__('Most Popular Job Opening')}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900">
                {mostAppliedJob.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {mostAppliedJob.job_type} • {mostAppliedJob.work_type}
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-center sm:text-end">
                <span className="text-3xl font-black text-slate-900 block leading-tight">
                  {mostAppliedJob.applications_count}
                </span>
                <span className="text-xs text-slate-500 font-bold">
                  {__('Total Applicants')}
                </span>
              </div>
              <Link
                href={`/${locale}/employer/applicants?job_id=${mostAppliedJob.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#008A7B] text-white hover:bg-[#014D55] shadow-sm transition-all cursor-pointer"
              >
                <span>{__('View Candidates')}</span>
                {isRtl ? <ArrowRight className="w-4 h-4 rotate-180" /> : <ArrowRight className="w-4 h-4" />}
              </Link>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {__('Recent Job Postings')}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {__('Latest jobs created by your company')}
                </p>
              </div>
              <a
                href={`/${locale}/employer/jobs`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#008A7B] hover:text-[#014D55] transition-colors"
              >
                <span>{__('View All')}</span>
                {isRtl ? <ArrowRight className="w-3.5 h-3.5 rotate-180" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </a>
            </div>

            {recentJobs.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentJobs.map((job) => (
                  <div
                    key={job.id}
                    className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#008A7B] transition-colors">
                          {job.title}
                        </h4>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${
                            job.status === 'published' || job.status === 'active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : job.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : job.status === 'draft'
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                          }`}
                        >
                          {job.status === 'published' || job.status === 'active'
                            ? __('Published')
                            : job.status === 'pending'
                            ? __('Pending')
                            : job.status === 'draft'
                            ? __('Draft')
                            : __('Closed')}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span>{job.job_type}</span>
                        <span>•</span>
                        <span>{job.work_type}</span>
                        <span>•</span>
                        <span>{job.created_at}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        <span>{job.applications_count}</span>
                        <span className="text-slate-400 font-normal">{__('applicants')}</span>
                      </div>

                      <a
                        href={`/${locale}/employer/jobs/${job.id}/edit`}
                        className="px-3 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        {__('Edit')}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">{__('No job postings yet')}</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  {__('Post your first job opening to start receiving applications from qualified candidates.')}
                </p>
                <div className="pt-2">
                  <a
                    href={`/${locale}/employer/jobs/create`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#008A7B] hover:bg-[#007366] transition-colors shadow-sm"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>{__('Post a Job')}</span>
                  </a>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {__('Recent Applicants')}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {__('Candidates who applied recently')}
                </p>
              </div>
              <a
                href={`/${locale}/employer/applicants`}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#008A7B] hover:text-[#014D55] transition-colors"
              >
                <span>{__('View All')}</span>
                {isRtl ? <ArrowRight className="w-3.5 h-3.5 rotate-180" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </a>
            </div>

            {recentApplicants.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentApplicants.map((app) => (
                  <div
                    key={app.id}
                    className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {app.applicant_name ? app.applicant_name.charAt(0).toUpperCase() : 'A'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 truncate">
                            {app.applicant_name}
                          </h4>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">
                          {app.job_title}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          app.status
                        )}`}
                      >
                        {__(app.status.charAt(0).toUpperCase() + app.status.slice(1))}
                      </span>

                      <a
                        href={`/${locale}/employer/applicants/${app.id}`}
                        className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                        title={__('Review Application')}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-700">{__('No applicants yet')}</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  {__('When job seekers apply to your openings, their applications will appear here.')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

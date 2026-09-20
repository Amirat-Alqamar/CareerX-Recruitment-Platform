import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  Check,
  XCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function PendingJobs({ pendingJobs = [], count = 0 }) {
  const { __, locale } = useTranslation();
  const { flash } = usePage().props;

  const handleApprove = (jobId) => {
    router.post(
      `/${locale}/admin/pending-jobs/${jobId}/approve`,
      {},
      { preserveScroll: true }
    );
  };

  const handleReject = (jobId) => {
    router.post(
      `/${locale}/admin/pending-jobs/${jobId}/reject`,
      {},
      { preserveScroll: true }
    );
  };

  return (
    <DashboardLayout userRole="admin">
      <Head title={__('Pending Job Approvals') + ' - CareerX'} />

      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{flash.error}</span>
          </div>
        )}

        <div className="bg-gradient-to-r rtl:bg-gradient-to-l from-[#03444B] via-[#026E78] to-[#009B99] text-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-teal-950/10 border border-teal-500/20 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-80 h-80 rounded-full bg-[#00B7B5]/25 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_65%)] pointer-events-none" />
          <div className="space-y-2.5 max-w-xl relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-teal-100 text-xs font-bold tracking-wide shadow-xs">
              <Clock className="w-3.5 h-3.5 text-teal-200" />
              <span>{__('Moderation & Quality Assurance')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-xs">
              {__('Job Posts Awaiting Approval')}
            </h1>
            <p className="text-teal-50/90 text-xs sm:text-sm font-medium leading-relaxed">
              {__('Review employer job details before approving publication to ensure platform standards and job seeker safety.')}
            </p>
          </div>

          <div className="p-4.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-center shrink-0 min-w-[130px] relative z-10 shadow-sm">
            <span className="text-xs font-semibold text-teal-100/90 block mb-0.5">{__('Queue Count')}</span>
            <span className="text-3xl font-black text-white">{count}</span>
          </div>
        </div>

        {pendingJobs.length > 0 ? (
          <div className="space-y-4">
            {pendingJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sm:p-7 space-y-5 hover:border-teal-300/60 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex items-start gap-4">
                    {job.company_logo ? (
                      <img
                        src={job.company_logo}
                        alt={job.company_name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-[#014D55] text-white text-base font-black flex items-center justify-center shrink-0 shadow-xs">
                        {job.company_name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-black text-slate-900">{job.title}</h2>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                          {__('Pending Review')}
                        </span>
                        {job.is_updated && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200">
                            {__('Edited / Updated')}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium">
                        <strong>{job.company_name}</strong> · {job.creator_name} ({job.creator_email}) · {job.is_updated ? `${__('Updated')}: ` : ''}{job.time_ago}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleApprove(job.id)}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{__('Approve & Publish')}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleReject(job.id)}
                      className="px-4 py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>{__('Reject')}</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                    📂 {job.category}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                    💼 {job.job_type}
                  </span>
                  <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                    🌐 {job.work_type}
                  </span>
                  {job.location && (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                      📍 {job.location}
                    </span>
                  )}
                  {job.salary_min && (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-100">
                      💰 {job.salary_min} - {job.salary_max} ({job.salary_type})
                    </span>
                  )}
                </div>

                <div className="space-y-3 text-xs text-slate-700">
                  <div>
                    <h4 className="font-black text-slate-900 mb-1">{__('Description')}</h4>
                    <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line leading-relaxed">
                      {job.description}
                    </p>
                  </div>

                  {job.requirements && (
                    <div>
                      <h4 className="font-black text-slate-900 mb-1">{__('Requirements')}</h4>
                      <p className="bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line leading-relaxed">
                        {job.requirements}
                      </p>
                    </div>
                  )}

                  {job.skills && job.skills.length > 0 && (
                    <div>
                      <h4 className="font-black text-slate-900 mb-1.5">{__('Tagged Skills')}</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {job.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-bold text-[11px]"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-100 p-12 text-center space-y-3 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{__('All Clear!')}</h3>
            <p className="text-xs text-slate-400 font-medium max-w-sm mx-auto">
              {__('There are no job postings currently awaiting approval. All submissions are up to date.')}
            </p>
            <div className="pt-2">
              <Link
                href={`/${locale}/admin/jobs`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                <span>{__('View All Jobs')}</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

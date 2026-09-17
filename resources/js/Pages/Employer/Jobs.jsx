import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Briefcase,
  PlusCircle,
  Users,
  Copy,
  Pencil,
  Trash2,
  Power,
  Eye,
  CheckCircle2,
  Clock,
  Archive,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function Jobs({ jobs, stats = {}, filters = {} }) {
  const { __, locale, isRtl } = useTranslation();

  const handleToggleStatus = (jobId) => {
    router.post(
      `/${locale}/employer/jobs/${jobId}/toggle`,
      {},
      { preserveScroll: true }
    );
  };

  const handleDuplicate = (jobId) => {
    router.post(
      `/${locale}/employer/jobs/${jobId}/duplicate`,
      {},
      { preserveScroll: true }
    );
  };

  const handleDelete = (jobId) => {
    if (confirm(__('Are you sure you want to delete this job posting? This cannot be undone.'))) {
      router.delete(`/${locale}/employer/jobs/${jobId}`, {
        preserveScroll: true,
      });
    }
  };

  const handleStatusFilter = (st) => {
    router.get(
      `/${locale}/employer/jobs`,
      st ? { status: st } : {},
      { preserveState: true, preserveScroll: true }
    );
  };

  const getStatusBadge = (job) => {
    if (job.status === 'pending') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Clock className="w-3 h-3" />
          {__('Pending Admin Approval')}
        </span>
      );
    }
    if (job.status === 'published' && job.is_active) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {__('Published')}
        </span>
      );
    }
    if (job.status === 'draft') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
          <Clock className="w-3 h-3" />
          {__('Draft')}
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
        <Archive className="w-3 h-3" />
        {__('Closed')}
      </span>
    );
  };

  return (
    <DashboardLayout userRole="employer">
      <Head title={__('Manage Jobs')} />

      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {__('Job Openings')}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {__('Create, manage, and monitor your recruitment listings.')}
            </p>
          </div>

          <Link
            href={`/${locale}/employer/jobs/create`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#008A7B] text-white hover:bg-[#014D55] shadow-sm transition-all self-start sm:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{__('Post a New Job')}</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block mb-1">{__('Total Jobs')}</span>
            <span className="text-2xl font-black text-slate-900">{stats.total_jobs || 0}</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-amber-100 bg-amber-50/30 shadow-sm">
            <span className="text-xs font-bold text-amber-700 block mb-1">{__('Pending Review')}</span>
            <span className="text-2xl font-black text-amber-700">{stats.pending_jobs || 0}</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-emerald-600 block mb-1">{__('Active Jobs')}</span>
            <span className="text-2xl font-black text-slate-900">{stats.active_jobs || 0}</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-rose-600 block mb-1">{__('Closed Jobs')}</span>
            <span className="text-2xl font-black text-slate-900">{stats.closed_jobs || 0}</span>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-blue-600 block mb-1">{__('Total Applications')}</span>
            <span className="text-2xl font-black text-slate-900">{stats.total_applications || 0}</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {[
            { key: '', label: __('All Postings') },
            { key: 'pending', label: __('Pending Approval') },
            { key: 'published', label: __('Published') },
            { key: 'draft', label: __('Drafts') },
            { key: 'closed', label: __('Closed') },
          ].map((f) => {
            const isActive = (filters.status || '') === f.key;
            return (
              <button
                key={f.key}
                type="button"
                onClick={() => handleStatusFilter(f.key)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#008A7B] text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Jobs List / Table Card */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {jobs?.data && jobs.data.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {jobs.data.map((job) => (
                <div
                  key={job.id}
                  className="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5 hover:bg-slate-50/60 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="text-base sm:text-lg font-black text-slate-900">
                        {job.title}
                      </h3>
                      {getStatusBadge(job)}
                    </div>

                    <div className="flex items-center gap-4 flex-wrap text-xs text-slate-500 font-medium">
                      {job.category?.name && <span>📁 {job.category.name}</span>}
                      {job.job_type && <span>💼 {job.job_type}</span>}
                      {job.work_type && <span>📍 {job.work_type}</span>}
                      {job.created_at && (
                        <span>🕒 {new Date(job.created_at).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>

                  {/* Right: Applicants & Actions */}
                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    {/* View Candidates link */}
                    <Link
                      href={`/${locale}/employer/applicants?job_id=${job.id}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-[#E6F8F6] text-slate-700 hover:text-[#008A7B] font-bold text-xs transition-all cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>
                        {job.applications_count || 0} {__('Candidates')}
                      </span>
                    </Link>

                    {/* Toggle publish / close */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(job.id)}
                      className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                        job.status === 'published'
                          ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                          : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                      }`}
                      title={job.status === 'published' ? __('Close Job') : __('Publish Job')}
                    >
                      <Power className="w-4 h-4" />
                    </button>

                    {/* Duplicate */}
                    <button
                      type="button"
                      onClick={() => handleDuplicate(job.id)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                      title={__('Duplicate as Draft')}
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <Link
                      href={`/${locale}/employer/jobs/${job.id}/edit`}
                      className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#008A7B] hover:bg-slate-100 transition-colors cursor-pointer"
                      title={__('Edit Job')}
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(job.id)}
                      className="p-2 rounded-xl border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title={__('Delete Job')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-800 mb-1">
                {__('No job postings yet')}
              </h3>
              <p className="text-xs text-slate-400 font-medium mb-5">
                {__('Get started by posting your first job opening to attract top talent.')}
              </p>
              <Link
                href={`/${locale}/employer/jobs/create`}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-[#008A7B] text-white hover:bg-[#014D55] transition-all cursor-pointer shadow-sm"
              >
                <PlusCircle className="w-4 h-4" />
                <span>{__('Post a Job Now')}</span>
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {jobs?.links && jobs.links.length > 3 && (
          <div className="flex items-center justify-center gap-1.5 pt-4">
            {jobs.links.map((lnk, idx) => (
              <Link
                key={idx}
                href={lnk.url || '#'}
                dangerouslySetInnerHTML={{ __html: lnk.label }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  lnk.active
                    ? 'bg-[#008A7B] text-white'
                    : lnk.url
                    ? 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

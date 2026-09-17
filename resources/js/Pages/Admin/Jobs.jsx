import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  Briefcase,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Archive,
  Eye,
  Trash2,
  Building2,
  MapPin,
  DollarSign,
  AlertCircle,
  X,
  Check,
  Power,
  Layers,
  FileText,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function AdminJobs({
  jobs,
  categories = [],
  stats = {},
  filters = {},
}) {
  const { __, locale, isRtl } = useTranslation();
  const { flash } = usePage().props;

  const [search, setSearch] = useState(filters.search || '');
  const [selectedJobDetails, setSelectedJobDetails] = useState(null);
  const [jobToDelete, setJobToDelete] = useState(null);

  const handleFilter = (newFilters) => {
    const updated = {
      ...filters,
      ...newFilters,
    };
    Object.keys(updated).forEach((k) => !updated[k] && delete updated[k]);

    router.get(`/${locale}/admin/jobs`, updated, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilter({ search });
  };

  const handleApprove = (jobId) => {
    router.post(
      `/${locale}/admin/jobs/${jobId}/approve`,
      {},
      { preserveScroll: true }
    );
  };

  const handleReject = (jobId) => {
    router.post(
      `/${locale}/admin/jobs/${jobId}/reject`,
      {},
      { preserveScroll: true }
    );
  };

  const handleToggle = (jobId) => {
    router.post(
      `/${locale}/admin/jobs/${jobId}/toggle`,
      {},
      { preserveScroll: true }
    );
  };

  const confirmDelete = () => {
    if (!jobToDelete) return;
    router.delete(`/${locale}/admin/jobs/${jobToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => setJobToDelete(null),
    });
  };

  const getStatusBadge = (job) => {
    switch (job.status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {__('Published')}
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" />
            {__('Pending Review')}
          </span>
        );
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <FileText className="w-3 h-3" />
            {__('Draft')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Archive className="w-3 h-3" />
            {__('Closed')}
          </span>
        );
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <Head title={__('Job Management') + ' - CareerX'} />

      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
        {/* Flash messages */}
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

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {__('Platform Job Moderation & Management')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {__('Approve pending listings, manage published jobs, and review vacancy details')}
            </p>
          </div>
          <Link
            href={`/${locale}/admin/pending-jobs`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs transition-all shadow-md active:scale-95 shrink-0"
          >
            <Clock className="w-4 h-4" />
            <span>{__('Pending Approvals Queue')}</span>
            {stats.pending > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-900/20 text-slate-900 text-[11px]">
                {stats.pending}
              </span>
            )}
          </Link>
        </div>

        {/* Stats Filter Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => handleFilter({ status: '' })}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
              !filters.status
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold block opacity-75">{__('All Postings')}</span>
            <span className="text-xl font-black mt-1 block">{stats.total || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilter({ status: 'pending' })}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
              filters.status === 'pending'
                ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md font-black'
                : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold block opacity-75">{__('Pending Approval')}</span>
            <span className="text-xl font-black mt-1 block">{stats.pending || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilter({ status: 'published' })}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
              filters.status === 'published'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
                : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold block opacity-75">{__('Published')}</span>
            <span className="text-xl font-black mt-1 block">{stats.published || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilter({ status: 'closed' })}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
              filters.status === 'closed'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold block opacity-75">{__('Closed')}</span>
            <span className="text-xl font-black mt-1 block">{stats.closed || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilter({ status: 'draft' })}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
              filters.status === 'draft'
                ? 'bg-slate-700 text-white border-slate-700 shadow-md'
                : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold block opacity-75">{__('Drafts')}</span>
            <span className="text-xl font-black mt-1 block">{stats.draft || 0}</span>
          </button>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={__('Search job title or company name...')}
              className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent"
            />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={filters.category_id || ''}
              onChange={(e) => handleFilter({ category_id: e.target.value })}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#008A7B]"
            >
              <option value="">{__('All Categories')}</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {(filters.status || filters.category_id || filters.search) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  router.get(`/${locale}/admin/jobs`);
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {__('Reset Filters')}
              </button>
            )}
          </div>
        </div>

        {/* Jobs Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5 text-start">{__('Job Posting')}</th>
                  <th className="py-3.5 px-5 text-start">{__('Category & Type')}</th>
                  <th className="py-3.5 px-5 text-start">{__('Applications')}</th>
                  <th className="py-3.5 px-5 text-start">{__('Status')}</th>
                  <th className="py-3.5 px-5 text-start">{__('Posted Date')}</th>
                  <th className="py-3.5 px-5 text-end">{__('Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {jobs.data && jobs.data.length > 0 ? (
                  jobs.data.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Job Title & Company */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          {job.company_logo ? (
                            <img
                              src={job.company_logo}
                              alt={job.company_name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-xl bg-[#014D55] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                              {job.company_name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <span className="font-black text-slate-900 block truncate">
                              {job.title}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium block truncate">
                              {job.company_name} {job.location ? `· ${job.location}` : ''}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category & Type */}
                      <td className="py-4 px-5">
                        <span className="font-bold text-slate-800 block truncate">
                          {job.category}
                        </span>
                        <span className="text-[11px] text-slate-400 block truncate">
                          {job.job_type} · {job.work_type}
                        </span>
                      </td>

                      {/* Applications */}
                      <td className="py-4 px-5">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 text-blue-700 font-bold text-xs">
                          {job.applications_count} {__('Candidates')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        {getStatusBadge(job)}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-5 text-slate-400 text-[11px]">
                        {job.created_at}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-end">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* If pending, show quick approve/reject */}
                          {job.status === 'pending' && (
                            <>
                              <button
                                type="button"
                                onClick={() => handleApprove(job.id)}
                                className="p-2 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                                title={__('Approve & Publish')}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleReject(job.id)}
                                className="p-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors cursor-pointer"
                                title={__('Reject Job')}
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}

                          {/* Toggle Status (Publish/Close) */}
                          {job.status !== 'pending' && (
                            <button
                              type="button"
                              onClick={() => handleToggle(job.id)}
                              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                job.status === 'published'
                                  ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                                  : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                              }`}
                              title={job.status === 'published' ? __('Close Job') : __('Publish Job')}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          )}

                          {/* View Details */}
                          <button
                            type="button"
                            onClick={() => setSelectedJobDetails(job)}
                            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
                            title={__('View Job Details')}
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Delete Job */}
                          <button
                            type="button"
                            onClick={() => setJobToDelete(job)}
                            className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title={__('Delete Job Posting')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <Briefcase className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-semibold">{__('No jobs found.')}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {jobs.links && jobs.links.length > 3 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                {__('Showing')} {jobs.from || 0} {__('to')} {jobs.to || 0} {__('of')} {jobs.total || 0} {__('results')}
              </span>
              <div className="flex items-center gap-1">
                {jobs.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.url || '#'}
                    preserveScroll
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      link.active
                        ? 'bg-[#014D55] text-white'
                        : link.url
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                        : 'opacity-40 cursor-not-allowed text-slate-400'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Job Details Modal */}
      {selectedJobDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-[#E6F8F6] text-[#014D55]">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">{selectedJobDetails.title}</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {selectedJobDetails.company_name} · {selectedJobDetails.category}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedJobDetails(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">{__('Job Type')}</span>
                <span className="text-xs font-black text-slate-900">{selectedJobDetails.job_type}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">{__('Work Type')}</span>
                <span className="text-xs font-black text-slate-900">{selectedJobDetails.work_type}</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">{__('Salary')}</span>
                <span className="text-xs font-black text-slate-900">
                  {selectedJobDetails.salary_min ? `${selectedJobDetails.salary_min} - ${selectedJobDetails.salary_max}` : __('Not disclosed')}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] text-slate-400 font-bold block">{__('Applications')}</span>
                <span className="text-xs font-black text-slate-900">{selectedJobDetails.applications_count}</span>
              </div>
            </div>

            {selectedJobDetails.description && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{__('Description')}</h4>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedJobDetails.description}
                </p>
              </div>
            )}

            {selectedJobDetails.responsibilities && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{__('Responsibilities')}</h4>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedJobDetails.responsibilities}
                </p>
              </div>
            )}

            {selectedJobDetails.requirements && (
              <div className="space-y-1.5">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">{__('Requirements')}</h4>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {selectedJobDetails.requirements}
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              {selectedJobDetails.status === 'pending' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      handleApprove(selectedJobDetails.id);
                      setSelectedJobDetails(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{__('Approve Post')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      handleReject(selectedJobDetails.id);
                      setSelectedJobDetails(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{__('Reject Post')}</span>
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={() => setSelectedJobDetails(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {__('Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Job Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">{__('Delete Job Posting')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {__('Are you sure you want to delete the job post')} <strong className="text-slate-900">{jobToDelete.title}</strong>{' '}
              {__('by')} <strong>{jobToDelete.company_name}</strong>?{' '}
              {__('All applicant applications for this post will also be removed. This cannot be undone.')}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {__('Cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {__('Yes, Delete Job')}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

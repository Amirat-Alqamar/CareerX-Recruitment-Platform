import React, { useState, useEffect } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import ModalWrapper from '@/Components/Dashboard/Seeker/Profile/Modals/ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import {
  Send,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Briefcase,
  ChevronRight,
  Filter,
  X,
  Sparkles,
  Video,
  ExternalLink,
} from 'lucide-react';

export default function Applications({
  applications = [],
  stats = { total: 0, applied: 0, reviewed: 0, accepted: 0, rejected: 0 },
  selectedAppId = null,
}) {
  const { __, locale } = useTranslation();
  const { flash } = usePage().props;

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);

  // Flash notification toast
  const [showFlash, setShowFlash] = useState(false);
  useEffect(() => {
    if (flash?.success || flash?.error) {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  // Open modal if selectedAppId is passed
  useEffect(() => {
    if (selectedAppId && applications.length > 0) {
      const match = applications.find((a) => String(a.id) === String(selectedAppId));
      if (match) {
        setSelectedApp(match);
      }
    }
  }, [selectedAppId, applications]);

  const filteredApplications = applications.filter((app) => {
    if (activeFilter === 'all') return true;
    return app.status === activeFilter;
  });

function ApplicationStepper({ status, meetingLink, __ }) {
  const isRejected = status === 'rejected';
  const isAccepted = status === 'accepted' || status === 'hired';
  const isInterview = status === 'interview' || Boolean(meetingLink);
  const isReviewed = status === 'reviewed' || isInterview || isAccepted || isRejected || status === 'shortlisted';
  const rejectedAfterInterview = isRejected && Boolean(meetingLink);

  const steps = [
    {
      id: 'pending',
      label: __('Pending'),
      isDone: true,
      isCurrent: status === 'applied' || status === 'pending',
    },
    {
      id: 'reviewed',
      label: __('Reviewed'),
      isDone: isReviewed && status !== 'applied' && status !== 'pending',
      isCurrent: status === 'reviewed' || status === 'shortlisted',
    },
    {
      id: 'interview',
      label: __('Interview'),
      isDone: isInterview && (isAccepted || (isRejected && rejectedAfterInterview)),
      isCurrent: status === 'interview',
      isSkipped: isRejected && !rejectedAfterInterview,
    },
    {
      id: 'decision',
      label: isRejected ? __('Not Selected') : isAccepted ? __('Accepted') : __('Final Decision'),
      isDone: isAccepted || isRejected,
      isCurrent: isAccepted || isRejected,
      isRejected: isRejected,
      isAccepted: isAccepted,
    },
  ];

  return (
    <div className="pt-4 border-t border-slate-100">
      <div className="grid grid-cols-4 gap-2 relative">
        {steps.map((st, idx) => {
          let circleBg = 'bg-slate-100 text-slate-400 border-slate-200';
          let textColor = 'text-slate-400 font-medium';

          if (st.isRejected) {
            circleBg = 'bg-rose-500 text-white border-rose-500 shadow-xs';
            textColor = 'text-rose-600 font-bold';
          } else if (st.isAccepted) {
            circleBg = 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
            textColor = 'text-emerald-700 font-bold';
          } else if (st.isDone) {
            circleBg = 'bg-[#008A7B] text-white border-[#008A7B] shadow-xs';
            textColor = 'text-[#008A7B] font-bold';
          } else if (st.isCurrent) {
            circleBg = 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-100 animate-pulse';
            textColor = 'text-blue-700 font-bold';
          } else if (st.isSkipped) {
            circleBg = 'bg-slate-100 text-slate-300 border-slate-200';
            textColor = 'text-slate-300 line-through';
          }

          return (
            <div key={st.id} className="flex flex-col items-center text-center relative group/step">
              {/* Connector line */}
              {idx > 0 && (
                <div
                  className={`absolute top-3.5 right-[50%] rtl:right-auto rtl:left-[50%] w-full h-[2px] -z-0 ${
                    st.isDone || st.isAccepted
                      ? 'bg-[#008A7B]'
                      : st.isRejected
                      ? 'bg-rose-300'
                      : 'bg-slate-200'
                  }`}
                />
              )}

              {/* Circle Icon */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border transition-all z-10 ${circleBg}`}
              >
                {st.isRejected ? (
                  '✕'
                ) : st.isAccepted || st.isDone ? (
                  '✓'
                ) : (
                  idx + 1
                )}
              </div>

              {/* Label */}
              <span className={`text-[11px] mt-1.5 transition-colors truncate max-w-full px-1 ${textColor}`}>
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const getStatusBadge = (status) => {
    switch (status) {
      case 'applied':
      case 'pending':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{__('Pending')}</span>
          </span>
        );
      case 'reviewed':
      case 'shortlisted':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-extrabold inline-flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" />
            <span>{__('Under Review')}</span>
          </span>
        );
      case 'accepted':
      case 'hired':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-extrabold inline-flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{__('Accepted')}</span>
          </span>
        );
      case 'interview':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-extrabold inline-flex items-center gap-1 border border-blue-200">
            <Video className="w-3.5 h-3.5 text-blue-600" />
            <span>{__('Interview Scheduled')}</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-extrabold inline-flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" />
            <span>{__('Rejected')}</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-extrabold">
            {status}
          </span>
        );
    }
  };

  return (
    <DashboardLayout userRole="seeker">
      <Head title={__('My Applications')} />

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
              <Send className="w-3.5 h-3.5" />
              <span>{__('Job Applications')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {__('Track Your Job Applications')}
            </h1>
            <p className="text-sm text-slate-500 font-medium mt-1 max-w-xl">
              {__('Review the status and hiring stage of every position you applied to.')}
            </p>
          </div>
        </div>

        {/* Stats KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">{__('Total Applied')}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.total ?? 0}</h3>
            </div>
          </div>

          {/* Under Review */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-600">{__('Under Review')}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.reviewed ?? 0}</h3>
            </div>
          </div>

          {/* Accepted */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-emerald-600">{__('Accepted')}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.accepted ?? 0}</h3>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
              <XCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-rose-600">{__('Rejected')}</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{stats.rejected ?? 0}</h3>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-3xl p-3 border border-slate-100 shadow-sm flex items-center gap-2 overflow-x-auto">
          {[
            { key: 'all', label: __('All Applications'), count: stats.total },
            { key: 'applied', label: __('Submitted'), count: stats.applied },
            { key: 'reviewed', label: __('Under Review'), count: stats.reviewed },
            { key: 'interview', label: __('Interview'), count: stats.interview },
            { key: 'accepted', label: __('Accepted'), count: stats.accepted },
            { key: 'rejected', label: __('Rejected'), count: stats.rejected },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-4 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeFilter === tab.key
                  ? 'bg-[#014D55] text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                    activeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.length > 0 ? (
            filteredApplications.map((app) => (
              <div
                key={app.id}
                onClick={() => setSelectedApp(app)}
                className="bg-white rounded-3xl p-6 border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-lg font-black text-slate-900 group-hover:text-[#008A7B] transition-colors">
                        {app.job_post?.title || app.jobPost?.title || __('Untitled Position')}
                      </h2>
                      {getStatusBadge(app.status)}
                    </div>

                    <div className="flex items-center gap-4 flex-wrap text-xs font-semibold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {app.job_post?.company?.name || app.jobPost?.company?.name || __('CareerX Partner')}
                        </span>
                      </div>

                      {(app.job_post?.city?.name || app.jobPost?.city?.name) && (
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          <span>{app.job_post?.city?.name || app.jobPost?.city?.name}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {app.created_at ? new Date(app.created_at).toLocaleDateString() : '-'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedApp(app);
                      }}
                      className="px-4 py-2 rounded-xl bg-slate-100 group-hover:bg-[#008A7B] text-slate-700 group-hover:text-white font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{__('View Details')}</span>
                    </button>
                  </div>
                </div>

                {/* Google Meet Scheduled Box if present */}
                {app.meeting_link && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Video className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-black text-blue-950 block">
                          📅 {__('Interview Scheduled with Employer')}
                        </span>
                        {app.interview_date && (
                          <span className="text-[11px] text-blue-700 font-semibold">
                            {new Date(app.interview_date).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <a
                      href={app.meeting_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>{__('Join Google Meet')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* 4-Stage Visual Stepper */}
                <ApplicationStepper status={app.status} meetingLink={app.meeting_link} __={__} />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Send className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {__('No applications found')}
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  {activeFilter === 'all'
                    ? __('You have not applied for any jobs yet. Start exploring open positions!')
                    : __('No applications match this filter.')}
                </p>
              </div>
              <Link
                href={`/${locale}/job-seeker/jobs`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#008A7B] text-white text-xs font-bold hover:bg-[#007467] transition-all cursor-pointer shadow-sm"
              >
                <Briefcase className="w-4 h-4" />
                <span>{__('Browse Open Jobs')}</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Application Details Modal */}
      <ModalWrapper
        isOpen={Boolean(selectedApp)}
        onClose={() => setSelectedApp(null)}
        title={__('Application Details')}
        maxWidth="max-w-xl"
      >
        {selectedApp && (
          <div className="space-y-6">
            {/* Job Header */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h3 className="text-base font-black text-slate-900">
                  {selectedApp.job_post?.title || selectedApp.jobPost?.title || __('Job')}
                </h3>
                {getStatusBadge(selectedApp.status)}
              </div>
              <p className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5 text-[#008A7B]" />
                <span>{selectedApp.job_post?.company?.name || selectedApp.jobPost?.company?.name}</span>
              </p>
            </div>

            {/* 4-Stage Visual Stepper in Modal */}
            <ApplicationStepper status={selectedApp.status} meetingLink={selectedApp.meeting_link} __={__} />

            {/* Submission metadata */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              <div>
                <span className="text-slate-400 font-semibold block">{__('Date Applied')}</span>
                <span className="text-slate-800 font-bold mt-0.5 block">
                  {selectedApp.created_at ? new Date(selectedApp.created_at).toLocaleString() : '-'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block">{__('Application ID')}</span>
                <span className="text-slate-800 font-bold mt-0.5 block">
                  #{selectedApp.id}
                </span>
              </div>
            </div>

            {/* Attached Resume */}
            {selectedApp.resume && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  {__('Attached Resume')}
                </h4>
                <div className="p-3.5 bg-white border border-slate-200 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#E6F8F6] text-[#008A7B] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {selectedApp.resume.title || __('My Resume')}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {selectedApp.resume.file_path?.split('.').pop()?.toUpperCase() || 'PDF'}
                      </p>
                    </div>
                  </div>

                  <a
                    href={`/${locale}/job-seeker/resumes/${selectedApp.resume.id}/download`}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#008A7B] text-slate-700 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{__('Download')}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {selectedApp.cover_letter && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                  {__('Cover Letter')}
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                  {selectedApp.cover_letter}
                </p>
              </div>
            )}

            {/* Google Meet Scheduled Info in Modal */}
            {selectedApp.meeting_link && (
              <div className="p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-blue-950 block">
                      📅 {__('Interview Scheduled with Employer')}
                    </span>
                    {selectedApp.interview_date && (
                      <span className="text-[11px] text-blue-700 font-semibold">
                        {new Date(selectedApp.interview_date).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={selectedApp.meeting_link}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{__('Join Google Meet')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}

            {/* Close action */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                {__('Close')}
              </button>
            </div>
          </div>
        )}
      </ModalWrapper>
    </DashboardLayout>
  );
}

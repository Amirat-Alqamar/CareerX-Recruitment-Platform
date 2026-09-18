import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Video,
  Copy,
  Check,
  Clock,
  ExternalLink,
  MessageSquare,
  FileText,
  FolderKanban,
  CheckCircle2,
  XCircle,
  Eye,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

function ApplicationStepper({ status, meetingLink, __ }) {
  let reviewState = 'current';
  let interviewState = 'pending';

  if (['accepted', 'interview', 'interview_success', 'interview_failed'].includes(status)) {
    reviewState = 'done';
  } else if (status === 'rejected') {
    reviewState = 'rejected';
  } else {
    reviewState = 'current';
  }

  if (status === 'interview_success') {
    interviewState = 'accepted';
  } else if (status === 'interview_failed') {
    interviewState = 'rejected';
  } else if (status === 'interview' || status === 'accepted') {
    interviewState = 'current';
  } else if (status === 'rejected') {
    interviewState = 'inactive';
  } else {
    interviewState = 'pending';
  }

  const steps = [
    {
      id: 'applied',
      label: __('Applied'),
      state: 'done',
    },
    {
      id: 'review',
      label: __('Review'),
      state: reviewState,
    },
    {
      id: 'interview',
      label: __('Interview'),
      state: interviewState,
    },
  ];

  return (
    <div className="pt-4 border-t border-slate-100 w-full">
      <div className="grid grid-cols-3 gap-2 relative">
        {steps.map((st, idx) => {
          let circleBg = 'bg-slate-100 text-slate-400 border-slate-200';
          let textColor = 'text-slate-400 font-medium';
          let icon = idx + 1;

          if (st.state === 'done') {
            circleBg = 'bg-[#008A7B] text-white border-[#008A7B] shadow-xs';
            textColor = 'text-[#008A7B] font-bold';
            icon = '✓';
          } else if (st.state === 'current') {
            circleBg = 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-100 animate-pulse';
            textColor = 'text-blue-700 font-bold';
            icon = '●';
          } else if (st.state === 'accepted') {
            circleBg = 'bg-emerald-600 text-white border-emerald-600 shadow-xs';
            textColor = 'text-emerald-700 font-bold';
            icon = '✓';
          } else if (st.state === 'rejected') {
            circleBg = 'bg-rose-500 text-white border-rose-500 shadow-xs';
            textColor = 'text-rose-600 font-bold';
            icon = '✕';
          } else if (st.state === 'inactive') {
            circleBg = 'bg-slate-100 text-slate-300 border-dashed border-slate-300';
            textColor = 'text-slate-300 line-through';
            icon = '-';
          }

          return (
            <div key={st.id} className="flex flex-col items-center text-center relative group/step">
              {idx > 0 && (
                <div
                  className={`absolute top-3.5 right-[50%] rtl:right-auto rtl:left-[50%] w-full h-[2px] -z-0 ${
                    st.state === 'done' || st.state === 'accepted'
                      ? 'bg-[#008A7B]'
                      : st.state === 'rejected'
                      ? 'bg-rose-300'
                      : st.state === 'inactive'
                      ? 'bg-slate-200 border-t border-dashed border-slate-300'
                      : 'bg-slate-200'
                  }`}
                />
              )}

              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black border transition-all z-10 ${circleBg}`}
              >
                {icon}
              </div>

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

export default function ApplicantDetail({ application }) {
  const { __, locale, isRtl } = useTranslation();

  const [activeTab, setActiveTab] = useState('experience');
  const [copiedLink, setCopiedLink] = useState(false);

  // Status state
  const [currentStatus, setCurrentStatus] = useState(application.status || 'applied');
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Interview Modal / Form state
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [interviewDate, setInterviewDate] = useState(
    application.interview_date ? application.interview_date.replace(' ', 'T') : ''
  );
  const [interviewNotes, setInterviewNotes] = useState(application.interview_notes || '');
  const [customLink, setCustomLink] = useState(application.meeting_link || '');
  const [schedulingInterview, setSchedulingInterview] = useState(false);

  React.useEffect(() => {
    if (application.status) {
      setCurrentStatus(application.status);
    }
    setInterviewDate(application.interview_date ? String(application.interview_date).replace(' ', 'T') : '');
    setCustomLink(application.meeting_link || '');
    setInterviewNotes(application.interview_notes || '');
  }, [application]);

  const candidate = application.candidate || {};
  const job = application.job || {};

  const getMinDateTime = () => {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  const formatInterviewDate = (dateStr) => {
    if (!dateStr) return '';
    const clean = String(dateStr).replace(' ', 'T');
    const d = new Date(clean);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleOpenInterviewModal = () => {
    setInterviewDate(application.interview_date ? String(application.interview_date).replace(' ', 'T') : '');
    setCustomLink(application.meeting_link || '');
    setInterviewNotes(application.interview_notes || '');
    setShowInterviewModal(true);
  };

  const handleStatusChange = (newStatus) => {
    setCurrentStatus(newStatus);
    setUpdatingStatus(true);
    router.put(
      `/${locale}/employer/applicants/${application.id}/status`,
      { status: newStatus },
      {
        preserveScroll: true,
        onFinish: () => setUpdatingStatus(false),
      }
    );
  };

  const handleScheduleInterview = (e) => {
    e.preventDefault();
    setSchedulingInterview(true);
    router.post(
      `/${locale}/employer/applicants/${application.id}/interview`,
      {
        interview_date: interviewDate,
        interview_notes: interviewNotes,
        custom_link: customLink || undefined,
      },
      {
        preserveScroll: true,
        onSuccess: () => {
          setShowInterviewModal(false);
          setCurrentStatus('interview');
        },
        onFinish: () => setSchedulingInterview(false),
      }
    );
  };

  const copyMeetingLink = () => {
    if (!application.meeting_link) return;
    navigator.clipboard.writeText(application.meeting_link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // 5 clear status options for Employer dropdown
  const statusOptions = [
    { value: 'reviewed', label: __('Review') },
    { value: 'accepted', label: __('Accept') },
    { value: 'rejected', label: __('Reject') },
    { value: 'interview_success', label: __('Success Interview') },
    { value: 'interview_failed', label: __('Failed Interview') },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'interview_success':
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-black inline-flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{__('Success Interview')}</span>
          </span>
        );
      case 'interview_failed':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black inline-flex items-center gap-1.5 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{__('Failed Interview')}</span>
          </span>
        );
      case 'accepted':
      case 'interview':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black inline-flex items-center gap-1.5 border border-blue-200">
            <Video className="w-3.5 h-3.5 text-blue-600" />
            <span>{__('Interview')}</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-black inline-flex items-center gap-1.5 border border-rose-200">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>{__('Rejected')}</span>
          </span>
        );
      case 'reviewed':
        return (
          <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-black inline-flex items-center gap-1.5 border border-blue-200">
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>{__('Review')}</span>
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-black inline-flex items-center gap-1.5 border border-slate-200">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{__('Applied')}</span>
          </span>
        );
    }
  };

  return (
    <DashboardLayout userRole="employer">
      <Head title={`${candidate.name || __('Candidate')} - ${__('Application Review')}`} />

      <div className="space-y-6 max-w-6xl mx-auto">
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/employer/applicants`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#008A7B] transition-colors"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{__('Back to Candidates')}</span>
          </Link>

          <span className="text-xs text-slate-400 font-medium">
            {__('Applied on:')} <strong className="text-slate-700">{application.created_at}</strong>
          </span>
        </div>

        {/* Position Applied & Quick Status Banner */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-7 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {__('Position Applied For')}
                </span>
                {getStatusBadge(currentStatus)}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">{job.title}</h2>
              <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-1">
                {job.job_type && <span>{job.job_type}</span>}
                {job.work_type && <span>• {job.work_type}</span>}
              </div>
            </div>

            {/* Status Select & Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-2xl px-3 py-1.5">
                <span className="text-xs font-bold text-slate-500">{__('Status:')}</span>
                <select
                  value={currentStatus === 'applied' || currentStatus === 'pending' ? 'reviewed' : currentStatus}
                  disabled={updatingStatus}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="bg-transparent border-0 py-1 text-xs font-black text-slate-800 focus:outline-none focus:ring-0 cursor-pointer"
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Schedule Google Meet Interview Button */}
              <button
                type="button"
                onClick={handleOpenInterviewModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-sm hover:shadow"
              >
                <Video className="w-4 h-4" />
                <span>{application.meeting_link ? __('Reschedule Google Meet') : __('Schedule Google Meet Interview')}</span>
              </button>
            </div>
          </div>

          {/* 3-Stage Visual Application Stepper */}
          <ApplicationStepper
            status={currentStatus}
            meetingLink={application.meeting_link}
            __={__}
          />
        </div>

        {/* Interview Scheduled Alert / Banner (If scheduled) */}
        {application.meeting_link && (
          <div className="bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-teal-500/10 border border-blue-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-extrabold mb-1">
                  <span>📅 {__('Interview Scheduled')}</span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-slate-900">
                  {formatInterviewDate(application.interview_date)}
                </h4>
                {application.interview_notes && (
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {application.interview_notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <a
                href={application.meeting_link}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
              >
                <Video className="w-3.5 h-3.5" />
                <span>{__('Join Google Meet')}</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={copyMeetingLink}
                title={__('Copy Meeting Link')}
                className="p-2.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50 text-blue-700 transition-all cursor-pointer"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        )}

        {/* Candidate Profile Info Header */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {candidate.avatar ? (
                <img
                  src={candidate.avatar}
                  alt={candidate.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-[#014D55] text-white font-black text-2xl flex items-center justify-center shadow-sm">
                  {candidate.name ? candidate.name.slice(0, 2).toUpperCase() : 'CA'}
                </div>
              )}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">{candidate.name}</h2>
                <p className="text-xs sm:text-sm font-semibold text-[#008A7B] mt-0.5">
                  {candidate.headline || __('Candidate')}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium mt-2">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {candidate.email}
                  </span>
                  {candidate.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {candidate.phone}
                    </span>
                  )}
                  {(candidate.city || candidate.country) && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {[candidate.city, candidate.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* CV Download button */}
            {application.resume ? (
              <a
                href={application.resume.download_url}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-rose-600 text-white hover:bg-rose-700 shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{__('Download CV')}</span>
              </a>
            ) : (
              <span className="text-xs text-slate-400 italic">
                {__('No CV attached')}
              </span>
            )}
          </div>

          {/* Cover Letter Section if exists */}
          {application.cover_letter && (
            <div className="mt-6 pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                {__('Cover Letter')}
              </h4>
              <p className="text-xs sm:text-sm text-slate-700 font-normal leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                {application.cover_letter}
              </p>
            </div>
          )}
        </div>

        {/* Candidate Profile Tabs (Experiences, Education, Skills, Languages, Portfolio) */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto scrollbar-none">
            {[
              { key: 'experience', label: __('Work Experience'), icon: Briefcase, count: candidate.experiences?.length },
              { key: 'education', label: __('Education'), icon: GraduationCap, count: candidate.educations?.length },
              { key: 'skills', label: __('Skills'), icon: Award, count: candidate.skills?.length },
              { key: 'languages', label: __('Languages'), icon: Globe, count: candidate.languages?.length },
              { key: 'portfolio', label: __('Portfolio'), icon: FolderKanban, count: candidate.portfolio?.length },
            ].map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTab(t.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#E6F8F6] text-[#008A7B]'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                  {t.count !== undefined && (
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px]">
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Tab Content */}
          <div>
            {/* Experience */}
            {activeTab === 'experience' && (
              <div className="space-y-4">
                {candidate.experiences && candidate.experiences.length > 0 ? (
                  candidate.experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <h4 className="font-black text-slate-900 text-sm">{exp.job_title}</h4>
                      <p className="text-xs font-semibold text-[#008A7B]">{exp.company_name}</p>
                      <p className="text-[11px] text-slate-400">
                        {exp.start_date} - {exp.is_current ? __('Present') : exp.end_date}
                      </p>
                      {exp.description && (
                        <p className="text-xs text-slate-600 font-medium pt-1 whitespace-pre-line">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">{__('No work experiences recorded.')}</p>
                )}
              </div>
            )}

            {/* Education */}
            {activeTab === 'education' && (
              <div className="space-y-4">
                {candidate.educations && candidate.educations.length > 0 ? (
                  candidate.educations.map((edu) => (
                    <div key={edu.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                      <h4 className="font-black text-slate-900 text-sm">{edu.degree}</h4>
                      <p className="text-xs font-semibold text-[#008A7B]">{edu.institution}</p>
                      <p className="text-[11px] text-slate-400">
                        {edu.start_year} - {edu.end_year || __('Present')}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">{__('No education details recorded.')}</p>
                )}
              </div>
            )}

            {/* Skills */}
            {activeTab === 'skills' && (
              <div className="flex flex-wrap gap-2">
                {candidate.skills && candidate.skills.length > 0 ? (
                  candidate.skills.map((sk) => (
                    <span
                      key={sk.id}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
                    >
                      {sk.name}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">{__('No skills added.')}</p>
                )}
              </div>
            )}

            {/* Languages */}
            {activeTab === 'languages' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {candidate.languages && candidate.languages.length > 0 ? (
                  candidate.languages.map((lang) => (
                    <div
                      key={lang.id}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between"
                    >
                      <span className="text-xs font-black text-slate-800">{lang.name}</span>
                      <span className="text-[11px] font-bold text-[#008A7B]">
                        {lang.pivot?.level || __('Professional')}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">{__('No languages recorded.')}</p>
                )}
              </div>
            )}

            {/* Portfolio */}
            {activeTab === 'portfolio' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {candidate.portfolio && candidate.portfolio.length > 0 ? (
                  candidate.portfolio.map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                      <h4 className="text-sm font-black text-slate-900">{item.title}</h4>
                      {item.description && (
                        <p className="text-xs text-slate-600 line-clamp-2">{item.description}</p>
                      )}
                      {item.project_url && (
                        <a
                          href={item.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#008A7B] hover:underline"
                        >
                          <span>{__('View Project')}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 italic py-4">{__('No portfolio projects added.')}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      {showInterviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 sm:p-7 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    {__('Schedule Candidate Interview')}
                  </h3>
                  <p className="text-xs text-slate-400 font-medium">
                    {__('A unique Google Meet link will be generated')}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInterviewModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-4">
              {/* Interview Date & Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Interview Date & Time')} *
                </label>
                <input
                  type="datetime-local"
                  required
                  min={getMinDateTime()}
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B] transition-all"
                />
              </div>

              {/* Notes or agenda */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Interview Notes / Agenda (Optional)')}
                </label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder={__('e.g., Technical discussion, portfolio review...')}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B] transition-all"
                />
              </div>

              {/* Meeting Link Field */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">
                    {__('Meeting Link (Google Meet / Zoom)')} *
                  </label>
                  <a
                    href="https://meet.google.com/new"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-extrabold text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>{__('Create Real Google Meet Room')}</span>
                  </a>
                </div>
                <input
                  type="url"
                  required
                  placeholder="https://meet.google.com/xxx-yyyy-zzz"
                  value={customLink}
                  onChange={(e) => setCustomLink(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500 transition-all font-mono"
                />
                <p className="text-[11px] text-slate-500 font-medium mt-1">
                  {__('Click "Create Real Google Meet Room" to instantly open a live meeting and paste its URL here, or paste your own meeting link.')}
                </p>
              </div>

              {/* Quick Info Box */}
              <div className="p-3 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-2.5">
                <Video className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-[11px] text-blue-800 font-medium leading-relaxed">
                  {__(
                    'This meeting link will be shared with the candidate and displayed directly in their dashboard with a one-click join button.'
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowInterviewModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                >
                  {__('Cancel')}
                </button>
                <button
                  type="submit"
                  disabled={schedulingInterview}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>{schedulingInterview ? __('Saving...') : __('Save & Share Meeting')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

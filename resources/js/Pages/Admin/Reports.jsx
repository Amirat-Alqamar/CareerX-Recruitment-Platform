import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  FileBarChart,
  Briefcase,
  Users,
  Building2,
  TrendingUp,
  Send,
  Award,
  Layers,
  PieChart,
  CheckCircle2,
  Activity,
  Globe,
  MapPin,
  Clock,
  UserCheck,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function AdminReports({
  summary = {},
  jobsByStatus = {},
  jobsByWorkType = {},
  jobsByJobType = {},
  topCategories = [],
  topSkills = [],
  topCompanies = [],
  applicationsByStatus = {},
  seekerProfileStats = {},
}) {
  const { __, locale, isRtl } = useTranslation();

  const totalJobs = summary.totalJobs || 0;
  const totalApps = summary.totalApplications || 0;

  const appStatusList = [
    { key: 'applied', label: __('Applied'), count: applicationsByStatus.applied || 0, color: 'bg-blue-500' },
    { key: 'reviewed', label: __('Review'), count: applicationsByStatus.reviewed || 0, color: 'bg-indigo-500' },
    { key: 'interview', label: __('Interview'), count: applicationsByStatus.interview || 0, color: 'bg-amber-500' },
    { key: 'interview_success', label: __('Success Interview'), count: applicationsByStatus.interview_success || 0, color: 'bg-emerald-500' },
    { key: 'interview_failed', label: __('Failed Interview'), count: applicationsByStatus.interview_failed || 0, color: 'bg-rose-400' },
    { key: 'rejected', label: __('Rejected'), count: applicationsByStatus.rejected || 0, color: 'bg-rose-600' },
  ];

  return (
    <DashboardLayout userRole="admin">
      <Head title={__('Platform Reports & Analytics') + ' - CareerX'} />

      <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {__('Platform Analytics & Deep Reports')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {__('Comprehensive reporting on job postings, candidate demand, corporate recruitment, and industry trends')}
            </p>
          </div>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            🖨️ {__('Print / Export Report')}
          </button>
        </div>

        {/* Top Summary Metric Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block">{__('Total Jobs Posted')}</span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900">{totalJobs}</span>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block">{__('Total Applications')}</span>
            <span className="text-2xl sm:text-3xl font-black text-[#008A7B]">{totalApps}</span>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block">{__('Active Companies')}</span>
            <span className="text-2xl sm:text-3xl font-black text-indigo-600">{summary.totalCompanies || 0}</span>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block">{__('Job Seekers')}</span>
            <span className="text-2xl sm:text-3xl font-black text-blue-600">{summary.totalSeekers || 0}</span>
          </div>
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 block">{__('Employer Accounts')}</span>
            <span className="text-2xl sm:text-3xl font-black text-purple-600">{summary.totalEmployers || 0}</span>
          </div>
        </div>

        {/* Section 1: Top In-Demand Careers (أكثر الأعمال المطلوبة) & In-Demand Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top In-Demand Categories */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-[#E6F8F6] text-[#014D55]">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {__('Most In-Demand Careers & Sectors')}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {__('Ranked by job listings volume & candidate application rate')}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {topCategories.length > 0 ? (
                topCategories.map((cat, idx) => {
                  const maxJobs = Math.max(...topCategories.map((c) => c.jobs_count || 1), 1);
                  const pct = Math.min(Math.round(((cat.jobs_count || 0) / maxJobs) * 100), 100);

                  return (
                    <div key={cat.id || idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] flex items-center justify-center font-black">
                            #{idx + 1}
                          </span>
                          <span className="text-slate-800">{cat.name}</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                          <span>{cat.jobs_count} {__('Jobs')}</span>
                          <span className="text-[#008A7B] font-extrabold">{cat.applications_count} {__('Applications')}</span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#014D55] via-[#008A7B] to-emerald-400 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(pct, 10)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="py-6 text-center text-xs text-slate-400">{__('No data available.')}</p>
              )}
            </div>
          </div>

          {/* Top In-Demand Skills */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {__('Top In-Demand Skills Ranking')}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {__('Skills most frequently required by employers')}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {topSkills.length > 0 ? (
                topSkills.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-slate-800 block truncate">{s.name}</span>
                      <span className="text-[10px] text-slate-400 font-semibold">{s.jobs_count} {__('jobs')}</span>
                    </div>
                    <span className="text-[11px] font-black text-purple-600 bg-purple-100 px-2 py-0.5 rounded-lg shrink-0">
                      #{idx + 1}
                    </span>
                  </div>
                ))
              ) : (
                <p className="col-span-full py-6 text-center text-xs text-slate-400">{__('No skills recorded.')}</p>
              )}
            </div>
          </div>
        </div>

        {/* Section 2: Job Posts Distribution (تقارير عن الوظائف) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Jobs by Status */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">{__('Jobs by Status')}</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-bold">
                <span>{__('Published & Active')}</span>
                <span className="font-black text-sm">{jobsByStatus.published || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50 text-amber-800 text-xs font-bold">
                <span>{__('Pending Moderation')}</span>
                <span className="font-black text-sm">{jobsByStatus.pending || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-rose-50 text-rose-800 text-xs font-bold">
                <span>{__('Closed')}</span>
                <span className="font-black text-sm">{jobsByStatus.closed || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-100 text-slate-700 text-xs font-bold">
                <span>{__('Drafts')}</span>
                <span className="font-black text-sm">{jobsByStatus.draft || 0}</span>
              </div>
            </div>
          </div>

          {/* Jobs by Work Type */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">{__('Work Environment')}</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50 text-blue-800 text-xs font-bold">
                <span>📍 {__('On-Site')}</span>
                <span className="font-black text-sm">{jobsByWorkType.on_site || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-indigo-50 text-indigo-800 text-xs font-bold">
                <span>🌐 {__('Remote')}</span>
                <span className="font-black text-sm">{jobsByWorkType.remote || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-purple-50 text-purple-800 text-xs font-bold">
                <span>🔄 {__('Hybrid')}</span>
                <span className="font-black text-sm">{jobsByWorkType.hybrid || 0}</span>
              </div>
            </div>
          </div>

          {/* Jobs by Contract Type */}
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">{__('Employment Contract Type')}</h3>
            <div className="space-y-2.5">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 text-xs font-bold">
                <span>💼 {__('Full Time')}</span>
                <span className="font-black text-sm">{jobsByJobType.full_time || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 text-xs font-bold">
                <span>⏱️ {__('Part Time')}</span>
                <span className="font-black text-sm">{jobsByJobType.part_time || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 text-xs font-bold">
                <span>🚀 {__('Freelance')}</span>
                <span className="font-black text-sm">{jobsByJobType.freelance || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-slate-800 text-xs font-bold">
                <span>🎓 {__('Internship')}</span>
                <span className="font-black text-sm">{jobsByJobType.internship || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Companies & Candidate Applications Funnel (إحصائيات الشركات والمتقدمين) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Hiring Companies */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {__('Top Hiring Companies')}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {__('Companies with most active job listings & applications received')}
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {topCompanies.length > 0 ? (
                topCompanies.map((c) => (
                  <div key={c.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      {c.logo ? (
                        <img
                          src={c.logo}
                          alt={c.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-[#014D55] text-white text-xs font-bold flex items-center justify-center shrink-0">
                          {c.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="text-xs font-black text-slate-900 block truncate">{c.name}</span>
                        <span className="text-[11px] text-slate-400 block truncate">{c.industry}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 text-xs font-bold">
                      <span className="px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200 text-slate-700">
                        {c.jobs_count} {__('Jobs')}
                      </span>
                      <span className="px-2.5 py-1 rounded-xl bg-[#E6F8F6] text-[#008A7B]">
                        {c.applications_count} {__('Applicants')}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-slate-400">{__('No companies recorded.')}</p>
              )}
            </div>
          </div>

          {/* Candidate Applications Funnel */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-2.5 rounded-2xl bg-emerald-50 text-[#008A7B]">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900">
                  {__('Candidate Application Pipeline')}
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  {__('Status conversion of submitted job applications')}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {appStatusList.map((st) => {
                const pct = totalApps > 0 ? Math.round((st.count / totalApps) * 100) : 0;
                return (
                  <div key={st.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-700">{st.label}</span>
                      <span className="text-slate-900">
                        {st.count} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${st.color} rounded-full transition-all duration-500`}
                        style={{ width: `${Math.max(pct, st.count > 0 ? 4 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

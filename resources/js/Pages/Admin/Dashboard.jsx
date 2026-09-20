import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import {
  Users,
  Briefcase,
  Building2,
  Send,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  TrendingUp,
  Sparkles,
  Layers,
  ChevronRight,
  ChevronLeft,
  Eye,
  AlertCircle,
  FileBarChart,
  UserCheck,
  Building,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function AdminDashboard({
  stats = {},
  pendingApprovals = [],
  topCategories = [],
  topSkills = [],
  recentJobs = [],
  recentUsers = [],
}) {
  const { __, locale, isRtl } = useTranslation();
  const { flash } = usePage().props;

  const kpis = [
    {
      title: __('Total Users'),
      value: stats.total_users || 0,
      sub: `${stats.total_seekers || 0} ${__('Seekers')} · ${stats.total_employers || 0} ${__('Employers')}`,
      icon: Users,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      badgeColor: 'bg-blue-500/10 text-blue-700',
      link: `/${locale}/admin/users`,
    },
    {
      title: __('Companies Registered'),
      value: stats.total_companies || 0,
      sub: __('Active recruitment accounts'),
      icon: Building2,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
      badgeColor: 'bg-indigo-500/10 text-indigo-700',
      link: `/${locale}/admin/reports`,
    },
    {
      title: __('Total Jobs Posted'),
      value: stats.total_jobs || 0,
      sub: `${stats.active_jobs || 0} ${__('Active')} · ${stats.closed_jobs || 0} ${__('Closed')}`,
      icon: Briefcase,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      badgeColor: 'bg-emerald-500/10 text-emerald-700',
      link: `/${locale}/admin/jobs`,
    },
    {
      title: __('Pending Approvals'),
      value: stats.pending_jobs || 0,
      sub: __('Awaiting moderation review'),
      icon: ShieldCheck,
      color: stats.pending_jobs > 0 ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-slate-50 text-slate-500 border-slate-100',
      badgeColor: stats.pending_jobs > 0 ? 'bg-amber-500/10 text-amber-700 animate-pulse' : 'bg-slate-100 text-slate-600',
      link: `/${locale}/admin/pending-jobs`,
    },
    {
      title: __('Total Applications'),
      value: stats.total_applications || 0,
      sub: `${stats.hired_applications || 0} ${__('Accepted')} (${stats.hiring_rate || 0}%)`,
      icon: Send,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      badgeColor: 'bg-purple-500/10 text-purple-700',
      link: `/${locale}/admin/reports`,
    },
  ];

  return (
    <DashboardLayout userRole="admin">
      <Head title={__('Admin Overview') + ' - CareerX'} />

      <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-fade-in">
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

        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r rtl:bg-gradient-to-l from-[#03444B] via-[#026E78] to-[#009B99] p-6 sm:p-8 lg:p-10 text-white shadow-xl shadow-teal-950/10 border border-teal-500/20">
          <div className="absolute -right-12 -top-12 w-72 h-72 rounded-full bg-white/15 blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-80 h-80 rounded-full bg-[#00B7B5]/25 blur-3xl pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_65%)] pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2.5 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-teal-100 text-xs font-bold tracking-wide border border-white/20 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-teal-200" />
                <span>{__('System Administrator Portal')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-xs">
                {__('Platform Command Center')}
              </h1>
              <p className="text-teal-50/90 text-xs sm:text-sm font-medium leading-relaxed max-w-xl">
                {__('Monitor recruitment analytics, moderate job postings, manage platform users, and track top demanded careers in real time.')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href={`/${locale}/admin/pending-jobs`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                <ShieldCheck className="w-4 h-4 text-slate-900" />
                <span>{__('Pending Approvals')}</span>
                {stats.pending_jobs > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/15 text-slate-900 text-[11px] font-black">
                    {stats.pending_jobs}
                  </span>
                )}
              </Link>
              <Link
                href={`/${locale}/admin/reports`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white border border-white/25 font-bold text-xs backdrop-blur-md transition-all shadow-xs active:scale-95"
              >
                <FileBarChart className="w-4 h-4 text-teal-200" />
                <span>{__('View Reports')}</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {kpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Link
                key={index}
                href={kpi.link}
                className="group relative bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl border ${kpi.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold ${kpi.badgeColor}`}>
                    {kpi.title}
                  </span>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {kpi.value.toLocaleString()}
                  </h3>
                  <p className="text-xs text-slate-400 font-semibold mt-1 truncate">
                    {kpi.sub}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-[#008A7B]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    {__('Most In-Demand Careers & Sectors')}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {__('Job categories with highest postings and candidate volume')}
                  </p>
                </div>
              </div>
              <Link
                href={`/${locale}/admin/reports`}
                className="text-xs font-bold text-[#008A7B] hover:underline"
              >
                {__('View Details')}
              </Link>
            </div>

            <div className="space-y-4">
              {topCategories.length > 0 ? (
                topCategories.map((cat, idx) => {
                  const maxJobs = Math.max(...topCategories.map((c) => c.jobs_count || 1), 1);
                  const percentage = Math.min(Math.round(((cat.jobs_count || 0) / maxJobs) * 100), 100);

                  return (
                    <div key={cat.id || idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-800">{cat.name}</span>
                        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                          <span>{cat.jobs_count} {__('Jobs')}</span>
                          <span>·</span>
                          <span className="text-[#008A7B]">{cat.applications_count} {__('Applicants')}</span>
                        </div>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#014D55] to-[#008A7B] rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percentage, 8)}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-400 text-xs">
                  {__('No category data available yet.')}
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-black text-slate-900">
                    {__('Top In-Demand Skills')}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {__('Most requested in job posts')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {topSkills.length > 0 ? (
                  topSkills.map((skill) => (
                    <span
                      key={skill.id}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-[#E6F8F6] text-slate-700 hover:text-[#014D55] border border-slate-200/80 text-xs font-bold transition-colors cursor-default"
                    >
                      <span>{skill.name}</span>
                      <span className="px-1.5 py-0.5 rounded-md bg-white text-[10px] text-slate-500 font-black shadow-xs">
                        {skill.jobs_count}
                      </span>
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 py-4">{__('No skills recorded yet.')}</p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                href={`/${locale}/admin/reports`}
                className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>{__('View Full Skills Matrix')}</span>
                {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Briefcase className="w-5 h-5 text-[#008A7B]" />
                <h2 className="text-base font-black text-slate-900">
                  {__('Recent Job Postings')}
                </h2>
              </div>
              <Link
                href={`/${locale}/admin/jobs`}
                className="text-xs font-bold text-[#008A7B] hover:underline"
              >
                {__('Manage All Jobs')}
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentJobs.length > 0 ? (
                recentJobs.map((j) => (
                  <div key={j.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {j.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                        {j.company_name} · {j.category}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          j.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700'
                            : j.status === 'pending'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {j.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {j.created_at}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-slate-400">
                  {__('No job postings yet.')}
                </p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Users className="w-5 h-5 text-blue-600" />
                <h2 className="text-base font-black text-slate-900">
                  {__('Recent Registered Users')}
                </h2>
              </div>
              <Link
                href={`/${locale}/admin/users`}
                className="text-xs font-bold text-[#008A7B] hover:underline"
              >
                {__('Manage All Users')}
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentUsers.length > 0 ? (
                recentUsers.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {u.avatar ? (
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-slate-200"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-slate-800 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {u.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-medium truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                          u.role === 'admin'
                            ? 'bg-rose-50 text-rose-700'
                            : u.role === 'employer'
                            ? 'bg-purple-50 text-purple-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {u.role}
                      </span>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          u.status ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        title={u.status ? __('Active') : __('Banned')}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-slate-400">
                  {__('No users registered yet.')}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

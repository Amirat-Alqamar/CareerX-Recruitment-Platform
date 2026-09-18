import React from 'react';
import useTranslation from '@/hooks/useTranslation';

export default function SidebarProfile({ user, isCollapsed = false }) {
  const { __, locale } = useTranslation();
  const isEmployer = user?.role === 'employer';
  const isAdmin = user?.role === 'admin';
  const name = isAdmin
    ? (user?.name || __('Administrator'))
    : isEmployer
    ? (user?.company?.name || user?.name || __('Company Account'))
    : (user?.name || __('Guest Seeker'));

  const initials = name
    ? name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : (isAdmin ? 'AD' : isEmployer ? 'CO' : 'CX');

  const headline = isAdmin
    ? __('Administrator')
    : isEmployer
    ? __('Employer')
    : (user?.headline || __('Job Seeker'));

  if (isCollapsed) {
    return (
      <div className="p-3 border-b border-slate-100 flex justify-center">
        <div
          className={`w-10 h-10 rounded-full ${isAdmin ? 'bg-[#014D55]' : isEmployer ? 'bg-[#008A7B]' : 'bg-[#014D55]'} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm cursor-pointer`}
          title={`${name} (${headline})`}
        >
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 border-b border-slate-100">
      <div className={`w-10 h-10 rounded-full ${isAdmin ? 'bg-[#014D55]' : isEmployer ? 'bg-[#008A7B]' : 'bg-[#014D55]'} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
        {initials}
      </div>
      <div className="overflow-hidden flex-1">
        <h4 className="font-bold text-slate-900 text-sm truncate">{__(name)}</h4>
        <p className="text-xs text-slate-400 font-medium truncate">
          {headline}
        </p>
      </div>
    </div>
  );
}

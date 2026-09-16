import React from 'react';
import useTranslation from '@/hooks/useTranslation';

export default function SidebarProfile({ user, isCollapsed = false }) {
  const { __, locale } = useTranslation();
  const isEmployer = user?.role === 'employer';
  const name = user?.name || (isEmployer ? __('Company Account') : __('Guest Seeker'));
  const initials = user?.name
    ? user.name
        .trim()
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : (isEmployer ? 'CO' : 'CX');

  const headline = isEmployer
    ? (user?.company?.name || __('Company / Employer'))
    : (user?.headline || __('Job Seeker'));

  if (isCollapsed) {
    return (
      <div className="p-3 border-b border-slate-100 flex justify-center">
        <div
          className={`w-10 h-10 rounded-full ${isEmployer ? 'bg-[#008A7B]' : 'bg-[#014D55]'} text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-sm cursor-pointer`}
          title={`${name} (${headline})`}
        >
          {initials}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-4 border-b border-slate-100">
      <div className={`w-10 h-10 rounded-full ${isEmployer ? 'bg-[#008A7B]' : 'bg-[#014D55]'} text-white font-bold text-sm flex items-center justify-center shrink-0`}>
        {initials}
      </div>
      <div className="overflow-hidden flex-1">
        <h4 className="font-bold text-slate-900 text-sm truncate">{name}</h4>
        <div className="flex items-center justify-between gap-1">
          <p className="text-xs text-slate-400 font-medium truncate">
            {headline}
          </p>
          {user && (
            <a
              href={isEmployer ? `/${locale}/employer/company/edit` : `/${locale}/job-seeker/profile/edit`}
              className="text-[10px] text-[#008A7B] font-bold hover:underline shrink-0"
              title={isEmployer ? __('Edit Company Profile') : __('Edit Profile')}
            >
              {isEmployer ? __('Edit') : (!user?.headline ? `+${__('Add')}` : '')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}



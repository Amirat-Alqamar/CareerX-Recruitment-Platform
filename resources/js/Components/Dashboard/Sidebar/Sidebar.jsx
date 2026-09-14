import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import SidebarProfile from './SidebarProfile';
import SidebarNavGroup from './SidebarNavGroup';
import { seekerNavigation, employerNavigation } from '@/Data/navigationData';
import useTranslation from '@/hooks/useTranslation';

export default function Sidebar({ userRole }) {
  const { auth } = usePage().props;
  const { __, isRtl, locale } = useTranslation();
  const currentRole = userRole || auth?.user?.role || 'job_seeker';
  const navigation = currentRole === 'employer' ? employerNavigation : seekerNavigation;

  return (
    <aside className="w-64 bg-white border-r rtl:border-r-0 rtl:border-l border-slate-100 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
      <div className="overflow-y-auto flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <Link href={`/${locale}`} className="flex items-center shrink-0">
            <img
              src="/images/careerX-logo.webp"
              alt="CareerX"
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button type="button" className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
            {isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* User Info Card */}
        <SidebarProfile user={auth?.user} />

        {/* Dynamic Navigation Groups */}
        <SidebarNavGroup navigation={navigation} />
      </div>

      {/* Sign Out Action */}
      <div className="p-4 border-t border-slate-100">
        <Link
          href={typeof route !== 'undefined' && route().has('logout') ? route('logout') : '/logout'}
          method="post"
          as="button"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
        >
          <LogOut className="w-4 h-4 rtl:rotate-180" />
          <span>{__('Sign Out')}</span>
        </Link>
      </div>
    </aside>
  );
}

import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import SidebarProfile from './SidebarProfile';
import SidebarNavGroup from './SidebarNavGroup';
import { seekerNavigation, employerNavigation } from '@/Data/navigationData';
import useTranslation from '@/hooks/useTranslation';

export default function Sidebar({
  userRole,
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const { auth } = usePage().props;
  const { __, isRtl, locale } = useTranslation();
  const currentRole = userRole || auth?.user?.role || 'job_seeker';
  const navigation = currentRole === 'employer' ? employerNavigation : seekerNavigation;

  const mobileTransform = isOpen
    ? 'translate-x-0'
    : isRtl
    ? 'translate-x-full'
    : '-translate-x-full';

  const handleToggleClick = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (onClose) onClose();
    } else {
      if (onToggleCollapse) onToggleCollapse();
    }
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 start-0 z-50 bg-white border-r rtl:border-r-0 rtl:border-l border-slate-100 flex flex-col justify-between h-screen shrink-0 select-none shadow-2xl lg:shadow-none transition-all duration-300 ease-in-out lg:translate-x-0 ${mobileTransform} ${
          isCollapsed ? 'w-72 lg:w-20' : 'w-72 lg:w-64'
        }`}
      >
        <div className="overflow-y-auto flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Brand Header */}
          <div
            className={`p-4 border-b border-slate-100 flex items-center transition-all ${
              isCollapsed ? 'justify-center flex-col gap-3' : 'justify-between'
            }`}
          >
            <Link href={`/${locale}`} className="flex items-center shrink-0" title="CareerX">
              {isCollapsed ? (
                <div className="w-9 h-9 rounded-xl bg-[#014D55] text-white font-black text-sm flex items-center justify-center shadow-xs">
                  CX
                </div>
              ) : (
                <img
                  src="/images/careerX-logo.webp"
                  alt="CareerX"
                  className="h-8 w-auto object-contain"
                />
              )}
            </Link>

            <button
              type="button"
              onClick={handleToggleClick}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              title={
                isCollapsed
                  ? __('Expand Sidebar')
                  : __('Collapse Sidebar')
              }
            >
              {isRtl ? (
                isCollapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
              ) : (
                isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* User Info Card */}
          <SidebarProfile user={auth?.user} isCollapsed={isCollapsed} />

          {/* Dynamic Navigation Groups */}
          <SidebarNavGroup
            navigation={navigation}
            onItemClick={onClose}
            isCollapsed={isCollapsed}
          />
        </div>

        {/* Sign Out Action */}
        <div className={`p-4 border-t border-slate-100 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <Link
            href={typeof route !== 'undefined' && route().has('logout') ? route('logout') : '/logout'}
            method="post"
            as="button"
            className={`flex items-center ${
              isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2.5 w-full'
            } rounded-xl font-bold text-sm text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer`}
            title={__('Sign Out')}
          >
            <LogOut className="w-4 h-4 rtl:rotate-180 shrink-0" />
            {!isCollapsed && <span>{__('Sign Out')}</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}

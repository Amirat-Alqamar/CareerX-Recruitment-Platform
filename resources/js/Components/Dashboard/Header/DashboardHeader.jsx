import React, { useState, useRef, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react';
import {
  Bell,
  Globe,
  ChevronDown,
  Check,
  ArrowLeft,
  ArrowRight,
  Menu,
  ShieldCheck,
} from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';
import TwoFactorModal from '@/Components/Dashboard/Common/TwoFactorModal';

export default function DashboardHeader({ onToggleSidebar }) {
  const { auth } = usePage().props;
  const { __, locale, isRtl, locales } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [twoFactorModalOpen, setTwoFactorModalOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userRole = auth?.user?.role || 'job_seeker';
  const unreadCount = auth?.unread_notifications_count ?? 0;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'CX';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userInitials = auth?.user?.name ? getInitials(auth.user.name) : 'CX';

  return (
    <header className="w-full bg-white border-b border-slate-100 px-4 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
      {/* Start / Left Actions (Menu Toggle + Home Link) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Menu Toggle Button */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-primary hover:bg-slate-100 transition-colors cursor-pointer"
          title={__('Toggle Navigation Menu')}
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#008A7B] transition-colors"
        >
          {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{__('Home')}</span>
        </Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Language Switcher */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title={__('Language')}
          >
            <Globe className="w-3.5 h-3.5 text-primary" />
            <span className="uppercase">{locale}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
              {(locales.length > 0
                ? locales
                : [
                    { code: 'en', native: 'English', url: '/en/seeker/dashboard' },
                    { code: 'ar', native: 'العربية', url: '/ar/seeker/dashboard' },
                  ]
              ).map((loc) => (
                <a
                  key={loc.code}
                  href={loc.url}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-50 ${
                    locale === loc.code ? 'text-[#008A7B] font-bold bg-[#E6F8F6]' : 'text-slate-700'
                  }`}
                >
                  <span>{loc.native}</span>
                  {locale === loc.code && <Check className="w-3.5 h-3.5 text-[#008A7B]" />}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* 2FA Security Link */}
        <Link
          href={`/${locale}/2fa`}
          className={`p-2 rounded-full transition-colors ${
            auth?.user?.two_factor_enabled
              ? 'text-[#008A7B] bg-teal-50 hover:bg-teal-100 ring-1 ring-teal-200'
              : 'text-slate-500 hover:text-[#008A7B] hover:bg-slate-100'
          }`}
          title={auth?.user?.two_factor_enabled ? __('2FA Security (Active)') : __('Two-Factor Authentication')}
        >
          <ShieldCheck className="w-5 h-5 stroke-[1.75]" />
        </Link>

        {/* Direct Notifications Link with Counter Badge */}
        <Link
        href={`/${locale}/notifications`}
        className="relative p-2 text-slate-500 hover:text-[#008A7B] hover:bg-slate-100 rounded-full transition-colors focus:outline-none"
        aria-label={__('Notifications')}
        title={__('Notifications')}
        >
        <Bell className="w-5 h-5 stroke-[1.75]" />
        {unreadCount > 0 && (
            <span className="absolute -top-0.5 end-0.5 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-2 ring-white shadow-xs pointer-events-none">
            {unreadCount > 99 ? '99+' : unreadCount}
            </span>
        )}
        </Link>

        {/* User Avatar Circle */}
        <Link
          href={
            userRole === 'admin'
              ? `/${locale}/admin/dashboard`
              : userRole === 'employer'
              ? `/${locale}/employer/company`
              : `/${locale}/seeker/profile`
          }
          className="w-9 h-9 rounded-full bg-[#014D55] text-white font-semibold text-xs flex items-center justify-center tracking-wider select-none shadow-sm hover:opacity-90 transition-opacity"
          title={auth?.user?.name || (userRole === 'admin' ? __('Admin Panel') : __('My Profile'))}
        >
          {userInitials}
        </Link>
      </div>

      <TwoFactorModal
        isOpen={twoFactorModalOpen}
        onClose={() => setTwoFactorModalOpen(false)}
      />
    </header>
  );
}

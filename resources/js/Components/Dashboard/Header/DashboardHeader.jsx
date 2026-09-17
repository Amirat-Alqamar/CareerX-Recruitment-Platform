import React, { useState, useRef, useEffect } from 'react';
import { usePage, Link, router } from '@inertiajs/react';
import {
  Bell,
  Globe,
  ChevronDown,
  Check,
  ArrowLeft,
  ArrowRight,
  Menu,
  Send,
  Bookmark,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  Clock,
  Briefcase,
} from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function DashboardHeader({ onToggleSidebar }) {
  const { auth } = usePage().props;
  const { __, locale, isRtl, locales } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userRole = auth?.user?.role || 'job_seeker';

  // Notifications dropdown state
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsDropdownRef = useRef(null);

  const dbNotifications = auth?.notifications || [];
  const dbUnreadCount = auth?.unread_notifications_count ?? 0;

  const getFallbackNotifications = () => {
    if (userRole === 'admin') {
      return [
        {
          id: 'fb-1',
          title: __('Pending Job Approvals'),
          message: __('New job postings are awaiting your review and approval.'),
          time: __('Just now'),
          unread: true,
          link: `/${locale}/admin/pending-jobs`,
          type: 'admin_pending',
        },
      ];
    }
    if (userRole === 'employer') {
      return [
        {
          id: 'fb-1',
          title: __('Applicant Updates'),
          message: __('Review new candidate applications received for your posted jobs.'),
          time: __('Recently'),
          unread: false,
          link: `/${locale}/employer/applicants`,
          type: 'applications',
        },
      ];
    }
    return [
      {
        id: 'fb-1',
        title: __('Track Applications'),
        message: __('View updates and status changes on your job applications.'),
        time: __('Recently'),
        unread: false,
        link: `/${locale}/job-seeker/applications`,
        type: 'applications',
      },
    ];
  };

  const notifications = dbNotifications.length > 0 ? dbNotifications : getFallbackNotifications();
  const unreadCount = dbNotifications.length > 0 ? dbUnreadCount : notifications.filter((n) => n.unread).length;

  const markAllAsRead = () => {
    router.post(`/${locale}/notifications/read-all`, {}, { preserveScroll: true });
  };

  const clearAllNotifications = () => {
    router.post(`/${locale}/notifications/clear`, {}, { preserveScroll: true });
  };

  const handleNotificationClick = (item) => {
    setNotificationsOpen(false);
    if (item.id && !String(item.id).startsWith('fb-')) {
      router.post(`/${locale}/notifications/${item.id}/read`, {}, { preserveScroll: true });
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
      if (
        notificationsDropdownRef.current &&
        !notificationsDropdownRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
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
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:text-[#008A7B] hover:bg-slate-100 transition-colors cursor-pointer"
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
            onClick={() => {
              setLangDropdownOpen(!langDropdownOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title={__('Language')}
          >
            <Globe className="w-3.5 h-3.5 text-[#008A7B]" />
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

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsDropdownRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setLangDropdownOpen(false);
            }}
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors focus:outline-none cursor-pointer"
            aria-label={__('Notifications')}
            title={__('Notifications')}
          >
            <Bell className="w-5 h-5 stroke-[1.75]" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 rtl:right-auto rtl:left-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between px-4 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-slate-900 text-sm">{__('Notifications')}</h4>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 text-[10px] font-extrabold">
                      {unreadCount} {__('New')}
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllAsRead}
                    className="text-[11px] font-bold text-[#008A7B] hover:underline cursor-pointer"
                  >
                    {__('Mark all as read')}
                  </button>
                )}
              </div>

              {/* Body */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {notifications.length > 0 ? (
                  notifications.map((item) => (
                    <Link
                      key={item.id}
                      href={item.link || '#'}
                      onClick={() => handleNotificationClick(item)}
                      className={`flex items-start gap-3 p-3.5 hover:bg-slate-50 transition-colors cursor-pointer block ${
                        item.unread ? 'bg-slate-50/60' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          item.type === 'job_approved' || item.type === 'interview_scheduled'
                            ? 'bg-emerald-50 text-emerald-600'
                            : item.type === 'job_rejected'
                            ? 'bg-rose-50 text-rose-600'
                            : item.type === 'job_pending_approval' || item.type === 'admin_pending'
                            ? 'bg-amber-50 text-amber-600'
                            : item.type === 'new_application' || item.type === 'applications'
                            ? 'bg-[#E6F8F6] text-[#008A7B]'
                            : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {(item.type === 'job_pending_approval' || item.type === 'admin_pending') && <ShieldCheck className="w-4 h-4" />}
                        {item.type === 'job_approved' && <CheckCircle2 className="w-4 h-4" />}
                        {item.type === 'job_rejected' && <AlertCircle className="w-4 h-4" />}
                        {item.type === 'interview_scheduled' && <Clock className="w-4 h-4" />}
                        {(item.type === 'new_application' || item.type === 'applications') && <Send className="w-4 h-4" />}
                        {item.type === 'saved' && <Bookmark className="w-4 h-4" />}
                        {item.type === 'profile' && <CheckCircle2 className="w-4 h-4" />}
                        {!['job_pending_approval', 'admin_pending', 'job_approved', 'job_rejected', 'interview_scheduled', 'new_application', 'applications', 'saved', 'profile'].includes(item.type) && <Bell className="w-4 h-4" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h5 className="text-xs font-bold text-slate-900 truncate">
                            {item.title}
                          </h5>
                          <span className="text-[10px] font-medium text-slate-400 shrink-0">
                            {item.time}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                          {item.message}
                        </p>
                      </div>

                      {item.unread && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#008A7B] shrink-0 mt-2" />
                      )}
                    </Link>
                  ))
                ) : (
                  <div className="py-8 text-center text-slate-400 space-y-2">
                    <Bell className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-xs font-semibold">{__('No notifications right now')}</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={clearAllNotifications}
                    className="text-[11px] text-slate-400 hover:text-rose-600 font-semibold transition-colors cursor-pointer"
                  >
                    {__('Clear all')}
                  </button>
                  <Link
                    href={`/${locale}/notifications`}
                    onClick={() => setNotificationsOpen(false)}
                    className="text-[11px] text-[#008A7B] font-bold hover:underline"
                  >
                    {__('View All')}
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

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
    </header>
  );
}


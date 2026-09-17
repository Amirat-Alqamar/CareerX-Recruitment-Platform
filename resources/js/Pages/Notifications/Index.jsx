import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Send,
  Bookmark,
  Eye,
  Check,
  Trash2,
  ExternalLink,
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function NotificationsIndex({ notifications = {}, unreadCount = 0, totalCount = 0 }) {
  const { auth, flash } = usePage().props;
  const { __, locale, isRtl } = useTranslation();
  const userRole = auth?.user?.role || 'job_seeker';

  const [selectedNotification, setSelectedNotification] = useState(null);

  const items = notifications.data || [];

  const handleOpenDetailModal = (item) => {
    setSelectedNotification(item);
    if (!item.is_read) {
      router.post(
        `/${locale}/notifications/${item.id}/read`,
        {},
        { preserveScroll: true }
      );
      // Mark local state as read
      item.is_read = true;
    }
  };

  const handleMarkAllRead = () => {
    router.post(
      `/${locale}/notifications/read-all`,
      {},
      { preserveScroll: true }
    );
  };

  const handleClearAll = () => {
    if (confirm(__('Are you sure you want to clear all notifications?'))) {
      router.post(
        `/${locale}/notifications/clear`,
        {},
        { preserveScroll: true }
      );
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'job_pending_approval':
      case 'admin_pending':
        return <ShieldCheck className="w-5 h-5 text-amber-600" />;
      case 'job_approved':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'job_rejected':
        return <AlertCircle className="w-5 h-5 text-rose-600" />;
      case 'interview_scheduled':
        return <Clock className="w-5 h-5 text-indigo-600" />;
      case 'new_application':
      case 'applications':
        return <Send className="w-5 h-5 text-[#008A7B]" />;
      case 'saved':
        return <Bookmark className="w-5 h-5 text-amber-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'job_pending_approval':
      case 'admin_pending':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'job_approved':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'job_rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'interview_scheduled':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'new_application':
      case 'applications':
        return 'bg-[#E6F8F6] text-[#008A7B] border-[#008A7B]/20';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <DashboardLayout userRole={userRole}>
      <Head title={__('Notifications Center') + ' - CareerX'} />

      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
        {/* Flash messages */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-2xl bg-[#E6F8F6] text-[#008A7B] flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {__('Notifications Center')}
              </h1>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-black text-xs">
                  {unreadCount} {__('Unread')}
                </span>
              )}
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              {__('Review real-time alerts, job status updates, applications, and system messages.')}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-[#008A7B]" />
                <span>{__('Mark all as read')}</span>
              </button>
            )}

            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                <span>{__('Clear all')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {items.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-black uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 w-12 text-center">{__('Status')}</th>
                    <th className="px-6 py-4">{__('Notification')}</th>
                    <th className="px-6 py-4 w-44">{__('Received At')}</th>
                    <th className="px-6 py-4 w-32 text-center">{__('Action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => handleOpenDetailModal(item)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer group ${
                        !item.is_read ? 'bg-slate-50/40 font-semibold' : ''
                      }`}
                    >
                      {/* Status Indicator & Icon */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {!item.is_read && (
                            <span className="w-2 h-2 rounded-full bg-[#008A7B] animate-pulse shrink-0" title={__('Unread')} />
                          )}
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${getBadgeStyle(item.type)}`}>
                            {getIcon(item.type)}
                          </div>
                        </div>
                      </td>

                      {/* Content */}
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <h4 className={`text-sm text-slate-900 line-clamp-1 group-hover:text-[#008A7B] transition-colors ${!item.is_read ? 'font-black' : 'font-bold'}`}>
                            {item.title}
                          </h4>
                          <p className="text-xs text-slate-500 line-clamp-1 font-normal">
                            {item.message}
                          </p>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-700 block">{item.time_ago}</span>
                          <span className="text-[11px] text-slate-400 block">{item.created_at}</span>
                        </div>
                      </td>

                      {/* Single Action: View */}
                      <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => handleOpenDetailModal(item)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#E6F8F6] text-slate-700 hover:text-[#008A7B] border border-slate-200 hover:border-[#008A7B]/30 font-bold text-xs transition-all cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{__('View Details')}</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-700">{__('No notifications recorded yet.')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {__('When new actions occur, such as application status updates or job approvals, they will appear here.')}
              </p>
            </div>
          )}

          {/* Pagination Footer */}
          {notifications.links && notifications.links.length > 3 && (
            <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/50">
              <div className="text-xs text-slate-500 font-medium">
                {__('Showing')} {notifications.from || 0} {__('to')} {notifications.to || 0} {__('of')} {notifications.total || 0} {__('results')}
              </div>

              <div className="flex items-center gap-1.5">
                {notifications.links.map((link, idx) => {
                  const isPrev = link.label.includes('Previous') || link.label.includes('&laquo;');
                  const isNext = link.label.includes('Next') || link.label.includes('&raquo;');

                  return (
                    <Link
                      key={idx}
                      href={link.url || '#'}
                      preserveScroll
                      className={`min-w-8 h-8 px-2 rounded-xl text-xs font-bold flex items-center justify-center transition-all ${
                        link.active
                          ? 'bg-[#014D55] text-white shadow-sm'
                          : link.url
                          ? 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      {isPrev ? (
                        isRtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />
                      ) : isNext ? (
                        isRtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />
                      ) : (
                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Details Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div
            className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
              <div className="flex items-start gap-3">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shrink-0 ${getBadgeStyle(selectedNotification.type)}`}>
                  {getIcon(selectedNotification.type)}
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    {__('Notification Details')}
                  </span>
                  <h3 className="text-base sm:text-lg font-black text-slate-900">
                    {selectedNotification.title}
                  </h3>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">{__('Received At')}</span>
                  <span className="font-bold text-slate-800 mt-0.5 block">{selectedNotification.created_at || selectedNotification.time_ago}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100">
                  <span className="text-[11px] text-slate-400 block font-medium">{__('Status')}</span>
                  <span className="font-bold text-emerald-600 mt-0.5 block">{__('Read')}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 pt-2 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/30">
              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                {__('Close')}
              </button>

              {selectedNotification.link && (
                <Link
                  href={selectedNotification.link}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#014D55] hover:bg-[#008A7B] text-white font-bold text-xs transition-all shadow-md active:scale-95"
                  onClick={() => setSelectedNotification(null)}
                >
                  <span>{__('Open Relevant Page')}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

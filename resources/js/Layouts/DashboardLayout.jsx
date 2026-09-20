import React, { useState, useEffect } from 'react';
import Sidebar from '@/Components/Dashboard/Sidebar/Sidebar';
import DashboardHeader from '@/Components/Dashboard/Header/DashboardHeader';
import useTranslation from '@/hooks/useTranslation';

import { usePage, router } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function DashboardLayout({ children, userRole }) {
  const { auth, flash } = usePage().props;
  const { __, direction, locale } = useTranslation();
  const effectiveRole = auth?.user?.role || userRole || 'job_seeker';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (flash?.success || flash?.error) {
      setShowFlash(true);
      const timer = setTimeout(() => setShowFlash(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [flash]);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [direction, locale]);

  useEffect(() => {
    if (!auth?.user) return;

    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        router.reload({
          only: ['auth', 'notifications', 'unreadCount'],
          preserveScroll: true,
          preserveState: true,
        });
      }
    }, 6000);

    const handleFocus = () => {
      router.reload({
        only: ['auth', 'notifications', 'unreadCount'],
        preserveScroll: true,
        preserveState: true,
      });
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [auth?.user?.id]);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div dir={direction} className="h-screen bg-[#F8FAFC] flex text-slate-800 antialiased overflow-hidden relative">
      <Sidebar
        userRole={effectiveRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader onToggleSidebar={handleToggleSidebar} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {showFlash && (flash?.success || flash?.error) && (
        <div className="fixed top-5 right-5 rtl:right-auto rtl:left-5 z-50 max-w-md shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-white text-xs sm:text-sm font-semibold ${
              flash.success ? 'bg-[#008A7B] border-teal-600' : 'bg-red-600 border-red-700'
            }`}
          >
            {flash.success ? (
              <CheckCircle2 className="w-5 h-5 shrink-0 text-white" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0 text-white" />
            )}
            <span className="flex-1 leading-snug">{__(flash.success || flash.error)}</span>
            <button
              type="button"
              onClick={() => setShowFlash(false)}
              className="text-white/80 hover:text-white p-1 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


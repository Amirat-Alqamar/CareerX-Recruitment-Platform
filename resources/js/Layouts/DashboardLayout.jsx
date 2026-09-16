import React, { useState, useEffect } from 'react';
import Sidebar from '@/Components/Dashboard/Sidebar/Sidebar';
import DashboardHeader from '@/Components/Dashboard/Header/DashboardHeader';
import useTranslation from '@/hooks/useTranslation';

import { usePage } from '@inertiajs/react';

export default function DashboardLayout({ children, userRole }) {
  const { auth } = usePage().props;
  const { direction, locale } = useTranslation();
  const effectiveRole = auth?.user?.role || userRole || 'job_seeker';

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [direction, locale]);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  return (
    <div dir={direction} className="h-screen bg-[#F8FAFC] flex text-slate-800 antialiased overflow-hidden relative">
      {/* Isolated Reusable Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        userRole={effectiveRole}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <DashboardHeader onToggleSidebar={handleToggleSidebar} />
        <main className="p-4 sm:p-6 lg:p-8 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


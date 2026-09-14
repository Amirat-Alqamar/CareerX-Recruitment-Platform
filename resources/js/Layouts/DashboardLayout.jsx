import React, { useEffect } from 'react';
import Sidebar from '@/Components/Dashboard/Sidebar/Sidebar';
import DashboardHeader from '@/Components/Dashboard/Header/DashboardHeader';
import useTranslation from '@/hooks/useTranslation';

import { usePage } from '@inertiajs/react';

export default function DashboardLayout({ children, userRole }) {
  const { auth } = usePage().props;
  const { direction, locale } = useTranslation();
  const effectiveRole = auth?.user?.role || userRole || 'job_seeker';

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale;
  }, [direction, locale]);

  return (
    <div dir={direction} className="min-h-screen bg-[#F8FAFC] flex text-slate-800 antialiased">
      {/* Isolated Reusable Sidebar */}
      <Sidebar userRole={effectiveRole} />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader />
        <main className="p-6 sm:p-10 flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}


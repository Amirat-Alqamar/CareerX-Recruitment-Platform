import React from 'react';
import Sidebar from '@/Components/Dashboard/Sidebar/Sidebar';
import DashboardHeader from '@/Components/Dashboard/Header/DashboardHeader';

export default function DashboardLayout({ children, userRole = 'seeker' }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Isolated Reusable Sidebar */}
      <Sidebar userRole={userRole} />

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

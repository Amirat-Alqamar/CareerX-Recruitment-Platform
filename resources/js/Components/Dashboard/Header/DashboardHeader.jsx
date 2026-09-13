import React from 'react';
import { usePage } from '@inertiajs/react';
import { Bell } from 'lucide-react';

export default function DashboardHeader() {
  const { auth } = usePage().props;

  const getInitials = (name) => {
    if (!name) return 'SJ';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userInitials = auth?.user?.name ? getInitials(auth.user.name) : 'SJ';

  return (
    <header className="w-full bg-white border-b border-slate-100 px-8 py-4 flex items-center justify-end gap-5 sticky top-0 z-10">
      {/* Notifications Button with Red Indicator */}
      <button
        type="button"
        className="relative p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors focus:outline-none"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5 stroke-[1.75]" />
        {/* Red Dot */}
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
      </button>

      {/* User Avatar Circle */}
      <div className="w-9 h-9 rounded-full bg-[#014D55] text-white font-semibold text-xs flex items-center justify-center tracking-wider select-none shadow-sm">
        {userInitials}
      </div>
    </header>
  );
}

import React from 'react';

export default function SidebarProfile({ user }) {
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
    : 'SJ';

  return (
    <div className="flex items-center gap-3 p-4 border-b border-slate-100">
      <div className="w-10 h-10 rounded-full bg-[#014D55] text-white font-bold text-sm flex items-center justify-center shrink-0">
        {initials}
      </div>
      <div className="overflow-hidden">
        <h4 className="font-bold text-slate-900 text-sm truncate">{user?.name || 'Sarah Johnson'}</h4>
        <p className="text-xs text-slate-400 font-medium truncate">{user?.headline || 'UX Designer'}</p>
      </div>
    </div>
  );
}

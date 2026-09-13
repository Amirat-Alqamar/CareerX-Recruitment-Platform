import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function SidebarNavGroup({ navigation }) {
  const { url } = usePage(); // جلب الـ URL الحالي من Inertia

  return (
    <div className="p-4 space-y-6">
      {navigation.map((group, idx) => (
        <div key={idx} className="space-y-1.5">
          <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3">
            {group.group}
          </h5>
          <nav className="space-y-0.5">
            {group.items.map((item, itemIdx) => {
              const Icon = item.icon;

              // مسار افتراضي مؤقت بناءً على اسم المسار
              const targetPath = item.routeName ? `/${item.routeName.replace('.', '/')}` : '#';

              // التثبت إذا كانت الصفحة الحالية هي ذاتها
              const isActive = url.includes(item.routeName.replace('.', '/'));

              return (
                <Link
                  key={itemIdx}
                  href={targetPath}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-[#E6F8F6] text-[#008A7B]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#008A7B]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#014D55] text-white text-[11px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}

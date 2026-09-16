import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import useTranslation from '@/hooks/useTranslation';

export default function SidebarNavGroup({ navigation, onItemClick, isCollapsed = false }) {
  const { url } = usePage();
  const { __, locale } = useTranslation();

  return (
    <div className={`space-y-6 ${isCollapsed ? 'p-2' : 'p-4'}`}>
      {navigation.map((group, idx) => (
        <div key={idx} className="space-y-1.5">
          {!isCollapsed ? (
            <h5 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3">
              {__(group.group)}
            </h5>
          ) : (
            <div className="border-t border-slate-100 my-2 mx-1" />
          )}
          <nav className="space-y-1">
            {group.items.map((item, itemIdx) => {
              const Icon = item.icon;
              const targetPath = `/${locale}${item.path}`;
              const isActive = url.includes(item.path);

              const linkClasses = `flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'} rounded-xl font-semibold text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#E6F8F6] text-[#008A7B]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`;

              const content = (
                <>
                  <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#008A7B]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>{__(item.label)}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span className="w-5 h-5 rounded-full bg-[#014D55] text-white text-[11px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              );

              if (item.isBlade) {
                return (
                  <a
                    key={itemIdx}
                    href={targetPath}
                    onClick={onItemClick}
                    className={linkClasses}
                    title={isCollapsed ? __(item.label) : undefined}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={itemIdx}
                  href={targetPath}
                  onClick={onItemClick}
                  className={linkClasses}
                  title={isCollapsed ? __(item.label) : undefined}
                >
                  {content}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}


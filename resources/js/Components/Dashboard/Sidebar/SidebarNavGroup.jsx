import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import useTranslation from '@/hooks/useTranslation';

export default function SidebarNavGroup({ navigation, onItemClick, isCollapsed = false }) {
  const { url, props } = usePage();
  const { __, locale } = useTranslation();
  const unreadNotificationsCount = props.auth?.unread_notifications_count ?? 0;

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
              const isNotification = item.path === '/notifications';
              const showBadge = isNotification ? unreadNotificationsCount > 0 : Boolean(item.badge);
              const badgeText = isNotification ? (unreadNotificationsCount > 99 ? '99+' : unreadNotificationsCount) : item.badge;

              const linkClasses = `flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2.5'} rounded-xl font-semibold text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-[#E6F8F6] text-[#008A7B]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`;

              const content = (
                <>
                  <div className={`flex items-center ${isCollapsed ? 'justify-center relative' : 'gap-3'}`}>
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#008A7B]' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>{__(item.label)}</span>}
                    {isCollapsed && isNotification && unreadNotificationsCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white" />
                    )}
                  </div>

                  {!isCollapsed && showBadge && (
                    <span className={`px-1.5 py-0.5 min-w-[20px] rounded-full text-[10px] font-bold flex items-center justify-center ${
                      isNotification ? 'bg-rose-500 text-white' : 'bg-[#014D55] text-white'
                    }`}>
                      {badgeText}
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


import React, { useState, useRef, useEffect } from 'react';
import { usePage, Link } from '@inertiajs/react';
import { Bell, Globe, ChevronDown, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function DashboardHeader() {
  const { auth } = usePage().props;
  const { __, locale, isRtl, locales } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLangDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name) => {
    if (!name) return 'CX';
    const names = name.trim().split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const userInitials = auth?.user?.name ? getInitials(auth.user.name) : 'CX';

  return (
    <header className="w-full bg-white border-b border-slate-100 px-6 sm:px-8 py-3.5 flex items-center justify-between sticky top-0 z-20">
      {/* Back to Home Link */}
      <div className="flex items-center gap-3">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#008A7B] transition-colors"
        >
          {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
          <span>{__('Home')}</span>
        </Link>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
            title={__('Language')}
          >
            <Globe className="w-3.5 h-3.5 text-[#008A7B]" />
            <span className="uppercase">{locale}</span>
            <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-fade-in">
              {(locales.length > 0
                ? locales
                : [
                    { code: 'en', native: 'English', url: '/en/seeker/dashboard' },
                    { code: 'ar', native: 'العربية', url: '/ar/seeker/dashboard' },
                  ]
              ).map((loc) => (
                <a
                  key={loc.code}
                  href={loc.url}
                  className={`flex items-center justify-between px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-50 ${
                    locale === loc.code ? 'text-[#008A7B] font-bold bg-[#E6F8F6]' : 'text-slate-700'
                  }`}
                >
                  <span>{loc.native}</span>
                  {locale === loc.code && <Check className="w-3.5 h-3.5 text-[#008A7B]" />}
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Button with Red Indicator */}
        <button
          type="button"
          className="relative p-2 text-slate-500 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors focus:outline-none"
          aria-label={__('Notifications')}
        >
          <Bell className="w-5 h-5 stroke-[1.75]" />
          <span className="absolute top-1.5 right-1.5 rtl:right-auto rtl:left-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Avatar Circle */}
        <Link
          href={`/${locale}/seeker/profile`}
          className="w-9 h-9 rounded-full bg-[#014D55] text-white font-semibold text-xs flex items-center justify-center tracking-wider select-none shadow-sm hover:opacity-90 transition-opacity"
          title={auth?.user?.name || __('My Profile')}
        >
          {userInitials}
        </Link>
      </div>
    </header>
  );
}


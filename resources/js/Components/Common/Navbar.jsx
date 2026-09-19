import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Globe, ChevronDown, Check, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { navLinks } from '@/Data/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function Navbar() {
  const { props } = usePage();
  const auth = props?.auth;
  const { __, locale, locales } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  const getHref = (href) => {
    if (href === '/') return `/${locale}`;
    if (href.startsWith('/#')) return `/${locale}#${href.slice(2)}`;
    return href.startsWith('/') ? `/${locale}${href}` : href;
  };

  const handleNavClick = (e, link) => {
    if (link.href.includes('#')) {
      const hash = link.href.split('#')[1];
      const elem = document.getElementById(hash);
      if (elem) {
        e.preventDefault();
        elem.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${hash}`);
      }
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href={`/${locale}`} className="flex items-center shrink-0">
          <img
            src="/images/careerX-logo.webp"
            alt="CareerX logo"
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={getHref(link.href)}
              onClick={(e) => handleNavClick(e, link)}
              className="text-sm font-medium text-gray-600 hover:text-teal-800 transition-colors"
            >
              {__(link.name)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              title={__('Language')}
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className="uppercase">{locale}</span>
              <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 rtl:right-auto rtl:left-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 z-50 animate-fade-in">
                {(locales.length > 0
                  ? locales
                  : [
                      { code: 'en', native: 'English', url: '/en' },
                      { code: 'ar', native: 'العربية', url: '/ar' },
                    ]
                ).map((loc) => (
                  <a
                    key={loc.code}
                    href={loc.url}
                    className={`flex items-center justify-between px-3.5 py-2 text-xs font-medium transition-colors hover:bg-gray-50 ${
                      locale === loc.code ? 'text-primary font-bold bg-primary-light/40' : 'text-gray-700'
                    }`}
                  >
                    <span>{loc.native}</span>
                    {locale === loc.code && <Check className="w-3.5 h-3.5 text-primary" />}
                  </a>
                ))}
              </div>
            )}
          </div>

          {auth?.user ? (
            <div className="flex items-center gap-3">
              <Link
                href={auth.user.role === 'employer' ? `/${locale}/employer/dashboard` : `/${locale}/seeker/dashboard`}
                className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-[#008A7B] rounded-xl hover:bg-[#007366] transition-colors shadow-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{__('Dashboard')}</span>
              </Link>
              <Link
                href={typeof route !== 'undefined' && route().has('logout') ? route('logout') : '/logout'}
                method="post"
                as="button"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                title={__('Sign Out')}
              >
                <LogOut className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href={`/${locale}/login`}
                className="px-3.5 py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors"
              >
                {__('Login')}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="px-4 py-2 text-xs sm:text-sm font-bold text-white bg-[#008A7B] rounded-xl hover:bg-[#007366] transition-colors shadow-sm"
              >
                {__('Register')}
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-gray-800" /> : <Menu className="w-5 h-5 text-gray-800" />}
          </button>
        </div>

      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-2 shadow-lg animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={getHref(link.href)}
              onClick={(e) => {
                handleNavClick(e, link);
                setMobileMenuOpen(false);
              }}
              className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-teal-50 hover:text-[#008A7B] transition-colors"
            >
              {__(link.name)}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}


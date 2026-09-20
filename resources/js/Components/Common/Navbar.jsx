import React, { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Globe, ChevronDown, Check, LayoutDashboard, LogOut, Menu, X } from 'lucide-react';
import { navLinks } from '@/Data/navigation';
import { useTranslation } from '@/hooks/useTranslation';

export default function Navbar() {
  const { props, url } = usePage();
  const auth = props?.auth;
  const { __, locale, locales } = useTranslation();
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
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

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const sectionIds = ['jobs', 'companies', 'categories', 'about', 'blog'];

    const checkActive = () => {
      const currentPath = window.location.pathname;
      const isHome =
        currentPath === '/' ||
        currentPath === `/${locale}` ||
        currentPath === `/${locale}/`;

      if (!isHome) {
        if (currentPath.includes('/companies')) {
          setActiveSection('companies');
        } else if (currentPath.includes('/jobs')) {
          setActiveSection('jobs');
        } else {
          setActiveSection('');
        }
        return;
      }

      const scrollY = window.scrollY;
      if (scrollY < 200 && !window.location.hash) {
        setActiveSection('home');
        return;
      }

      if (window.innerHeight + scrollY >= document.documentElement.scrollHeight - 80) {
        for (let i = sectionIds.length - 1; i >= 0; i--) {
          const el = document.getElementById(sectionIds[i]);
          if (el) {
            setActiveSection(sectionIds[i]);
            return;
          }
        }
      }

      const scrollPosition = scrollY + 160;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            return;
          }
        }
      }

      if (scrollY < 300) {
        setActiveSection('home');
      }
    };

    if (window.location.hash) {
      const initialHash = window.location.hash.replace('#', '');
      if (sectionIds.includes(initialHash)) {
        setActiveSection(initialHash);
      }
    } else {
      checkActive();
    }

    window.addEventListener('scroll', checkActive, { passive: true });
    window.addEventListener('hashchange', checkActive);

    return () => {
      window.removeEventListener('scroll', checkActive);
      window.removeEventListener('hashchange', checkActive);
    };
  }, [locale, url]);

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
        setActiveSection(hash);
        elem.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `#${hash}`);
      }
    } else if (link.href === '/') {
      const currentPath = window.location.pathname;
      const isHome =
        currentPath === '/' ||
        currentPath === `/${locale}` ||
        currentPath === `/${locale}/`;
      if (isHome) {
        e.preventDefault();
        setActiveSection('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', `/${locale}`);
      }
    }
  };

  const isLinkActive = (link) => {
    if (link.href === '/') {
      return activeSection === 'home';
    }
    if (link.href.includes('#')) {
      const hash = link.href.split('#')[1];
      return activeSection === hash;
    }
    return false;
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

        <Link href={`/${locale}`} className="flex items-center shrink-0">
          <img
            src="/images/careerX-logo.webp"
            alt="CareerX logo"
            className="h-9 w-auto object-contain"
          />
        </Link>

        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-7">
          {navLinks.map((link) => {
            const active = isLinkActive(link);
            return (
              <Link
                key={link.name}
                href={getHref(link.href)}
                onClick={(e) => handleNavClick(e, link)}
                className={`text-xs xl:text-sm transition-colors cursor-pointer whitespace-nowrap ${
                  active
                    ? 'text-primary font-bold'
                    : 'text-gray-600 hover:text-primary font-medium'
                }`}
              >
                {__(link.name)}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
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
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <Link
                href={
                  auth.user.role === 'admin'
                    ? `/${locale}/admin/dashboard`
                    : auth.user.role === 'employer'
                      ? `/${locale}/employer/dashboard`
                      : `/${locale}/seeker/dashboard`
                }
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary-hover transition-colors shadow-sm whitespace-nowrap"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>{__('Dashboard')}</span>
              </Link>
              <Link
                href={typeof route !== 'undefined' && route().has('logout') ? route('logout') : '/logout'}
                method="post"
                as="button"
                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer shrink-0"
                title={__('Sign Out')}
              >
                <LogOut className="w-4 h-4 rtl:rotate-180" />
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              <Link
                href={`/${locale}/login`}
                className="hidden sm:inline-flex px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors whitespace-nowrap"
              >
                {__('Login')}
              </Link>
              <Link
                href={`/${locale}/register`}
                className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-primary rounded-xl hover:bg-[#007366] transition-colors shadow-sm whitespace-nowrap shrink-0"
              >
                {__('Register')}
              </Link>
            </div>
          )}

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors cursor-pointer shrink-0"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-gray-800" /> : <Menu className="w-5 h-5 text-gray-800" />}
          </button>
        </div>

      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-6 space-y-3 shadow-lg animate-fade-in">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isLinkActive(link);
              return (
                <Link
                  key={link.name}
                  href={getHref(link.href)}
                  onClick={(e) => {
                    handleNavClick(e, link);
                    setMobileMenuOpen(false);
                  }}
                  className={`block px-3 py-2 rounded-xl text-sm transition-colors ${
                    active
                      ? 'text-primary font-bold bg-primary/5'
                      : 'text-gray-700 hover:text-primary hover:bg-gray-50 font-medium'
                  }`}
                >
                  {__(link.name)}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-gray-100">
            {auth?.user ? (
              <div className="space-y-2">
                <Link
                  href={
                    auth.user.role === 'admin'
                      ? `/${locale}/admin/dashboard`
                      : auth.user.role === 'employer'
                        ? `/${locale}/employer/dashboard`
                        : `/${locale}/seeker/dashboard`
                  }
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary-hover transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{__('Dashboard')}</span>
                </Link>
                <Link
                  href={typeof route !== 'undefined' && route().has('logout') ? route('logout') : '/logout'}
                  method="post"
                  as="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 rtl:rotate-180" />
                  <span>{__('Sign Out')}</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href={`/${locale}/login`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-center"
                >
                  {__('Login')}
                </Link>
                <Link
                  href={`/${locale}/register`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-[#007366] rounded-xl transition-colors shadow-sm text-center"
                >
                  {__('Register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}


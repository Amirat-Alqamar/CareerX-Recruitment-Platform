import React from 'react';
import { Link } from '@inertiajs/react';
import { footerSections, socialLinks } from '@/Data/footerData';
import { useTranslation } from '@/hooks/useTranslation';

export default function Footer() {
  const { __ } = useTranslation();

  return (
    <footer className="bg-[#0B132B] text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">

        {/* Main Grid: Brand Column + Link Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-12">

          {/* Brand Info Column */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="inline-flex items-center">
              <img
                src="/images/careerX-logo.webp"
                alt="CareerX Logo"
                className="h-8 w-auto object-contain brightness-0 invert"
              />
            </Link>

            <p className="text-sm text-gray-400 max-w-sm leading-relaxed">
              {__('The modern recruitment platform connecting top talent with world-class companies. Find your next opportunity or hire the perfect candidate.')}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-primary text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 border border-slate-700/50"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Columns Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {footerSections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  {__(section.title)}
                </h3>
                <ul className="space-y-2.5">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm text-gray-400 hover:text-white transition-colors duration-150 inline-block"
                      >
                        {__(link.name)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Bar Separator */}
        <div className="border-t border-slate-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>{__('© 2026 CareerX Inc. All rights reserved.')}</p>

          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              {__('Privacy Policy')}
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              {__('Terms of Service')}
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              {__('Cookie Policy')}
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}

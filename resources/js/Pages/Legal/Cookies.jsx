import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Cookie, Info, Settings, CheckCircle2, ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Cookies() {
  const { __, locale } = useTranslation();

  return (
    <MainLayout>
      <Head title={__('Cookie Policy')} />

      <div className="bg-gradient-to-b from-[#0B132B] to-[#1C2541] text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <Cookie className="w-3.5 h-3.5" />
            <span>{__('Transparency & Cookies')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {__('Cookie Policy')}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {__('Understand what cookies are, how CareerX uses them to enhance your recruitment experience, and how you can manage them.')}
          </p>
          <p className="text-xs text-gray-400">
            {__('Last updated: September 2026')}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-10 text-gray-700 leading-relaxed text-sm sm:text-base">

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Info className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('1. What Are Cookies?')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('Cookies are small data files stored on your browser or device when you visit websites. They help recognize your device and remember your preferences, language selection, and session status across visits.')}
            </p>
          </section>

          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Cookie className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('2. How CareerX Uses Cookies')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('We utilize essential and performance cookies for the following purposes:')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  {__('Session & Authentication')}
                </h3>
                <p className="text-xs text-gray-600">
                  {__('Keeps you securely logged in to your account and protects against CSRF threats.')}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-1">
                <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  {__('Language & Localization')}
                </h3>
                <p className="text-xs text-gray-600">
                  {__('Remembers your selected interface language (Arabic or English) and direction.')}
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Settings className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('3. Managing Your Cookies')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('You can modify your browser settings to decline or clear cookies at any time. Note that disabling essential session cookies may prevent you from logging into your dashboard.')}
            </p>
          </section>

          <div className="bg-teal-50/50 rounded-xl p-6 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{__('Need more information?')}</h4>
                <p className="text-xs text-gray-500">{__('Reach out to support@careerx.com for cookie inquiries.')}</p>
              </div>
            </div>
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-2xs transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180" />
              <span>{__('Back to Home')}</span>
            </Link>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}

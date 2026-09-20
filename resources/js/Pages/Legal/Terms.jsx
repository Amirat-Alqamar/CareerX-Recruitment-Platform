import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { FileCheck, ShieldCheck, AlertCircle, Building2, UserCheck, ArrowLeft, Mail } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Terms() {
  const { __, locale } = useTranslation();

  return (
    <MainLayout>
      <Head title={__('Terms of Service')} />

      <div className="bg-gradient-to-b from-[#0B132B] to-[#1C2541] text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <FileCheck className="w-3.5 h-3.5" />
            <span>{__('Platform Agreement')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {__('Terms of Service')}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {__('Please review the terms and conditions governing the use of CareerX recruitment services and platform.')}
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
                <FileCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('1. Acceptance of Terms')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('By accessing or creating an account on CareerX, you confirm that you have read, understood, and agreed to be bound by these Terms of Service, as well as our Privacy Policy.')}
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('2. User Accounts & Responsibilities')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('Users agree to provide accurate, up-to-date, and truthful information during registration and job application. Each user is responsible for maintaining the confidentiality of their credentials.')}
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('3. Employer Guidelines & Job Postings')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('Employers must only post legitimate, verifiable employment opportunities. CareerX reserves the right to moderate, review, approve, or remove job listings that fail to adhere to anti-discrimination or fair recruitment standards.')}
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('4. Platform Integrity & Conduct')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('Any unauthorized automated scraping, misuse of candidate contact information, submission of fraudulent applications, or attempts to disrupt system security is strictly prohibited and subject to immediate account termination.')}
            </p>
          </section>

          <div className="bg-teal-50/50 rounded-xl p-6 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{__('Questions about our Terms?')}</h4>
                <p className="text-xs text-gray-500">{__('Reach our legal and compliance team at legal@careerx.com')}</p>
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

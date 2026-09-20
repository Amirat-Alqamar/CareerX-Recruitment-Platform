import React from 'react';
import { Head, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Shield, Lock, Eye, FileText, CheckCircle2, Mail, ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Privacy() {
  const { __, locale, isRtl } = useTranslation();

  return (
    <MainLayout>
      <Head title={__('Privacy Policy')} />

      <div className="bg-gradient-to-b from-[#0B132B] to-[#1C2541] text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
            <Shield className="w-3.5 h-3.5" />
            <span>{__('Your Privacy Matters')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
            {__('Privacy Policy')}
          </h1>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {__('Learn how CareerX collects, protects, and handles your personal information when using our recruitment platform.')}
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
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('1. Information We Collect')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('We collect information to provide better recruitment services to candidates and employers. This includes personal details such as your name, email address, phone number, professional experience, education, skills, and resume documents.')}
            </p>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600 list-disc list-inside pt-1">
              <li>{__('Account profile details (Name, Contact Information, Job Title).')}</li>
              <li>{__('Resume & CV attachments uploaded for job applications.')}</li>
              <li>{__('Company verification data and employer job posting information.')}</li>
              <li>{__('Log data, device information, and platform usage analytics.')}</li>
            </ul>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Eye className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('2. How We Use Your Information')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('We use your data exclusively to facilitate the job application process, power candidate-job matching algorithms, communicate application updates, and maintain platform security.')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{__('Connecting candidates with verified employers.')}</span>
              </div>
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs sm:text-sm text-gray-700 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <span>{__('Delivering real-time application status notifications.')}</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('3. Data Protection & Security')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('We implement robust technical and organizational security measures, including bcrypt hashing, encrypted transmission (SSL/TLS), and restricted access controls to safeguard your data against unauthorized access, loss, or alteration.')}
            </p>
          </section>

          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                {__('4. Your Rights & Data Control')}
              </h2>
            </div>
            <p className="text-gray-600">
              {__('You have the right to access, update, export, or delete your personal data at any time directly through your dashboard account settings.')}
            </p>
          </section>

          <div className="bg-teal-50/50 rounded-xl p-6 border border-teal-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm">{__('Have privacy questions?')}</h4>
                <p className="text-xs text-gray-500">{__('Contact our Data Privacy team at privacy@careerx.com')}</p>
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

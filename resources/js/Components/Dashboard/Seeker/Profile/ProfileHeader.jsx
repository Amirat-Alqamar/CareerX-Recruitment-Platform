import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import { Camera, Download, Pencil, CheckCircle2, MapPin, Mail, Globe, Code2 } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function ProfileHeader({ data }) {
  const { auth } = usePage().props;
  const { __, locale } = useTranslation();
  const [activeTab, setActiveTab] = useState('Profile');

  const name = auth?.user?.name || data?.name || __('Job Seeker');
  const headline = auth?.user?.headline || data?.headline;
  const location = data?.location;
  const email = auth?.user?.email || data?.email;
  const website = data?.website;

  const initials = name
    .trim()
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'CX';

  const tabs = [
    { key: 'Profile', label: __('Profile') },
    { key: 'Resume', label: __('Resume') },
    { key: 'Portfolio', label: __('Portfolio') },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
      {/* Cover Banner */}
      <div className="h-44 bg-[#008A7B] relative">
        <a href={`/${locale}/job-seeker/profile/edit`} className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full text-white transition-all cursor-pointer">
          <Camera className="w-4 h-4" />
        </a>
      </div>

      {/* User Basic Info Container */}
      <div className="px-8 pb-6 relative">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 -mt-16 mb-6">
          {/* Avatar with Camera Overlay */}
          <div className="relative inline-block">
            <div className="w-28 h-28 rounded-2xl bg-[#014D55] text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-md">
              {initials}
            </div>
            <a href={`/${locale}/job-seeker/profile/edit`} className="absolute -bottom-1 -right-1 rtl:-right-auto rtl:-left-1 p-1.5 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-slate-900 shadow-sm cursor-pointer">
              <Camera className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <button type="button" className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
              <Download className="w-4 h-4" />
              <span>{__('Download CV')}</span>
            </button>
            <a href={`/${locale}/job-seeker/profile/edit`} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#014D55] text-white font-bold text-sm hover:bg-[#01383E] transition-colors cursor-pointer">
              <Pencil className="w-4 h-4" />
              <span>{__('Edit Profile')}</span>
            </a>
          </div>
        </div>

        {/* Name & Subtitle */}
        <div className="space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900">{name}</h1>
                <CheckCircle2 className="w-5 h-5 text-[#008A7B]" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-semibold text-slate-500">
                  {headline || __('Job Seeker')}
                </p>
                {!headline && (
                  <a
                    href={`/${locale}/job-seeker/profile/edit`}
                    className="text-xs text-[#008A7B] font-bold hover:underline"
                  >
                    +{__('Add your job title')}
                  </a>
                )}
              </div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a href="#" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-[#014D55] hover:border-slate-300 transition-colors">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-[#014D55] hover:border-slate-300 transition-colors">
                <Code2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-[#014D55] hover:border-slate-300 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Contact Badges */}
          <div className="flex items-center gap-5 flex-wrap text-xs font-semibold text-slate-500">
            {location && (
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{location}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{email}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span>{website}</span>
              </div>
            )}
          </div>

          {/* Job Preference Badges */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#008A7B] text-xs font-extrabold">{__('Open to Work')}</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#008A7B] text-xs font-extrabold">{__('Remote Friendly')}</span>
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-[#008A7B] text-xs font-extrabold">{__('$120k+ Salary')}</span>
          </div>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="border-t border-slate-100 px-8 flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`py-3.5 text-sm font-extrabold relative transition-colors cursor-pointer ${
              activeTab === tab.key ? 'text-[#008A7B]' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#008A7B] rounded-t-md" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}


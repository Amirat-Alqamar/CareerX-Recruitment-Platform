import React, { useState, useRef } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Camera, Download, Pencil, CheckCircle2, MapPin, Mail, Globe, Code2, Trash2 } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function ProfileHeader({
  data,
  onEditProfile,
  onManageResumes,
  onOpenPortfolio,
  activeTab = 'Profile',
  onTabChange,
}) {
  const { auth } = usePage().props;
  const { __, locale } = useTranslation();

  const avatarInputRef = useRef(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [deletingAvatar, setDeletingAvatar] = useState(false);

  const coverInputRef = useRef(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [deletingCover, setDeletingCover] = useState(false);

  const name = auth?.user?.name || data?.name || __('Job Seeker');
  const headline = auth?.user?.headline || data?.headline;
  const location = data?.location;
  const email = auth?.user?.email || data?.email;
  const website = data?.website;
  const avatarUrl = auth?.user?.avatar || data?.avatar;
  const coverImageUrl = data?.cover_image || auth?.user?.cover_image;

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);

    router.post(`/${locale}/job-seeker/profile/avatar`, formData, {
      preserveScroll: true,
      onFinish: () => setUploadingAvatar(false),
    });
  };

  const handleDeleteAvatar = () => {
    if (confirm(__('Are you sure you want to delete your profile photo?'))) {
      setDeletingAvatar(true);
      router.delete(`/${locale}/job-seeker/profile/avatar`, {
        preserveScroll: true,
        onFinish: () => setDeletingAvatar(false),
      });
    }
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const formData = new FormData();
    formData.append('cover_image', file);

    router.post(`/${locale}/job-seeker/profile/cover`, formData, {
      preserveScroll: true,
      onFinish: () => setUploadingCover(false),
    });
  };

  const handleDeleteCover = () => {
    if (confirm(__('Are you sure you want to delete your cover photo?'))) {
      setDeletingCover(true);
      router.delete(`/${locale}/job-seeker/profile/cover`, {
        preserveScroll: true,
        onFinish: () => setDeletingCover(false),
      });
    }
  };

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
      <div className="h-44 sm:h-52 bg-[#008A7B] relative overflow-hidden group">
        <input
          type="file"
          ref={coverInputRef}
          onChange={handleCoverChange}
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
        />
        {coverImageUrl && (
          <img
            src={coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
        <div
          className="absolute top-4 z-10 flex items-center gap-2"
          style={{
            [locale === 'ar' ? 'left' : 'right']: '1rem',
            [locale === 'ar' ? 'right' : 'left']: 'auto',
          }}
        >
          {coverImageUrl && (
            <button
              type="button"
              disabled={deletingCover}
              onClick={handleDeleteCover}
              className="p-2.5 bg-black/40 hover:bg-rose-600 backdrop-blur-md rounded-full text-white transition-all cursor-pointer shadow-md flex items-center justify-center hover:scale-105"
              title={deletingCover ? __('Deleting...') : __('Delete Cover Photo')}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            disabled={uploadingCover}
            onClick={() => coverInputRef.current?.click()}
            className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
            title={uploadingCover ? __('Uploading...') : __('Change Cover Photo')}
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* User Basic Info Container */}
      <div className="px-4 sm:px-8 pb-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-6">
          {/* Avatar with Camera & Delete Overlay */}
          <div className="relative inline-block w-28 h-28 shrink-0">
            <input
              type="file"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
              accept="image/png,image/jpeg,image/jpg,image/webp"
              className="hidden"
            />
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={name}
                className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md bg-slate-100"
              />
            ) : (
              <div className="w-28 h-28 rounded-2xl bg-[#014D55] text-white font-black text-2xl flex items-center justify-center border-4 border-white shadow-md">
                {initials}
              </div>
            )}
            {/* Delete Avatar Button */}
            {avatarUrl && (
              <button
                type="button"
                disabled={deletingAvatar}
                onClick={handleDeleteAvatar}
                className="absolute w-7 h-7 rounded-full bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 shadow-md flex items-center justify-center shrink-0 cursor-pointer transition-all z-10 hover:scale-105"
                style={{
                  top: '-2px',
                  [locale === 'ar' ? 'left' : 'right']: '-2px',
                  [locale === 'ar' ? 'right' : 'left']: 'auto',
                }}
                title={deletingAvatar ? __('Deleting...') : __('Delete Profile Photo')}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            {/* Upload Avatar Button */}
            <button
              type="button"
              disabled={uploadingAvatar}
              onClick={() => avatarInputRef.current?.click()}
              className="absolute w-8 h-8 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#008A7B] shadow-md flex items-center justify-center shrink-0 cursor-pointer transition-all z-10 hover:scale-105"
              style={{
                bottom: '-2px',
                [locale === 'ar' ? 'right' : 'left']: '-2px',
                [locale === 'ar' ? 'left' : 'right']: 'auto',
              }}
              title={uploadingAvatar ? __('Uploading...') : __('Change Profile Photo')}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={onManageResumes}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 font-bold text-xs sm:text-sm text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>{__('Download CV')}</span>
            </button>
            <button
              type="button"
              onClick={onEditProfile}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#014D55] text-white font-bold text-xs sm:text-sm hover:bg-[#01383E] transition-colors cursor-pointer shadow-sm hover:shadow"
            >
              <Pencil className="w-4 h-4 shrink-0" />
              <span>{__('Edit Profile')}</span>
            </button>
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
                  <button
                    type="button"
                    onClick={onEditProfile}
                    className="text-xs text-[#008A7B] font-bold hover:underline cursor-pointer"
                  >
                    +{__('Add your job title')}
                  </button>
                )}
              </div>
            </div>

            {/* Quick Actions / Links */}
            <div className="flex items-center gap-2">
              {website ? (
                <a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 border border-slate-200 rounded-xl text-slate-600 hover:text-[#008A7B] hover:border-[#008A7B]/40 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                  title={__('Visit Website')}
                >
                  <Globe className="w-4 h-4" />
                </a>
              ) : (
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-[#008A7B] hover:border-[#008A7B]/40 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                  title={__('Add Website')}
                >
                  <Globe className="w-4 h-4" />
                </button>
              )}

              <button
                type="button"
                onClick={onOpenPortfolio}
                className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-[#008A7B] hover:border-[#008A7B]/40 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                title={__('Portfolio Projects')}
              >
                <Code2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onManageResumes}
                className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:text-[#008A7B] hover:border-[#008A7B]/40 hover:bg-slate-50 transition-colors cursor-pointer shadow-xs"
                title={__('Resumes & CV')}
              >
                <Download className="w-4 h-4" />
              </button>
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
      <div className="border-t border-slate-100 px-4 sm:px-8 flex gap-4 sm:gap-8 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange && onTabChange(tab.key)}
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


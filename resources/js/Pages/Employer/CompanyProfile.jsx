import React, { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Building2,
  Globe,
  MapPin,
  Users,
  Calendar,
  Camera,
  Trash2,
  Pencil,
  Save,
  Briefcase,
  ExternalLink,
  CheckCircle2,
  X,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function CompanyProfile({
  company = {},
  socials = {},
  countries = [],
  cities = [],
}) {
  const { __, locale, isRtl } = useTranslation();

  const [isEditing, setIsEditing] = useState(false);
  const logoInputRef = useRef(null);
  const coverInputRef = useRef(null);

  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [deletingCover, setDeletingCover] = useState(false);

  const [form, setForm] = useState({
    name: company.name || '',
    website: company.website || '',
    country_id: company.country_id || '',
    city_id: company.city_id || '',
    address: company.address || '',
    company_size: company.company_size || '11-50',
    founded_year: company.founded_year || '',
    description: company.description || '',
    socials: {
      linkedin: socials.linkedin || '',
      facebook: socials.facebook || '',
      x: socials.x || '',
      instagram: socials.instagram || '',
    },
  });

  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const platform = name.replace('social_', '');
      setForm((prev) => ({
        ...prev,
        socials: { ...prev.socials, [platform]: value },
      }));
    } else {
      setForm((prev) => {
        if (name === 'country_id') {
          return { ...prev, country_id: value, city_id: '' };
        }
        return { ...prev, [name]: value };
      });
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingLogo(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('logo', file);

    router.post(`/${locale}/employer/company/update`, formData, {
      preserveScroll: true,
      onFinish: () => setUploadingLogo(false),
    });
  };

  const handleDeleteLogo = () => {
    if (confirm(__('Are you sure you want to delete the company logo?'))) {
      setDeletingLogo(true);
      router.delete(`/${locale}/employer/company/logo`, {
        preserveScroll: true,
        onFinish: () => setDeletingLogo(false),
      });
    }
  };

  const handleCoverUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('cover_image', file);

    router.post(`/${locale}/employer/company/update`, formData, {
      preserveScroll: true,
      onFinish: () => setUploadingCover(false),
    });
  };

  const handleDeleteCover = () => {
    if (confirm(__('Are you sure you want to delete the company cover photo?'))) {
      setDeletingCover(true);
      router.delete(`/${locale}/employer/company/cover`, {
        preserveScroll: true,
        onFinish: () => setDeletingCover(false),
      });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    router.post(`/${locale}/employer/company/update`, form, {
      preserveScroll: true,
      onSuccess: () => {
        setIsEditing(false);
      },
      onFinish: () => setSubmitting(false),
    });
  };

  const filteredCities = form.country_id
    ? cities.filter((c) => String(c.country_id) === String(form.country_id))
    : cities;

  return (
    <DashboardLayout userRole="employer">
      <Head title={`${company.name || __('Company')} - ${__('Company Profile')}`} />

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Cover & Header Banner */}
        <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
          {/* Cover */}
          <div className="h-44 sm:h-56 bg-gradient-to-r from-[#014D55] to-[#008A7B] relative overflow-hidden group">
            <input
              type="file"
              ref={coverInputRef}
              onChange={handleCoverUpload}
              accept="image/*"
              className="hidden"
            />
            {company.cover_url && (
              <img
                src={company.cover_url}
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
              {company.cover_url && (
                <button
                  type="button"
                  disabled={deletingCover}
                  onClick={handleDeleteCover}
                  className="p-2.5 bg-black/40 hover:bg-rose-600 backdrop-blur-md rounded-full text-white transition-all cursor-pointer shadow-md flex items-center justify-center hover:scale-105"
                  title={deletingCover ? __('Deleting...') : __('Delete Company Cover Photo')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                disabled={uploadingCover}
                onClick={() => coverInputRef.current?.click()}
                className="p-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md rounded-full text-white transition-all cursor-pointer shadow-md flex items-center gap-1.5 text-xs font-semibold hover:scale-105"
                title={uploadingCover ? __('Uploading...') : __('Change Company Cover')}
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {uploadingCover ? __('Uploading...') : __('Change Cover')}
                </span>
              </button>
            </div>
          </div>

          {/* Logo & Basic Info */}
          <div className="px-6 sm:px-8 pb-6 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 mb-4">
              {/* Logo */}
              <div className="relative inline-block w-28 h-28 shrink-0">
                <input
                  type="file"
                  ref={logoInputRef}
                  onChange={handleLogoUpload}
                  accept="image/*"
                  className="hidden"
                />
                {company.logo_url ? (
                  <img
                    src={company.logo_url}
                    alt={company.name}
                    className="w-28 h-28 rounded-2xl object-contain bg-white border-4 border-white shadow-md p-1.5"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-2xl bg-[#014D55] text-white font-black text-3xl flex items-center justify-center border-4 border-white shadow-md">
                    {company.name ? company.name.charAt(0).toUpperCase() : 'C'}
                  </div>
                )}
                {/* Delete Logo Button */}
                {company.logo_url && (
                  <button
                    type="button"
                    disabled={deletingLogo}
                    onClick={handleDeleteLogo}
                    className="absolute w-7 h-7 rounded-full bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-500 hover:text-rose-600 shadow-md flex items-center justify-center shrink-0 cursor-pointer transition-all z-10 hover:scale-105"
                    style={{
                      top: '-2px',
                      [locale === 'ar' ? 'left' : 'right']: '-2px',
                      [locale === 'ar' ? 'right' : 'left']: 'auto',
                    }}
                    title={deletingLogo ? __('Deleting...') : __('Delete Company Logo')}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
                {/* Upload/Change Logo Button */}
                <button
                  type="button"
                  disabled={uploadingLogo}
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute w-8 h-8 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-[#008A7B] shadow-md flex items-center justify-center shrink-0 cursor-pointer transition-all z-10 hover:scale-105"
                  style={{
                    bottom: '-2px',
                    [locale === 'ar' ? 'right' : 'left']: '-2px',
                    [locale === 'ar' ? 'left' : 'right']: 'auto',
                  }}
                  title={uploadingLogo ? __('Uploading...') : __('Change Company Logo')}
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>

              {/* Edit Profile Button */}
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 text-white hover:bg-[#008A7B] shadow-sm transition-all cursor-pointer self-start sm:self-auto"
              >
                <Pencil className="w-4 h-4" />
                <span>{isEditing ? __('Cancel Editing') : __('Edit Company Info')}</span>
              </button>
            </div>

            {/* Title & Meta Info */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {company.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
                {company.website && (
                  <a
                    href={company.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#008A7B] hover:underline"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>{company.website.replace(/^https?:\/\//, '')}</span>
                  </a>
                )}
                {(company.city || company.country) && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {[company.city, company.country].filter(Boolean).join(', ')}
                  </span>
                )}
                {company.company_size && (
                  <span className="inline-flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500 font-medium">{__('Company Size')}:</span>
                    <span className="font-bold text-slate-800">{company.company_size} {__('Employees')}</span>
                  </span>
                )}
                {company.founded_year && (
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {__('Founded in')} {company.founded_year}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form Card (Visible when editing) */}
        {isEditing && (
          <form
            onSubmit={handleFormSubmit}
            className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5 animate-fade-in"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-lg font-black text-slate-900">{__('Edit Company Details')}</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Company Name')} *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#008A7B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Official Website')}
                </label>
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Company Size')}
                </label>
                <select
                  name="company_size"
                  value={form.company_size}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#008A7B]"
                >
                  <option value="1-10">1-10 {__('Employees')}</option>
                  <option value="11-50">11-50 {__('Employees')}</option>
                  <option value="51-200">51-200 {__('Employees')}</option>
                  <option value="201-500">201-500 {__('Employees')}</option>
                  <option value="500+">500+ {__('Employees')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Founded Year')}
                </label>
                <input
                  type="number"
                  name="founded_year"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={form.founded_year}
                  onChange={handleInputChange}
                  placeholder="e.g. 2020"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#008A7B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Country')}
                </label>
                <select
                  name="country_id"
                  value={form.country_id}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#008A7B]"
                >
                  <option value="">{__('Select Country')}</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('City')}
                </label>
                <select
                  name="city_id"
                  value={form.city_id}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#008A7B]"
                >
                  <option value="">{__('Select City')}</option>
                  {filteredCities.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {__('Address')}
              </label>
              <input
                type="text"
                name="address"
                value={form.address}
                onChange={handleInputChange}
                placeholder={__('Headquarters address...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {__('Company Description & About')}
              </label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={handleInputChange}
                placeholder={__('Tell candidates about your company culture, vision, and mission...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B]"
              />
            </div>

            {/* Social Links */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {__('Social Media Profiles')}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="url"
                  name="social_linkedin"
                  value={form.socials.linkedin}
                  onChange={handleInputChange}
                  placeholder="LinkedIn URL"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B]"
                />
                <input
                  type="url"
                  name="social_facebook"
                  value={form.socials.facebook}
                  onChange={handleInputChange}
                  placeholder="Facebook URL"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B]"
                />
                <input
                  type="url"
                  name="social_x"
                  value={form.socials.x}
                  onChange={handleInputChange}
                  placeholder="X (Twitter) URL"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B]"
                />
                <input
                  type="url"
                  name="social_instagram"
                  value={form.socials.instagram}
                  onChange={handleInputChange}
                  placeholder="Instagram URL"
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                {__('Cancel')}
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs bg-[#008A7B] text-white hover:bg-[#014D55] transition-all cursor-pointer shadow-sm disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{submitting ? __('Saving...') : __('Save Changes')}</span>
              </button>
            </div>
          </form>
        )}

        {/* Company Description Card */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900">{__('About the Company')}</h3>
          {company.description ? (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {company.description}
            </p>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">
              {__('No company description provided yet. Click "Edit Company Info" to add one.')}
            </p>
          )}
        </div>

        {/* Company Active Job Postings */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900">{__('Recent Jobs by this Company')}</h3>
            <Link
              href={`/${locale}/employer/jobs/create`}
              className="text-xs font-bold text-[#008A7B] hover:underline"
            >
              + {__('Post New Job')}
            </Link>
          </div>

          {company.jobs && company.jobs.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {company.jobs.map((jb) => (
                <div key={jb.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">{jb.title}</h4>
                    <span className="text-[11px] text-slate-400">
                      {jb.job_type} • {jb.work_type}
                    </span>
                  </div>
                  <Link
                    href={`/${locale}/employer/applicants?job_id=${jb.id}`}
                    className="text-xs font-bold text-[#008A7B] hover:underline"
                  >
                    {__('View Applicants')}
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">
              {__('No jobs posted yet.')}
            </p>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

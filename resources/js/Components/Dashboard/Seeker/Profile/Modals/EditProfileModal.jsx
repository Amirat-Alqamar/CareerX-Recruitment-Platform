import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import ModalWrapper from './ModalWrapper';
import useTranslation from '@/hooks/useTranslation';

export default function EditProfileModal({
  isOpen,
  onClose,
  details = null,
  header = null,
  countries = [],
  cities = [],
}) {
  const { __, locale } = useTranslation();

  const [form, setForm] = useState({
    job_title: '',
    bio: '',
    country_id: '',
    city_id: '',
    nationality: '',
    address: '',
    marital_status: '',
    birth_date: '',
    years_of_experience: '',
    work_type: 'Full-time',
    gender_preference: '',
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (details) {
      setForm({
        job_title: details.job_title || header?.headline || '',
        bio: details.bio || '',
        country_id: details.country_id || '',
        city_id: details.city_id || '',
        nationality: details.nationality || '',
        address: details.address || '',
        marital_status: details.marital_status || '',
        birth_date: details.birth_date || '',
        years_of_experience: details.years_of_experience ?? '',
        work_type: details.work_type || 'Full-time',
        gender_preference: details.gender_preference || '',
      });
    } else {
      setForm({
        job_title: header?.headline || '',
        bio: '',
        country_id: '',
        city_id: '',
        nationality: '',
        address: '',
        marital_status: '',
        birth_date: '',
        years_of_experience: '',
        work_type: 'Full-time',
        gender_preference: '',
      });
    }
    setErrors({});
  }, [details, header, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      // If country changed, reset city_id
      if (name === 'country_id') {
        return { ...prev, country_id: value, city_id: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const filteredCities = form.country_id
    ? cities.filter((c) => String(c.country_id) === String(form.country_id))
    : cities;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    router.put(`/${locale}/job-seeker/profile/update`, form, {
      preserveScroll: true,
      onSuccess: () => {
        setLoading(false);
        onClose();
      },
      onError: (err) => {
        setLoading(false);
        setErrors(err);
      },
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={__('Edit Profile Information')}
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Title / Headline */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Professional Headline / Job Title')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="job_title"
            value={form.job_title}
            onChange={handleChange}
            placeholder={__('e.g. Senior Full-Stack Developer')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            required
          />
          {errors.job_title && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.job_title}</p>
          )}
        </div>

        {/* Bio / Summary */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Professional Bio & Summary')}
          </label>
          <textarea
            name="bio"
            rows="3"
            value={form.bio}
            onChange={handleChange}
            placeholder={__('Describe your background, expertise, and career aspirations...')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800 resize-none"
          />
          {errors.bio && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.bio}</p>
          )}
        </div>

        {/* Country & City Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {__('Country')}
            </label>
            <select
              name="country_id"
              value={form.country_id}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800 bg-white"
            >
              <option value="">{__('Select Country')}</option>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {__(country.name)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {__('City')}
            </label>
            <select
              name="city_id"
              value={form.city_id}
              onChange={handleChange}
              disabled={!form.country_id}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800 bg-white disabled:bg-slate-100 disabled:text-slate-400"
            >
              <option value="">{__('Select City')}</option>
              {filteredCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {__(city.name)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Experience Years & Work Type */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {__('Years of Experience')}
            </label>
            <input
              type="number"
              min="0"
              name="years_of_experience"
              value={form.years_of_experience}
              onChange={handleChange}
              placeholder={__('e.g. 5')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {__('Work Preference')}
            </label>
            <select
              name="work_type"
              value={form.work_type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800 bg-white"
            >
              <option value="Full-time">{__('Full-time')}</option>
              <option value="Part-time">{__('Part-time')}</option>
              <option value="Remote">{__('Remote')}</option>
              <option value="Freelance">{__('Freelance')}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {__('Nationality')}
            </label>
            <input
              type="text"
              name="nationality"
              value={form.nationality}
              onChange={handleChange}
              placeholder={__('e.g. Syrian')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            {__('Cancel')}
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-bold text-white bg-[#008A7B] hover:bg-[#014D55] rounded-xl shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? __('Saving...') : __('Save Changes')}
          </button>
        </div>
      </form>
    </ModalWrapper>
  );
}

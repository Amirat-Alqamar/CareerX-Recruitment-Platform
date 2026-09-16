import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  Building2,
  DollarSign,
  MapPin,
  Clock,
  CheckCircle2,
  Save,
  Send,
  X,
  Plus,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function JobForm({
  job = null,
  categories = [],
  countries = [],
  cities = [],
  skills = [],
  selectedSkills = [],
  company = null,
}) {
  const { __, locale, isRtl } = useTranslation();
  const isEditing = Boolean(job);

  const [form, setForm] = useState({
    title: job?.title || '',
    category_id: job?.category_id || (categories[0]?.id ?? ''),
    job_type: job?.job_type || 'full_time',
    work_type: job?.work_type || 'on_site',
    experience_years: job?.experience_years ?? 1,
    salary_min: job?.salary_min ?? '',
    salary_max: job?.salary_max ?? '',
    salary_type: job?.salary_type || 'monthly',
    country_id: job?.country_id || company?.country_id || '',
    city_id: job?.city_id || company?.city_id || '',
    description: job?.description || '',
    responsibilities: job?.responsibilities || '',
    requirements: job?.requirements || '',
    status: job?.status || 'published',
    skills: selectedSkills || [],
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      if (name === 'country_id') {
        return { ...prev, country_id: value, city_id: '' };
      }
      return { ...prev, [name]: value };
    });
  };

  const toggleSkill = (skillId) => {
    setForm((prev) => {
      const exists = prev.skills.includes(skillId);
      return {
        ...prev,
        skills: exists
          ? prev.skills.filter((id) => id !== skillId)
          : [...prev.skills, skillId],
      };
    });
  };

  const filteredCities = form.country_id
    ? cities.filter((c) => String(c.country_id) === String(form.country_id))
    : cities;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});

    if (isEditing) {
      router.put(`/${locale}/employer/jobs/${job.id}`, form, {
        onError: (err) => {
          setErrors(err);
          setSubmitting(false);
        },
        onFinish: () => setSubmitting(false),
      });
    } else {
      router.post(`/${locale}/employer/jobs`, form, {
        onError: (err) => {
          setErrors(err);
          setSubmitting(false);
        },
        onFinish: () => setSubmitting(false),
      });
    }
  };

  return (
    <DashboardLayout userRole="employer">
      <Head title={isEditing ? __('Edit Job Posting') : __('Post a New Job')} />

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/employer/jobs`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#008A7B] transition-colors"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{__('Back to Job Openings')}</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Details Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                {isEditing ? __('Edit Job Opening') : __('Post a New Job Opportunity')}
              </h2>
              <p className="text-xs text-slate-400 font-medium mt-1">
                {__('Provide clear details to attract the best matching candidates.')}
              </p>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {__('Job Title')} *
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder={__('e.g., Senior Frontend Developer')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#008A7B]"
              />
              {errors.title && <p className="text-rose-600 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Category & Employment Types */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Category')} *
                </label>
                <select
                  name="category_id"
                  required
                  value={form.category_id}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#008A7B] cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="text-rose-600 text-xs mt-1">{errors.category_id}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Job Type')} *
                </label>
                <select
                  name="job_type"
                  required
                  value={form.job_type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#008A7B] cursor-pointer"
                >
                  <option value="full_time">{__('Full-time')}</option>
                  <option value="part_time">{__('Part-time')}</option>
                  <option value="freelance">{__('Freelance / Contract')}</option>
                  <option value="internship">{__('Internship')}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Work Style')} *
                </label>
                <select
                  name="work_type"
                  required
                  value={form.work_type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#008A7B] cursor-pointer"
                >
                  <option value="on_site">{__('On-site')}</option>
                  <option value="remote">{__('Remote')}</option>
                  <option value="hybrid">{__('Hybrid')}</option>
                </select>
              </div>
            </div>

            {/* Experience & Salary */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Min Experience (Years)')} *
                </label>
                <input
                  type="number"
                  name="experience_years"
                  min="0"
                  max="50"
                  required
                  value={form.experience_years}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#008A7B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Min Salary')}
                </label>
                <input
                  type="number"
                  name="salary_min"
                  min="0"
                  value={form.salary_min}
                  onChange={handleChange}
                  placeholder="e.g. 1000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#008A7B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Max Salary')}
                </label>
                <input
                  type="number"
                  name="salary_max"
                  min="0"
                  value={form.salary_max}
                  onChange={handleChange}
                  placeholder="e.g. 2500"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#008A7B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Salary Period')} *
                </label>
                <select
                  name="salary_type"
                  value={form.salary_type}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#008A7B] cursor-pointer"
                >
                  <option value="monthly">{__('Monthly')}</option>
                  <option value="hourly">{__('Hourly')}</option>
                </select>
              </div>
            </div>

            {/* Location (Country & City) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Country')}
                </label>
                <select
                  name="country_id"
                  value={form.country_id}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#008A7B] cursor-pointer"
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
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-[#008A7B] cursor-pointer"
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
          </div>

          {/* Description & Requirements Card */}
          <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {__('Job Description')} *
              </label>
              <textarea
                name="description"
                required
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder={__('Detailed overview of the role...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B]"
              />
              {errors.description && <p className="text-rose-600 text-xs mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {__('Key Responsibilities')}
              </label>
              <textarea
                name="responsibilities"
                rows={3}
                value={form.responsibilities}
                onChange={handleChange}
                placeholder={__('List daily duties and tasks expected...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {__('Requirements & Qualifications')}
              </label>
              <textarea
                name="requirements"
                rows={3}
                value={form.requirements}
                onChange={handleChange}
                placeholder={__('Education, skills, and past experience required...')}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-800 focus:outline-none focus:border-[#008A7B]"
              />
            </div>

            {/* Skills Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                {__('Required Skills')}
              </label>
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-3 bg-slate-50 rounded-2xl border border-slate-200">
                {skills.map((sk) => {
                  const isSelected = form.skills.includes(sk.id);
                  return (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => toggleSkill(sk.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                        isSelected
                          ? 'bg-[#008A7B] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <span>{sk.name}</span>
                      {isSelected && <X className="w-3 h-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Publication Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {__('Publication Status')} *
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#008A7B] cursor-pointer"
              >
                <option value="published">{__('Published (Active)')}</option>
                <option value="draft">{__('Draft')}</option>
                <option value="closed">{__('Closed')}</option>
              </select>
            </div>
          </div>

          {/* Submit Actions */}
          <div className="flex items-center justify-end gap-3">
            <Link
              href={`/${locale}/employer/jobs`}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-all"
            >
              {__('Cancel')}
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#008A7B] text-white hover:bg-[#014D55] transition-all cursor-pointer shadow-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{submitting ? __('Saving...') : isEditing ? __('Save Changes') : __('Publish Job')}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

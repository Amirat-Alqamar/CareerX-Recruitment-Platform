import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import ModalWrapper from './ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import { Trash2 } from 'lucide-react';

export default function ExperienceModal({ isOpen, onClose, experience = null }) {
  const { __, locale } = useTranslation();
  const isEdit = Boolean(experience?.id);

  const [form, setForm] = useState({
    company_name: '',
    title: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (experience) {
      setForm({
        company_name: experience.company_name || '',
        title: experience.title || experience.job_title || '',
        description: experience.description || '',
        start_date: experience.start_date || '',
        end_date: experience.end_date || '',
        is_current: !experience.end_date,
      });
    } else {
      setForm({
        company_name: '',
        title: '',
        description: '',
        start_date: '',
        end_date: '',
        is_current: false,
      });
    }
    setErrors({});
  }, [experience, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const payload = {
      company_name: form.company_name,
      title: form.title,
      description: form.description,
      start_date: form.start_date,
      end_date: form.is_current ? null : (form.end_date || null),
    };

    if (isEdit) {
      router.put(`/${locale}/job-seeker/experience/${experience.id}`, payload, {
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
    } else {
      router.post(`/${locale}/job-seeker/experience`, payload, {
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
    }
  };

  const handleDelete = () => {
    if (!window.confirm(__('Are you sure you want to remove this experience?'))) return;
    setLoading(true);
    router.delete(`/${locale}/job-seeker/experience/${experience.id}`, {
      preserveScroll: true,
      onSuccess: () => {
        setLoading(false);
        onClose();
      },
      onError: () => setLoading(false),
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? __('Edit Work Experience') : __('Add Work Experience')}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Job Title */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Job Title')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder={__('e.g. Senior Frontend Engineer')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            required
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.title}</p>
          )}
        </div>

        {/* Company Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Company Name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="company_name"
            value={form.company_name}
            onChange={handleChange}
            placeholder={__('e.g. Google, Microsoft, Startup...')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            required
          />
          {errors.company_name && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.company_name}</p>
          )}
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {__('Start Date')} <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
              required
            />
            {errors.start_date && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.start_date}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {__('End Date')}
            </label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              disabled={form.is_current}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800 disabled:bg-slate-100 disabled:text-slate-400"
            />
            {errors.end_date && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.end_date}</p>
            )}
          </div>
        </div>

        {/* Currently Working Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="is_current"
            name="is_current"
            checked={form.is_current}
            onChange={handleChange}
            className="w-4 h-4 text-[#008A7B] border-slate-300 rounded focus:ring-[#008A7B]"
          />
          <label htmlFor="is_current" className="text-xs font-semibold text-slate-700 select-none cursor-pointer">
            {__('I currently work in this role')}
          </label>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Responsibilities & Description')}
          </label>
          <textarea
            name="description"
            rows="3"
            value={form.description}
            onChange={handleChange}
            placeholder={__('Outline your key achievements and daily responsibilities...')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800 resize-none"
          />
          {errors.description && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.description}</p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-6">
          {isEdit ? (
            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>{__('Delete')}</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
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
              {loading ? __('Saving...') : isEdit ? __('Save Changes') : __('Add Experience')}
            </button>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}

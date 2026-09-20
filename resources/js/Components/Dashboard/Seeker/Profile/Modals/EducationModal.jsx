import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import ModalWrapper from './ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import { Trash2 } from 'lucide-react';

export default function EducationModal({ isOpen, onClose, education = null }) {
  const { __, locale } = useTranslation();
  const isEdit = Boolean(education?.id);

  const [form, setForm] = useState({
    university: '',
    degree: '',
    gpa: '',
    start_year: '',
    end_year: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (education) {
      setForm({
        university: education.university || '',
        degree: education.degree || '',
        gpa: education.gpa || '',
        start_year: education.start_year || '',
        end_year: education.end_year || '',
      });
    } else {
      setForm({
        university: '',
        degree: '',
        gpa: '',
        start_year: new Date().getFullYear() - 4,
        end_year: new Date().getFullYear(),
      });
    }
    setErrors({});
  }, [education, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const payload = {
      ...form,
      start_year: parseInt(form.start_year, 10),
      end_year: form.end_year ? parseInt(form.end_year, 10) : null,
    };

    if (isEdit) {
      router.put(`/${locale}/job-seeker/education/${education.id}`, payload, {
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
      router.post(`/${locale}/job-seeker/education`, payload, {
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
    if (!window.confirm(__('Are you sure you want to remove this education?'))) return;
    setLoading(true);
    router.delete(`/${locale}/job-seeker/education/${education.id}`, {
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
      title={isEdit ? __('Edit Education') : __('Add Education')}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('University / Institution')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="university"
            value={form.university}
            onChange={handleChange}
            placeholder={__('e.g. Damascus University, Cairo University...')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            required
          />
          {errors.university && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.university}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Degree / Field of Study')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="degree"
            value={form.degree}
            onChange={handleChange}
            placeholder={__('e.g. Bachelor in Software Engineering')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            required
          />
          {errors.degree && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.degree}</p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {__('GPA / Grade')}
            </label>
            <input
              type="text"
              name="gpa"
              value={form.gpa}
              onChange={handleChange}
              placeholder={__('e.g. 3.8/4 or 85%')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            />
            {errors.gpa && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.gpa}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {__('Start Year')} <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="start_year"
              min="1950"
              max={new Date().getFullYear() + 10}
              value={form.start_year}
              onChange={handleChange}
              placeholder="2018"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
              required
            />
            {errors.start_year && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.start_year}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              {__('End Year')}
            </label>
            <input
              type="number"
              name="end_year"
              min="1950"
              max={new Date().getFullYear() + 10}
              value={form.end_year}
              onChange={handleChange}
              placeholder={__('Leave empty if current')}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            />
            {errors.end_year && (
              <p className="text-xs text-red-500 mt-1 font-medium">{errors.end_year}</p>
            )}
          </div>
        </div>

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
              {loading ? __('Saving...') : isEdit ? __('Save Changes') : __('Add Education')}
            </button>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}

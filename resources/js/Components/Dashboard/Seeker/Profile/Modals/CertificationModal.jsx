import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import ModalWrapper from './ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import { Trash2 } from 'lucide-react';

export default function CertificationModal({ isOpen, onClose, certification = null }) {
  const { __, locale } = useTranslation();
  const isEdit = Boolean(certification?.id);

  const [form, setForm] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    credential_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (certification) {
      setForm({
        name: certification.name || '',
        issuer: certification.issuer || '',
        issue_date: certification.issue_date || '',
        credential_url: certification.credential_url || '',
      });
    } else {
      setForm({
        name: '',
        issuer: '',
        issue_date: '',
        credential_url: '',
      });
    }
    setErrors({});
  }, [certification, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (isEdit) {
      router.put(`/${locale}/job-seeker/certifications/${certification.id}`, form, {
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
      router.post(`/${locale}/job-seeker/certifications`, form, {
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
    if (!window.confirm(__('Are you sure you want to remove this certification?'))) return;
    setLoading(true);
    router.delete(`/${locale}/job-seeker/certifications/${certification.id}`, {
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
      title={isEdit ? __('Edit Certificate') : __('Add Certificate')}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Certificate Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Certificate Name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder={__('e.g. AWS Certified Solutions Architect')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            required
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.name}</p>
          )}
        </div>

        {/* Issuing Organization */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Issuing Organization')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="issuer"
            value={form.issuer}
            onChange={handleChange}
            placeholder={__('e.g. Amazon Web Services, Google, Coursera...')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            required
          />
          {errors.issuer && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.issuer}</p>
          )}
        </div>

        {/* Issue Date */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Issue Date')}
          </label>
          <input
            type="date"
            name="issue_date"
            value={form.issue_date}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
          />
          {errors.issue_date && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.issue_date}</p>
          )}
        </div>

        {/* Credential URL */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Credential Link / Verification URL')}
          </label>
          <input
            type="url"
            name="credential_url"
            value={form.credential_url}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
          />
          {errors.credential_url && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.credential_url}</p>
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
              {loading ? __('Saving...') : isEdit ? __('Save Changes') : __('Add Certificate')}
            </button>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}

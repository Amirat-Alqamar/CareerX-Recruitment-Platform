import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import ModalWrapper from './ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import { Trash2, Upload, ExternalLink } from 'lucide-react';

export default function PortfolioModal({ isOpen, onClose, item = null }) {
  const { __, locale } = useTranslation();
  const isEdit = Boolean(item?.id);

  const [title, setTitle] = useState('');
  const [type, setType] = useState('Web Development');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [currentFilePath, setCurrentFilePath] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (item) {
      setTitle(item.title || '');
      setType(item.type || 'Web Development');
      setUrl(item.url || '');
      setCurrentFilePath(item.file_path || '');
      setFile(null);
    } else {
      setTitle('');
      setType('Web Development');
      setUrl('');
      setCurrentFilePath('');
      setFile(null);
    }
    setErrors({});
  }, [item, isOpen]);

  const categories = [
    'Web Development',
    'Mobile Application',
    'UI/UX Design',
    'Machine Learning / AI',
    'Cybersecurity',
    'DevOps & Cloud',
    'Graphic Design',
    'Other',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append('title', title);
    formData.append('type', type);
    if (url) formData.append('url', url);
    if (file) formData.append('file', file);

    if (isEdit) {
      formData.append('_method', 'PUT');
      router.post(`/${locale}/job-seeker/portfolio/${item.id}`, formData, {
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
      router.post(`/${locale}/job-seeker/portfolio`, formData, {
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
    if (!window.confirm(__('Are you sure you want to remove this project?'))) return;
    setLoading(true);
    router.delete(`/${locale}/job-seeker/portfolio/${item.id}`, {
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
      title={isEdit ? __('Edit Portfolio Project') : __('Add Portfolio Project')}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Project Title')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={__('e.g. E-Commerce Platform with React & Laravel')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
            required
          />
          {errors.title && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.title}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Category / Type')}
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {__(cat)}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.type}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Project URL / Live Link')}
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://github.com/username/project or https://myproject.com"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800"
          />
          {errors.url && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.url}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
            {__('Project Screenshot / Image (Optional)')}
          </label>
          {currentFilePath && !file && (
            <div className="mb-2 p-2 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
              <img
                src={`/storage/${currentFilePath}`}
                alt="Current project preview"
                className="w-16 h-12 object-cover rounded-lg"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-xs text-slate-500">{__('Current Image Uploaded')}</span>
            </div>
          )}
          <input
            type="file"
            accept="image/png,image/jpeg,image/jpg,application/pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#008A7B] file:text-white hover:file:bg-[#014D55] cursor-pointer"
          />
          {errors.file && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.file}</p>
          )}
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
              {loading ? __('Saving...') : isEdit ? __('Save Changes') : __('Add Project')}
            </button>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}

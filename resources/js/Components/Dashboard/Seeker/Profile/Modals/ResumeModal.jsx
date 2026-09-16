import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import ModalWrapper from './ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import { Trash2, Upload, FileText, Download } from 'lucide-react';

export default function ResumeModal({ isOpen, onClose, resumes = [] }) {
  const { __, locale } = useTranslation();

  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setErrors({});

    const formData = new FormData();
    formData.append('title', title || file.name);
    formData.append('file', file);

    router.post(`/${locale}/job-seeker/resumes`, formData, {
      preserveScroll: true,
      onSuccess: () => {
        setLoading(false);
        setTitle('');
        setFile(null);
      },
      onError: (err) => {
        setLoading(false);
        setErrors(err);
      },
    });
  };

  const handleDelete = (resumeId) => {
    if (!window.confirm(__('Are you sure you want to delete this resume?'))) return;
    setLoading(true);
    router.delete(`/${locale}/job-seeker/resumes/${resumeId}`, {
      preserveScroll: true,
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false),
    });
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={__('Manage Resumes (CV)')}
      maxWidth="max-w-xl"
    >
      <div className="space-y-6">
        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            {__('Upload New CV / Resume')}
          </label>

          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={__('CV Title (e.g. Frontend Developer CV - 2026)')}
              className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-xs text-slate-800 bg-white"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              id="cv_file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-[#008A7B] file:text-white hover:file:bg-[#014D55] cursor-pointer"
              required
            />
            <button
              type="submit"
              disabled={loading || !file}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-[#008A7B] hover:bg-[#014D55] rounded-xl shadow-sm transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>{loading ? __('Uploading...') : __('Upload')}</span>
            </button>
          </div>
          {errors.file && (
            <p className="text-xs text-red-500 font-medium">{errors.file}</p>
          )}
          {errors.title && (
            <p className="text-xs text-red-500 font-medium">{errors.title}</p>
          )}
          <p className="text-[11px] text-slate-400">
            {__('Supported formats: PDF, DOC, DOCX. Maximum file size: 5MB.')}
          </p>
        </form>

        {/* Resumes List */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 uppercase">
            {__('Your Uploaded Resumes')} ({resumes.length})
          </label>

          {resumes && resumes.length > 0 ? (
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {resumes.map((res) => (
                <div
                  key={res.id}
                  className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#E6F8F6] text-[#008A7B] flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-slate-800 text-xs truncate">
                        {res.title || __('Resume Document')}
                      </h5>
                      <span className="text-[10px] text-slate-400">
                        {new Date(res.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`/${locale}/job-seeker/resumes/${res.id}/download`}
                      className="p-1.5 text-slate-400 hover:text-[#008A7B] transition-colors"
                      title={__('Download')}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <button
                      type="button"
                      onClick={() => handleDelete(res.id)}
                      disabled={loading}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                      title={__('Delete')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              <p className="text-xs font-medium">{__('No resumes uploaded yet.')}</p>
            </div>
          )}
        </div>

        {/* Done Button */}
        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            {__('Done')}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

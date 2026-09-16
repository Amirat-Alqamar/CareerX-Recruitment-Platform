import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import ModalWrapper from './ModalWrapper';
import useTranslation from '@/hooks/useTranslation';
import { Trash2, Plus, Check } from 'lucide-react';

export default function LanguageModal({ isOpen, onClose, language = null, allLanguages = [] }) {
  const { __, locale } = useTranslation();
  const isEdit = Boolean(language?.id);

  const [name, setName] = useState('');
  const [level, setLevel] = useState('Native / Bilingual');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (language) {
      setName(language.name || '');
      setLevel(language.level || 'Native / Bilingual');
    } else {
      setName('');
      setLevel('Native / Bilingual');
    }
    setErrors({});
  }, [language, isOpen]);

  const levels = [
    'Native / Bilingual',
    'Fluent (C2)',
    'Advanced (C1)',
    'Upper Intermediate (B2)',
    'Intermediate (B1)',
    'Beginner (A1 - A2)',
  ];

  const popularLanguages = ['English', 'Arabic', 'French', 'German', 'Spanish', 'Turkish'];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    if (isEdit) {
      router.put(
        `/${locale}/job-seeker/languages/${language.id}`,
        { level },
        {
          preserveScroll: true,
          onSuccess: () => {
            setLoading(false);
            onClose();
          },
          onError: (err) => {
            setLoading(false);
            setErrors(err);
          },
        }
      );
    } else {
      router.post(
        `/${locale}/job-seeker/languages`,
        { language_name: name, level },
        {
          preserveScroll: true,
          onSuccess: () => {
            setLoading(false);
            onClose();
          },
          onError: (err) => {
            setLoading(false);
            setErrors(err);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (!window.confirm(__('Are you sure you want to remove this language?'))) return;
    setLoading(true);
    router.delete(`/${locale}/job-seeker/languages/${language.id}`, {
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
      title={isEdit ? __('Edit Language Level') : __('Add New Language')}
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Language Name */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            {__('Language Name')} <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isEdit}
            placeholder={__('e.g. English, French, Arabic...')}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800 disabled:bg-slate-100 disabled:text-slate-500"
            required
          />
          {errors.language_name && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.language_name}</p>
          )}

          {/* Popular Language Suggestions (Only in Add mode) */}
          {!isEdit && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {popularLanguages.map((lang) => (
                <button
                  type="button"
                  key={lang}
                  onClick={() => setName(lang)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                    name.toLowerCase() === lang.toLowerCase()
                      ? 'bg-[#E6F8F6] border-[#008A7B] text-[#008A7B] font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  + {__(lang)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Proficiency Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
            {__('Proficiency Level')} <span className="text-red-500">*</span>
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#008A7B] text-sm text-slate-800 bg-white"
            required
          >
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {__(lvl)}
              </option>
            ))}
          </select>
          {errors.level && (
            <p className="text-xs text-red-500 mt-1 font-medium">{errors.level}</p>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
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
              {loading ? __('Saving...') : isEdit ? __('Save Changes') : __('Add Language')}
            </button>
          </div>
        </div>
      </form>
    </ModalWrapper>
  );
}

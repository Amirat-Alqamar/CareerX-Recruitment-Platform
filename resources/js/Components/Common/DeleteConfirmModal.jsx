import React, { useEffect } from 'react';
import { Trash2, X, Loader2 } from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  cancelText,
  isLoading = false,
  icon,
  variant = 'danger',
  confirmButtonClass,
}) {
  const { __ } = useTranslation();

  const variantStyles = {
    danger: {
      headerIcon: 'text-rose-600',
      button: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-rose-200',
    },
    warning: {
      headerIcon: 'text-amber-600',
      button: 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-amber-200',
    },
    teal: {
      headerIcon: 'text-[#008A7B]',
      button: 'bg-[#008A7B] hover:bg-[#014D55] text-white shadow-sm hover:shadow',
    },
  }[variant] || {
    headerIcon: 'text-rose-600',
    button: 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white shadow-rose-200',
  };

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs cursor-pointer"
        onClick={!isLoading ? onClose : undefined}
      />

      <div className="relative bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-scale-up z-10">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className={`flex items-center gap-2 ${variantStyles.headerIcon}`}>
            {icon || <Trash2 className="w-5 h-5" />}
            <h3 className="text-base font-black text-slate-900">
              {title || __('Delete Confirmation')}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-slate-400 hover:text-slate-600 cursor-pointer disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {message || __('Are you sure you want to delete this item? This action cannot be undone.')}
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            {cancelText || __('Cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${confirmButtonClass || variantStyles.button}`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{__('Processing...')}</span>
              </>
            ) : (
              <span>{confirmText || __('Yes, Confirm')}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

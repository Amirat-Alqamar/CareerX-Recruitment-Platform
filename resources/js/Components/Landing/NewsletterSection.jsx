import React, { useState } from 'react';
import { Bell, Mail, Send, CheckCircle2, Loader2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function NewsletterSection() {
  const { __ } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); 
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage(__('Please enter a valid email address.'));
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1200);
  };

  return (
    <section className="py-20 bg-[#014D55] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/5 to-transparent pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
        <div className="max-w-2xl mx-auto text-center space-y-6">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-[#00BBA7] shadow-inner mx-auto">
            <Bell className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              {__('Never Miss a Dream Job')}
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal">
              {__('Get personalized job alerts delivered straight to your inbox. Join')}{' '}
              <span className="font-bold text-white">150,000+</span>{' '}
              {__('professionals who trust CareerX.')}
            </p>
          </div>

          {status === 'success' ? (
            <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-6 h-6 text-[#00BBA7] shrink-0" />
              <span className="font-medium text-sm sm:text-base">
                {__('Thank you for subscribing! Check your inbox for confirmation.')}
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-2 rounded-2xl shadow-xl border border-white/20">
                <div className="relative w-full flex items-center">
                  <Mail className="w-5 h-5 text-slate-400 absolute left-4 rtl:left-auto rtl:right-4 shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={__('Your email address')}
                    className="w-full pl-12 pr-4 rtl:pl-4 rtl:pr-12 py-3 bg-transparent text-slate-900 placeholder-slate-400 text-sm font-medium focus:outline-none"
                    disabled={status === 'loading'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#00BBA7] hover:bg-[#00A391] text-white font-bold text-sm rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shrink-0 shadow-md active:scale-95 cursor-pointer disabled:opacity-75"
                >
                  {status === 'loading' ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{__('Subscribing...')}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 rtl:rotate-180" />
                      <span>{__('Subscribe')}</span>
                    </>
                  )}
                </button>
              </div>

              {status === 'error' && (
                <p className="text-xs text-rose-300 font-medium text-left rtl:text-right px-2">
                  {errorMessage}
                </p>
              )}
            </form>
          )}

        </div>
      </div>
    </section>
  );
}

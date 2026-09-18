import React, { useState, useRef } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import { ShieldCheck, KeyRound, ArrowRight, Globe, Lock, Smartphone, RefreshCw, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function TwoFactorChallenge() {
    const { __, direction, locale, locales } = useTranslation();
    const [recovery, setRecovery] = useState(false);
    const codeInputRef = useRef(null);
    const recoveryInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        code: '',
        recovery_code: '',
    });

    const toggleRecovery = () => {
        const nextState = !recovery;
        setRecovery(nextState);
        clearErrors();
        reset();
        setTimeout(() => {
            if (nextState) {
                recoveryInputRef.current?.focus();
            } else {
                codeInputRef.current?.focus();
            }
        }, 100);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/two-factor-challenge');
    };

    return (
        <div className="min-h-screen flex bg-gray-100 font-sans" dir={direction}>
            <Head title={__('Two-Factor Authentication')} />

            {/* Left Hero Section */}
            <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-[#00B7B5] to-[#008A7B] p-12 flex-col justify-between text-white relative overflow-hidden">
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -left-10 top-1/4 w-60 h-60 bg-white/5 rounded-full blur-xl pointer-events-none" />

                <Link href={`/${locale}`} className="inline-flex items-center relative z-10">
                    <img
                        src="/images/careerX-logo.webp"
                        alt="CareerX"
                        className="h-9 w-auto object-contain brightness-0 invert"
                    />
                </Link>

                <div className="my-auto max-w-md relative z-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-6 shadow-inner border border-white/20">
                        <ShieldCheck className="w-9 h-9 text-white" />
                    </div>
                    <h3 className="text-3xl font-bold tracking-tight mb-3">
                        {__('Enhanced Account Security')}
                    </h3>
                    <p className="text-white/90 text-sm leading-relaxed mb-6 font-normal">
                        {__('Two-Factor Authentication (2FA) adds a vital layer of defense, ensuring that only you can access your career profile, applications, and confidential records.')}
                    </p>
                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3.5 rounded-xl border border-white/15">
                        <Smartphone className="w-5 h-5 text-white/80 shrink-0" />
                        <span className="text-xs text-white/90">
                            {__('Open Google Authenticator, Authy, or your preferred TOTP app to view your 6-digit code.')}
                        </span>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/20 flex items-center justify-between text-xs text-white/80 relative z-10">
                    <span>© {new Date().getFullYear()} CareerX Platform</span>
                    <span>{__('Military-grade encryption')}</span>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 relative">
                {/* Language Switcher */}
                <div className="self-end flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-xs text-xs font-semibold">
                        <Globe className="w-3.5 h-3.5 text-[#00B7B5] mx-1" />
                        {(locales.length > 0 ? locales : [
                            { code: 'en', native: 'EN', url: '/en/login' },
                            { code: 'ar', native: 'عربي', url: '/ar/login' }
                        ]).map((loc) => (
                            <a
                                key={loc.code}
                                href={loc.url}
                                className={`px-2.5 py-1 rounded-md transition-colors ${
                                    locale === loc.code
                                        ? 'bg-[#00B7B5] text-white font-bold'
                                        : 'text-gray-600 hover:text-gray-900'
                                }`}
                            >
                                {loc.code === 'ar' ? 'العربية' : 'English'}
                            </a>
                        ))}
                    </div>
                </div>

                <div className="max-w-md w-full mx-auto my-auto bg-white p-8 sm:p-10 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-teal-50 border border-teal-100 rounded-2xl mx-auto flex items-center justify-center mb-4 text-[#00B7B5] shadow-xs">
                            {recovery ? (
                                <KeyRound className="w-7 h-7" />
                            ) : (
                                <ShieldCheck className="w-7 h-7" />
                            )}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {recovery ? __('Emergency Recovery Code') : __('Two-Factor Authentication')}
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1.5 leading-relaxed">
                            {recovery
                                ? __('Please enter one of your emergency recovery codes that were provided when you enabled 2FA.')
                                : __('Please enter the 6-digit authentication code from your authenticator app.')}
                        </p>
                    </div>

                    {errors.code && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errors.code}</span>
                        </div>
                    )}
                    {errors.recovery_code && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{errors.recovery_code}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {!recovery ? (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-start">
                                    {__('Authentication Code')}
                                </label>
                                <div className="relative">
                                    <Smartphone className="w-4 h-4 text-gray-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        ref={codeInputRef}
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        autoFocus
                                        value={data.code}
                                        onChange={(e) => {
                                            // clean input
                                            const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                            setData('code', val);
                                        }}
                                        placeholder="123456"
                                        className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-3 text-center tracking-widest text-lg font-mono font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5 text-start">
                                    {__('Recovery Code')}
                                </label>
                                <div className="relative">
                                    <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                                    <input
                                        ref={recoveryInputRef}
                                        type="text"
                                        autoFocus
                                        value={data.recovery_code}
                                        onChange={(e) => setData('recovery_code', e.target.value)}
                                        placeholder="xxxx-xxxx-xxxx"
                                        className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-3 font-mono text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition text-start"
                                    />
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-[#00B7B5] hover:bg-[#009b99] disabled:opacity-70 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition duration-200 shadow-sm cursor-pointer"
                        >
                            {processing ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <span>{__('Verify & Continue')}</span>
                                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-5 border-t border-gray-100 text-center">
                        <button
                            type="button"
                            onClick={toggleRecovery}
                            className="text-xs font-medium text-[#00B7B5] hover:text-[#008A7B] hover:underline transition cursor-pointer inline-flex items-center gap-1.5"
                        >
                            {recovery ? (
                                <>
                                    <Smartphone className="w-3.5 h-3.5" />
                                    <span>{__('Use an authentication code from app')}</span>
                                </>
                            ) : (
                                <>
                                    <KeyRound className="w-3.5 h-3.5" />
                                    <span>{__('Use an emergency recovery code')}</span>
                                </>
                            )}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link
                            href={`/${locale}/login`}
                            className="text-xs text-gray-400 hover:text-gray-600 transition"
                        >
                            ← {__('Back to login')}
                        </Link>
                    </div>
                </div>

                <div className="text-center text-xs text-gray-400 mt-6">
                    {__('Need help? Contact CareerX Support')}
                </div>
            </div>
        </div>
    );
}

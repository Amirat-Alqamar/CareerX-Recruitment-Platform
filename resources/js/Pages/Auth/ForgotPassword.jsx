import React from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import { Mail, ArrowRight, ArrowLeft, CheckCircle2, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function ForgotPassword({ status }) {
    const { __, direction, locale, locales } = useTranslation();

    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative" dir={direction}>
            <Head title={__('Forgot your password?')} />
            {/* Language Switcher in top corner */}
            <div className="w-full max-w-md flex justify-end mb-4">
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-xs text-xs font-semibold">
                    <Globe className="w-3.5 h-3.5 text-primary mx-1" />
                    {(locales.length > 0 ? locales : [
                        { code: 'en', native: 'EN', url: '/en/forgot-password' },
                        { code: 'ar', native: 'عربي', url: '/ar/forgot-password' }
                    ]).map((loc) => (
                        <a
                            key={loc.code}
                            href={loc.url}
                            className={`px-2.5 py-1 rounded-md transition-colors ${
                                locale === loc.code
                                    ? 'bg-primary text-white font-bold'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {loc.code === 'ar' ? 'العربية' : 'English'}
                        </a>
                    ))}
                </div>
            </div>

            {/* Logo & Header */}
            <div className="text-center mb-8">
                <Link href={`/${locale}`} className="inline-block mb-2">
                    <img
                        src="/images/careerX-logo.webp"
                        alt="CareerX"
                        className="h-10 w-auto mx-auto object-contain"
                    />
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">{__('Forgot your password?')}</h1>
                <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
                    {__("No problem. Just enter your email address and we'll send you a link to reset your password.")}
                </p>
            </div>

            {/* Main Form Card */}
            <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">

                {/* Success Status Alert */}
                {status && (
                    <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2.5 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{status}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">{__('Email Address')}</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoFocus
                                className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-[#00B7B5] hover:bg-[#009b99] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition duration-200 shadow-sm mt-4 cursor-pointer disabled:opacity-75"
                    >
                        <span>{__('Send Password Reset Link')}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                </form>

                {/* Back to Login Link */}
                <p className="text-center text-xs text-gray-500 mt-6 flex items-center justify-center gap-1.5">
                    <ArrowLeft className="w-3.5 h-3.5 rtl:rotate-180 text-gray-400" />
                    <Link
                        href={`/${locale}/login`}
                        className="font-semibold text-[#00B7B5] hover:underline"
                    >
                        {__('Back to sign in')}
                    </Link>
                </p>
            </div>
        </div>
    );
}

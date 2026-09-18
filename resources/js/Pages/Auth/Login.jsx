import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Login() {
    const { __, direction, locale, locales } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div className="min-h-screen flex bg-gray-100" dir={direction}>
            <Head title={__('Login')} />
            {/* Left Hero Section */}
            <div className="hidden lg:flex lg:w-5/12 bg-[#00B7B5] p-12 flex-col justify-between text-white relative overflow-hidden">
                <Link href={`/${locale}`} className="inline-flex items-center">
                    <img
                        src="/images/careerX-logo.webp"
                        alt="CareerX"
                        className="h-9 w-auto object-contain brightness-0 invert"
                    />
                </Link>

                <div className="my-auto max-w-md">
                    <p className="text-2xl font-medium leading-relaxed mb-6">
                        "{__('CareerX helped me land my dream job at a top tech company in just 3 weeks. The platform is incredibly intuitive.')}"
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">
                            SJ
                        </div>
                        <div>
                            <h4 className="font-semibold text-sm">{__('Sarah Johnson')}</h4>
                            <p className="text-xs text-white/80">{__('UX Designer at Google')}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/20">
                    <div>
                        <div className="text-2xl font-bold">{__('50K+')}</div>
                        <div className="text-xs text-white/80">{__('Jobs Listed')}</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{__('10K+')}</div>
                        <div className="text-xs text-white/80">{__('Companies')}</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{__('98%')}</div>
                        <div className="text-xs text-white/80">{__('Match Rate')}</div>
                    </div>
                </div>
            </div>

            {/* Right Form Section */}
            <div className="flex-1 flex flex-col justify-between p-6 sm:p-12 relative">
                {/* Language Switcher in top corner */}
                <div className="self-end flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-xs text-xs font-semibold">
                        <Globe className="w-3.5 h-3.5 text-primary mx-1" />
                        {(locales.length > 0 ? locales : [
                            { code: 'en', native: 'EN', url: '/en/login' },
                            { code: 'ar', native: 'عربي', url: '/ar/login' }
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

                <div className="max-w-md w-full mx-auto my-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                    <div className="text-center mb-6">
                        <Link href={`/${locale}`} className="inline-block mb-2">
                            <img
                                src="/images/careerX-logo.webp"
                                alt="CareerX"
                                className="h-10 w-auto mx-auto object-contain"
                            />
                        </Link>
                        <h2 className="text-2xl font-bold text-gray-900">{__('Welcome back')}</h2>
                        <p className="text-sm text-gray-500 mt-1">{__('Sign in to your CareerX account')}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">{__('Email Address')}</label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-gray-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">{__('Password')}</label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-gray-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    placeholder={__('Your password')}
                                    className="w-full pl-9 pr-10 rtl:pl-10 rtl:pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                                <input
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={e => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-[#00B7B5] focus:ring-[#00B7B5]"
                                />
                                {__('Remember me')}
                            </label>
                            <Link href={`/${locale}/forgot-password`} className="font-semibold text-gray-700 hover:text-[#00B7B5]">
                                {__('Forgot password?')}
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-[#00B7B5] hover:bg-[#009b99] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition duration-200 shadow-sm cursor-pointer"
                        >
                            <span>{__('Sign In')}</span>
                            <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        {__("Don't have an account?")}{' '}
                        <Link href={`/${locale}/register`} className="font-semibold text-[#00B7B5] hover:underline">
                            {__('Create account')}
                        </Link>
                    </p>
                </div>

                <div className="flex justify-center gap-6 text-xs text-gray-400 mt-6">
                    <Link href={`/${locale}/register`} className="hover:text-gray-600">{__('Sign in as Company →')}</Link>
                    <Link href="#" className="hover:text-gray-600">{__('Admin Portal →')}</Link>
                </div>
            </div>
        </div>
    );
}

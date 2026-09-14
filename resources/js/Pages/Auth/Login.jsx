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

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <button type="button" className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer">
                            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
                            {__('Google')}
                        </button>
                        <button type="button" className="flex items-center justify-center gap-2 py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition cursor-pointer">
                            <svg className="w-4 h-4 fill-[#0A66C2]" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.7a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26z"/></svg>
                            {__('LinkedIn')}
                        </button>
                    </div>

                    <div className="relative flex items-center justify-center mb-6">
                        <div className="border-t border-gray-200 w-full"></div>
                        <span className="bg-white px-3 text-xs text-gray-400 absolute">{__('or continue with email')}</span>
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

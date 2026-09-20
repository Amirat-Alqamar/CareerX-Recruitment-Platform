import React, { useState } from 'react';
import { useForm, Link, Head } from '@inertiajs/react';
import { User, Building, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function Register() {
    const { __, direction, locale, locales } = useTranslation();
    const [accountType, setAccountType] = useState('job_seeker'); 
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors, setError } = useForm({
        role: 'job_seeker',
        name: '',
        company_name: '',
        email: '',
        password: '',
        terms: false,
    });

    const handleRoleChange = (role) => {
        setAccountType(role);
        setData('role', role);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!data.terms) {
            setError('terms', __('You must agree to the Terms of Service and Privacy Policy.'));
            return;
        }
        post('/register');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative" dir={direction}>
            <Head title={__('Register')} />
            <div className="w-full max-w-2xl flex justify-end mb-4">
                <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-xs text-xs font-semibold">
                    <Globe className="w-3.5 h-3.5 text-primary mx-1" />
                    {(locales.length > 0 ? locales : [
                        { code: 'en', native: 'EN', url: '/en/register' },
                        { code: 'ar', native: 'عربي', url: '/ar/register' }
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

            <div className="text-center mb-8">
                <Link href={`/${locale}`} className="inline-block mb-2">
                    <img
                        src="/images/careerX-logo.webp"
                        alt="CareerX"
                        className="h-10 w-auto mx-auto object-contain"
                    />
                </Link>
                <h1 className="text-3xl font-extrabold text-gray-900">{__('Create your account')}</h1>
                <p className="text-sm text-gray-500 mt-1">{__('Join 850,000+ professionals on CareerX')}</p>
            </div>

            <div className="max-w-2xl w-full bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div
                        onClick={() => handleRoleChange('job_seeker')}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                            accountType === 'job_seeker'
                            ? 'border-[#00B7B5] bg-teal-50/30'
                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                        }`}
                    >
                        {accountType === 'job_seeker' && (
                            <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-5 h-5 bg-[#00B7B5] rounded-full flex items-center justify-center text-white">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                        <div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${accountType === 'job_seeker' ? 'bg-[#00B7B5] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                <User className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-base">{__('Job Seeker')}</h3>
                            <p className="text-xs text-gray-500 mb-4">{__('Find your dream job and advance your career')}</p>
                        </div>

                        <ul className="space-y-2 text-xs text-gray-600">
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> {__('Free job applications')}</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> {__('AI-powered job matching')}</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> {__('Resume builder')}</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> {__('Interview prep')}</li>
                        </ul>
                    </div>

                    <div
                        onClick={() => handleRoleChange('employer')}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                            accountType === 'employer'
                            ? 'border-[#00B7B5] bg-teal-50/30'
                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                        }`}
                    >
                        {accountType === 'employer' && (
                            <div className="absolute top-3 right-3 rtl:right-auto rtl:left-3 w-5 h-5 bg-[#00B7B5] rounded-full flex items-center justify-center text-white">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                        <div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${accountType === 'employer' ? 'bg-[#00B7B5] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                <Building className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-base">{__('Company / Employer')}</h3>
                            <p className="text-xs text-gray-500 mb-4">{__('Post jobs and find the perfect candidates')}</p>
                        </div>

                        <ul className="space-y-2 text-xs text-gray-600">
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> {__('Post up to 5 free jobs')}</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> {__('ATS & pipeline tools')}</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> {__('Candidate screening')}</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> {__('Analytics & reports')}</li>
                        </ul>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">

                    {accountType === 'job_seeker' ? (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">{__('Full Name')}</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-gray-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder={__('Your full name')}
                                    className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">{__('Company Name')}</label>
                            <div className="relative">
                                <Building className="w-4 h-4 text-gray-400 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={e => setData('company_name', e.target.value)}
                                    placeholder={__('Your company name')}
                                    className="w-full pl-9 pr-4 rtl:pl-4 rtl:pr-9 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                                />
                            </div>
                            {errors.company_name && <p className="text-xs text-red-500 mt-1">{errors.company_name}</p>}
                        </div>
                    )}

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
                                placeholder={__('Min. 8 characters')}
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

                    <div className="pt-2">
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="terms"
                                required
                                checked={data.terms}
                                onChange={e => setData('terms', e.target.checked)}
                                className="rounded border-gray-300 text-[#00B7B5] focus:ring-[#00B7B5] cursor-pointer"
                            />
                            <label htmlFor="terms" className="text-xs text-gray-600 cursor-pointer select-none">
                                {__("I agree to CareerX's")}{' '}
                                <Link href={`/${locale}/terms`} className="font-semibold text-gray-800 hover:underline">{__('Terms of Service')}</Link>{' '}
                                {__('and')}{' '}
                                <Link href={`/${locale}/privacy`} className="font-semibold text-gray-800 hover:underline">{__('Privacy Policy')}</Link>
                            </label>
                        </div>
                        {errors.terms && <p className="text-xs text-rose-500 font-medium mt-1.5">{errors.terms}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-[#00B7B5] hover:bg-[#009b99] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition duration-200 shadow-sm mt-4 cursor-pointer"
                    >
                        <span>{__('Create Account')}</span>
                        <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                    {__('Already have an account?')}{' '}
                    <Link href={`/${locale}/login`} className="font-semibold text-[#00B7B5] hover:underline">
                        {__('Sign in')}
                    </Link>
                </p>
            </div>
        </div>
    );
}

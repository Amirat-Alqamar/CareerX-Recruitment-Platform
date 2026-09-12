import React, { useState } from 'react';
import { useForm, Link } from '@inertiajs/react';
import { User, Building, Mail, Lock, Eye, EyeOff, ArrowRight, Check, Briefcase } from 'lucide-react';

export default function Register() {
    const [accountType, setAccountType] = useState('job_seeker'); // 'job_seeker' or 'company'
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
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
        post('/register');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
            {/* Logo & Header */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 font-bold text-xl text-gray-900 mb-2">
                    <div className="p-2 bg-[#00B7B5] text-white rounded-lg">
                        <Briefcase className="w-5 h-5" />
                    </div>
                    TalentFlow
                </div>
                <h1 className="text-3xl font-extrabold text-gray-900">Create your account</h1>
                <p className="text-sm text-gray-500 mt-1">Join 850,000+ professionals on TalentFlow</p>
            </div>

            {/* Main Form Card */}
            <div className="max-w-2xl w-full bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">

                {/* Account Type Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Job Seeker Option */}
                    <div
                        onClick={() => handleRoleChange('job_seeker')}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                            accountType === 'job_seeker'
                            ? 'border-[#00B7B5] bg-teal-50/30'
                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                        }`}
                    >
                        {accountType === 'job_seeker' && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-[#00B7B5] rounded-full flex items-center justify-center text-white">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                        <div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${accountType === 'job_seeker' ? 'bg-[#00B7B5] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                <User className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-base">Job Seeker</h3>
                            <p className="text-xs text-gray-500 mb-4">Find your dream job and advance your career</p>
                        </div>

                        <ul className="space-y-2 text-xs text-gray-600">
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> Free job applications</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> AI-powered job matching</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> Resume builder</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> Interview prep</li>
                        </ul>
                    </div>

                    {/* Company Option */}
                    <div
                        onClick={() => handleRoleChange('company')}
                        className={`p-5 rounded-xl border-2 cursor-pointer transition relative flex flex-col justify-between ${
                            accountType === 'company'
                            ? 'border-[#00B7B5] bg-teal-50/30'
                            : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                        }`}
                    >
                        {accountType === 'company' && (
                            <div className="absolute top-3 right-3 w-5 h-5 bg-[#00B7B5] rounded-full flex items-center justify-center text-white">
                                <Check className="w-3 h-3" />
                            </div>
                        )}
                        <div>
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${accountType === 'company' ? 'bg-[#00B7B5] text-white' : 'bg-gray-200 text-gray-600'}`}>
                                <Building className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900 text-base">Company / Employer</h3>
                            <p className="text-xs text-gray-500 mb-4">Post jobs and find the perfect candidates</p>
                        </div>

                        <ul className="space-y-2 text-xs text-gray-600">
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> Post up to 5 free jobs</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> ATS & pipeline tools</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> Candidate screening</li>
                            <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-[#00B7B5]" /> Analytics & reports</li>
                        </ul>
                    </div>
                </div>

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">

                    {/* Dynamic Field Name */}
                    {accountType === 'job_seeker' ? (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Your full name"
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                                />
                            </div>
                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Company Name</label>
                            <div className="relative">
                                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={data.company_name}
                                    onChange={e => setData('company_name', e.target.value)}
                                    placeholder="Your company name"
                                    className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                                />
                            </div>
                            {errors.company_name && <p className="text-xs text-red-500 mt-1">{errors.company_name}</p>}
                        </div>
                    )}

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                placeholder="you@example.com"
                                className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                            />
                        </div>
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                placeholder="Min. 8 characters"
                                className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                    </div>

                    {/* Terms */}
                    <div className="flex items-center gap-2 pt-2">
                        <input
                            type="checkbox"
                            id="terms"
                            checked={data.terms}
                            onChange={e => setData('terms', e.target.checked)}
                            className="rounded border-gray-300 text-[#00B7B5] focus:ring-[#00B7B5]"
                        />
                        <label htmlFor="terms" className="text-xs text-gray-600">
                            I agree to TalentFlow's <Link href="#" className="font-semibold text-gray-800 hover:underline">Terms of Service</Link> and <Link href="#" className="font-semibold text-gray-800 hover:underline">Privacy Policy</Link>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-3 bg-[#00B7B5] hover:bg-[#009b99] text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition duration-200 shadow-sm mt-4"
                    >
                        Create Account
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </form>

                <p className="text-center text-xs text-gray-500 mt-6">
                    Already have an account? <Link href="/login" className="font-semibold text-[#00B7B5] hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

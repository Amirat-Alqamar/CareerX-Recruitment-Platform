import React from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function TwoFactorAuth({ user }) {
    const { __, locale } = useTranslation();
    const { errors } = usePage().props;

    const handleEnable = (e) => {
        e.preventDefault();
        router.post('/user/two-factor-authentication', {}, {
            preserveScroll: true,
        });
    };

    const handleDisable = (e) => {
        e.preventDefault();
        router.delete('/user/two-factor-authentication', {
            preserveScroll: true,
        });
    };

    const isEnabled = Boolean(user?.two_factor_secret);

    return (
        <DashboardLayout>
            <Head title={__('Two Factor Authentication')} />

            <div className="container-fluid max-w-4xl mx-auto py-4">
                <nav className="flex mb-4 text-xs font-semibold text-slate-500">
                    <a href={`/${locale}/2fa`} className="hover:text-[#008A7B]">
                        {__('Two Factor Authentication')}
                    </a>
                </nav>

                <div className="row">
                    <div className="col-md-8 w-full">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="bg-[#008A7B] text-white px-6 py-4">
                                <h3 className="text-lg font-bold">
                                    {__('Two-Factor Authentication')}
                                </h3>
                            </div>

                            <div className="p-6">
                                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                                    {__('Two-factor authentication (2FA) adds an extra layer of security to your account by requiring a form of verification in addition to your password. This helps protect your account from unauthorized access, even if someone obtains your password.')}
                                </p>

                                {errors && Object.keys(errors).length > 0 && (
                                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm">
                                        <ul className="list-disc list-inside space-y-1">
                                            {Object.values(errors).map((error, idx) => (
                                                <li key={idx}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {!isEnabled ? (
                                    <div className="space-y-4">
                                        <p className="text-sm font-medium text-slate-700">
                                            {__('Two-factor authentication is not enabled for this account.')}
                                        </p>
                                        <form onSubmit={handleEnable}>
                                            <button
                                                type="submit"
                                                className="px-5 py-2.5 bg-[#008A7B] hover:bg-[#007064] text-white font-semibold rounded-xl text-sm transition cursor-pointer shadow-sm"
                                            >
                                                {__('Enable Two-Factor Authentication')}
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h5 className="font-bold text-slate-800 text-sm mb-1">
                                                    {__('Two-factor authentication is enabled for this account.')}
                                                </h5>
                                                <p className="text-xs text-slate-500 mb-3">
                                                    {__('Scan the QR code below to set up your authenticator app.')}
                                                </p>
                                                {user?.qr_code && (
                                                    <div
                                                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 inline-block [&>svg]:w-44 [&>svg]:h-44"
                                                        dangerouslySetInnerHTML={{ __html: user.qr_code }}
                                                    />
                                                )}
                                            </div>

                                            <div>
                                                <h5 className="font-bold text-slate-800 text-sm mb-1">
                                                    {__('Recovery Codes')}
                                                </h5>
                                                <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                                                    {__('Keep these recovery codes in a safe place. You can use them to access your account if you lose access to your authenticator app.')}
                                                </p>
                                                <ul className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200 text-xs font-mono font-semibold text-slate-700 max-h-48 overflow-y-auto">
                                                    {user?.recovery_codes?.map((code, idx) => (
                                                        <li key={idx} className="px-4 py-2">
                                                            {code}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <hr className="border-slate-200 my-4" />

                                        <form onSubmit={handleDisable}>
                                            <button
                                                type="submit"
                                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition cursor-pointer shadow-sm"
                                            >
                                                {__('Disable Two-Factor Authentication')}
                                            </button>
                                        </form>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}

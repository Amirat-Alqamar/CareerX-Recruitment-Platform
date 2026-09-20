import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import axios from 'axios';
import {
    ShieldCheck,
    ShieldAlert,
    QrCode,
    KeyRound,
    Copy,
    Check,
    Download,
    RefreshCw,
    X,
    Lock,
    Smartphone,
    AlertTriangle,
    Eye,
    EyeOff
} from 'lucide-react';
import useTranslation from '@/hooks/useTranslation';

export default function TwoFactorModal({ isOpen, onClose }) {
    const { __, direction } = useTranslation();
    const { auth } = usePage().props;
    const user = auth?.user;

    const [loading, setLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState(null);
    const [copiedCodes, setCopiedCodes] = useState(false);
    const [copiedKey, setCopiedKey] = useState(false);

    const [step, setStep] = useState('status');

    const [qrCodeSvg, setQrCodeSvg] = useState('');
    const [secretKey, setSecretKey] = useState('');
    const [recoveryCodes, setRecoveryCodes] = useState([]);
    const [confirmationCode, setConfirmationCode] = useState('');
    const [confirmError, setConfirmError] = useState('');

    const isEnabled = Boolean(user?.two_factor_enabled && user?.two_factor_confirmed);
    const isPendingConfirmation = Boolean(user?.two_factor_enabled && !user?.two_factor_confirmed);

    useEffect(() => {
        if (isOpen) {
            setError(null);
            setConfirmError('');
            setConfirmationCode('');
            if (isPendingConfirmation) {
                fetchSetupData();
                setStep('enabling');
            } else {
                setStep('status');
            }
        }
    }, [isOpen, isPendingConfirmation]);

    const fetchSetupData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [qrRes, secretRes, codesRes] = await Promise.all([
                axios.get('/user/two-factor-qr-code'),
                axios.get('/user/two-factor-secret-key').catch(() => ({ data: { secretKey: '' } })),
                axios.get('/user/two-factor-recovery-codes').catch(() => ({ data: [] }))
            ]);

            setQrCodeSvg(qrRes.data.svg || '');
            setSecretKey(secretRes.data.secretKey || '');
            setRecoveryCodes(Array.isArray(codesRes.data) ? codesRes.data : []);
        } catch (err) {
            console.error('Failed to fetch 2FA data', err);
            setError(__('Failed to load two-factor authentication details. Please try again.'));
        } finally {
            setLoading(false);
        }
    };

    const handleEnable2FA = async () => {
        setActionLoading(true);
        setError(null);
        try {
            await axios.post('/user/two-factor-authentication');
            await fetchSetupData();
            setStep('enabling');
            router.reload({ only: ['auth'] });
        } catch (err) {
            console.error('Failed to enable 2FA', err);
            setError(err.response?.data?.message || __('Failed to initialize 2FA setup.'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleConfirm2FA = async (e) => {
        e.preventDefault();
        if (!confirmationCode || confirmationCode.length < 6) {
            setConfirmError(__('Please enter a valid 6-digit code.'));
            return;
        }

        setActionLoading(true);
        setConfirmError('');
        try {
            await axios.post('/user/confirmed-two-factor-authentication', {
                code: confirmationCode
            });
            const codesRes = await axios.get('/user/two-factor-recovery-codes');
            setRecoveryCodes(Array.isArray(codesRes.data) ? codesRes.data : []);
            setStep('show_recovery');
            router.reload({ only: ['auth'] });
        } catch (err) {
            console.error('Failed to confirm 2FA', err);
            setConfirmError(err.response?.data?.errors?.code?.[0] || __('Invalid authentication code. Please try again.'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleFetchRecoveryCodes = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/user/two-factor-recovery-codes');
            setRecoveryCodes(Array.isArray(res.data) ? res.data : []);
            setStep('show_recovery');
        } catch (err) {
            setError(__('Failed to fetch recovery codes.'));
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateCodes = async () => {
        setActionLoading(true);
        try {
            await axios.post('/user/two-factor-recovery-codes');
            const res = await axios.get('/user/two-factor-recovery-codes');
            setRecoveryCodes(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setError(__('Failed to regenerate recovery codes.'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        setActionLoading(true);
        setError(null);
        try {
            await axios.delete('/user/two-factor-authentication');
            setStep('status');
            router.reload({ only: ['auth'] });
            onClose();
        } catch (err) {
            console.error('Failed to disable 2FA', err);
            setError(__('Failed to disable two-factor authentication.'));
        } finally {
            setActionLoading(false);
        }
    };

    const handleCopyCodes = () => {
        if (!recoveryCodes.length) return;
        navigator.clipboard.writeText(recoveryCodes.join('\n'));
        setCopiedCodes(true);
        setTimeout(() => setCopiedCodes(false), 3000);
    };

    const handleCopyKey = () => {
        if (!secretKey) return;
        navigator.clipboard.writeText(secretKey);
        setCopiedKey(true);
        setTimeout(() => setCopiedKey(false), 3000);
    };

    const handleDownloadCodes = () => {
        const text = `CareerX Two-Factor Recovery Codes\nGenerated: ${new Date().toLocaleString()}\nAccount: ${user?.email}\n\n${recoveryCodes.join('\n')}\n\nKeep these codes safe and confidential. Each code can be used once.`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `careerx-2fa-recovery-codes-${user?.id || 'backup'}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in" dir={direction}>
            <div className="fixed inset-0" onClick={onClose} />

            <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 border border-slate-100 max-h-[90vh]">
                <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50/70">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-teal-50 border border-teal-100 text-[#00B7B5] flex items-center justify-center shadow-xs">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">
                                {__('Two-Factor Authentication')}
                            </h3>
                            <p className="text-xs text-slate-500 font-normal">
                                {__('Protect your CareerX account with TOTP verification')}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="overflow-y-auto p-6 space-y-6">
                    {error && (
                        <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-2.5 text-xs text-red-600">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-3">
                            <RefreshCw className="w-8 h-8 animate-spin text-[#00B7B5]" />
                            <span className="text-xs font-medium">{__('Loading security settings...')}</span>
                        </div>
                    ) : (
                        <>
                            {step === 'status' && (
                                <div className="space-y-6">
                                    <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                                        isEnabled
                                            ? 'bg-teal-50/60 border-teal-200/80 text-teal-950'
                                            : 'bg-slate-50 border-slate-200 text-slate-800'
                                    }`}>
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                            isEnabled
                                                ? 'bg-[#00B7B5] text-white shadow-sm'
                                                : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {isEnabled ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm">
                                                {isEnabled ? __('Two-Factor Authentication is Enabled') : __('Two-Factor Authentication is Disabled')}
                                            </h4>
                                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                                                {isEnabled
                                                    ? __('Your account is guarded with two-factor authentication. You will be prompted for a 6-digit TOTP code each time you sign in.')
                                                    : __('Two-Factor Authentication (2FA) adds a vital layer of defense, ensuring that only you can access your career profile, applications, and confidential records.')}
                                            </p>
                                        </div>
                                    </div>

                                    {!isEnabled ? (
                                        <div className="space-y-4">
                                            <div className="p-4 bg-teal-50/30 rounded-2xl border border-teal-100 text-xs text-slate-600 space-y-2">
                                                <div className="font-semibold text-slate-900 flex items-center gap-2">
                                                    <Smartphone className="w-4 h-4 text-[#00B7B5]" />
                                                    <span>{__('Supported Authenticator Apps:')}</span>
                                                </div>
                                                <p className="text-slate-500">
                                                    Google Authenticator, Microsoft Authenticator, Authy, 1Password, Bitwarden, Apple Keychain.
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={actionLoading}
                                                onClick={handleEnable2FA}
                                                className="w-full py-3.5 bg-[#00B7B5] hover:bg-[#009b99] text-white font-bold rounded-2xl text-sm flex items-center justify-center gap-2 transition duration-200 shadow-sm cursor-pointer disabled:opacity-60"
                                            >
                                                {actionLoading ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <ShieldCheck className="w-4 h-4" />
                                                        <span>{__('Enable 2FA')}</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-3 pt-2">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleFetchRecoveryCodes}
                                                    className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                                                >
                                                    <KeyRound className="w-4 h-4 text-[#00B7B5]" />
                                                    <span>{__('Recovery Codes')}</span>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setStep('confirm_disable')}
                                                    className="py-3 px-4 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer border border-red-100"
                                                >
                                                    <ShieldAlert className="w-4 h-4" />
                                                    <span>{__('Disable 2FA')}</span>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {step === 'enabling' && (
                                <div className="space-y-5">
                                    <div className="text-center">
                                        <span className="text-xs font-bold text-[#00B7B5] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                                            {__('Step 1 of 2')}
                                        </span>
                                        <h4 className="font-bold text-slate-900 text-base mt-2">
                                            {__('Scan QR Code')}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                                            {__('Scan the QR code below using an authenticator app like Google Authenticator, Microsoft Authenticator, or 1Password.')}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-center justify-center p-5 bg-slate-50 rounded-2xl border border-slate-200">
                                        {qrCodeSvg ? (
                                            <div
                                                className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center [&>svg]:w-48 [&>svg]:h-48"
                                                dangerouslySetInnerHTML={{ __html: qrCodeSvg }}
                                            />
                                        ) : (
                                            <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-2xl" />
                                        )}

                                        {secretKey && (
                                            <div className="mt-4 text-center">
                                                <div className="text-[11px] text-slate-500 font-medium mb-1">
                                                    {__('Setup Key')} ({__('if you cannot scan QR')})
                                                </div>
                                                <div className="inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-700 select-all">
                                                    <span>{secretKey}</span>
                                                    <button
                                                        type="button"
                                                        onClick={handleCopyKey}
                                                        className="text-slate-400 hover:text-slate-700 cursor-pointer"
                                                        title={__('Copy')}
                                                    >
                                                        {copiedKey ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleConfirm2FA} className="space-y-4 pt-2">
                                        <div className="text-center">
                                            <span className="text-xs font-bold text-[#00B7B5] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-100">
                                                {__('Step 2 of 2')}
                                            </span>
                                            <h4 className="font-bold text-slate-900 text-sm mt-2">
                                                {__('Confirm 6-Digit Code')}
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {__('Enter the code generated by your app to complete setup')}
                                            </p>
                                        </div>

                                        {confirmError && (
                                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                                <span>{confirmError}</span>
                                            </div>
                                        )}

                                        <div className="max-w-xs mx-auto">
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                autoComplete="one-time-code"
                                                value={confirmationCode}
                                                onChange={(e) => {
                                                    const val = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
                                                    setConfirmationCode(val);
                                                }}
                                                placeholder="123456"
                                                className="w-full py-3 text-center tracking-widest text-xl font-mono font-bold border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#00B7B5] focus:border-transparent outline-none transition"
                                            />
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setStep('status')}
                                                className="w-1/3 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-xs transition cursor-pointer"
                                            >
                                                {__('Cancel')}
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={actionLoading || confirmationCode.length < 6}
                                                className="w-2/3 py-3 bg-[#00B7B5] hover:bg-[#009b99] disabled:opacity-60 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition duration-200 shadow-sm cursor-pointer"
                                            >
                                                {actionLoading ? (
                                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4" />
                                                        <span>{__('Verify & Activate')}</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {step === 'show_recovery' && (
                                <div className="space-y-5">
                                    <div className="p-4 bg-teal-50 border border-teal-100 rounded-2xl flex items-start gap-3 text-teal-950">
                                        <KeyRound className="w-5 h-5 text-[#00B7B5] shrink-0 mt-0.5" />
                                        <div className="text-xs leading-relaxed">
                                            <div className="font-bold text-slate-900 mb-1">
                                                {__('Recovery Codes')}
                                            </div>
                                            {__('Store these recovery codes in a secure password manager. You can use them to sign in if you lose access to your authenticator device.')}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                        {recoveryCodes.map((code, idx) => (
                                            <div
                                                key={idx}
                                                className="bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-semibold text-slate-800 text-center tracking-wider select-all"
                                            >
                                                {code}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2 justify-between pt-2">
                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleCopyCodes}
                                                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                                            >
                                                {copiedCodes ? <Check className="w-3.5 h-3.5 text-teal-600" /> : <Copy className="w-3.5 h-3.5" />}
                                                <span>{copiedCodes ? __('Codes Copied!') : __('Copy All')}</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={handleDownloadCodes}
                                                className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                                            >
                                                <Download className="w-3.5 h-3.5" />
                                                <span>{__('Download TXT')}</span>
                                            </button>
                                        </div>

                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={handleRegenerateCodes}
                                            className="py-2.5 px-3 text-slate-500 hover:text-slate-800 font-semibold rounded-xl text-xs flex items-center gap-1 transition cursor-pointer"
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 ${actionLoading ? 'animate-spin' : ''}`} />
                                            <span>{__('Regenerate Codes')}</span>
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep('status');
                                            onClose();
                                        }}
                                        className="w-full py-3 bg-[#00B7B5] hover:bg-[#009b99] text-white font-bold rounded-2xl text-xs transition duration-200 shadow-sm cursor-pointer mt-3"
                                    >
                                        {__('Done')}
                                    </button>
                                </div>
                            )}

                            {step === 'confirm_disable' && (
                                <div className="space-y-5 text-center py-2">
                                    <div className="w-14 h-14 bg-red-50 border border-red-100 text-red-600 rounded-2xl mx-auto flex items-center justify-center">
                                        <AlertTriangle className="w-7 h-7" />
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-slate-900 text-base">
                                            {__('Disable 2FA')}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                                            {__('Are you sure you want to disable Two-Factor Authentication? Your account will be less secure.')}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-3 pt-3">
                                        <button
                                            type="button"
                                            onClick={() => setStep('status')}
                                            className="w-1/2 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl text-xs transition cursor-pointer"
                                        >
                                            {__('Cancel')}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={handleDisable2FA}
                                            className="w-1/2 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                                        >
                                            {actionLoading ? (
                                                <RefreshCw className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <ShieldAlert className="w-4 h-4" />
                                                    <span>{__('Confirm Disable')}</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

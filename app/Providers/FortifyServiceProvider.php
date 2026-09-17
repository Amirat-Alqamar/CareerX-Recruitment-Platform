<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Actions\Fortify\UpdateUserPassword;
use App\Actions\Fortify\UpdateUserProfileInformation;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Laravel\Fortify\Actions\RedirectIfTwoFactorAuthenticatable;
use Laravel\Fortify\Fortify;
use App\Models\User;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        // توجيه ذكي بحسب نوع الحساب بعد تسجيل الدخول
        $this->app->singleton(\Laravel\Fortify\Contracts\LoginResponse::class, function () {
            return new class implements \Laravel\Fortify\Contracts\LoginResponse {
                public function toResponse($request)
                {
                    $user = $request->user();

                    // If user is admin, redirect to admin dashboard
                    if ($user && $user->isAdmin()) {
                        return redirect()->to(
                            class_exists(LaravelLocalization::class)
                                ? LaravelLocalization::localizeUrl(route('admin.dashboard'))
                                : route('admin.dashboard')
                        );
                    }

                    // If user is employer, redirect to employer dashboard
                    if ($user && $user->isEmployer()) {
                        return redirect()->to(
                            class_exists(LaravelLocalization::class)
                                ? LaravelLocalization::localizeUrl(route('employer.dashboard'))
                                : route('employer.dashboard')
                        );
                    }

                    // Check if user had a specific deep intended URL (not home, landing, or auth)
                    $intended = session()->get('url.intended');
                    session()->forget('url.intended');

                    if ($intended) {
                        $path = trim(parse_url($intended, PHP_URL_PATH) ?? '', '/');
                        $ignoredPaths = ['', 'en', 'ar', 'login', 'en/login', 'ar/login', 'register', 'en/register', 'ar/register'];
                        if (!in_array($path, $ignoredPaths)) {
                            return redirect()->to($intended);
                        }
                    }

                    // Default to seeker dashboard
                    $targetUrl = class_exists(LaravelLocalization::class)
                        ? LaravelLocalization::localizeUrl(route('seeker.dashboard'))
                        : route('seeker.dashboard');

                    return redirect()->to($targetUrl);
                }
            };
        });

        // توجيه ذكي بحسب نوع الحساب بعد إنشاء حساب جديد
        $this->app->singleton(\Laravel\Fortify\Contracts\RegisterResponse::class, function () {
            return new class implements \Laravel\Fortify\Contracts\RegisterResponse {
                public function toResponse($request)
                {
                    $user = $request->user();
                    if ($user && $user->isEmployer()) {
                        $url = class_exists(LaravelLocalization::class)
                            ? LaravelLocalization::localizeUrl(route('employer.company.edit'))
                            : route('employer.company.edit');
                        return redirect()->to($url)
                            ->with('success', __('Welcome to CareerX! Please complete your company profile.'));
                    }

                    $url = class_exists(LaravelLocalization::class)
                        ? LaravelLocalization::localizeUrl(route('seeker.dashboard'))
                        : route('seeker.dashboard');
                    return redirect()->to($url)
                        ->with('success', __('Welcome to CareerX! Please complete your profile.'));
                }
            };
        });
    }


    public function boot(): void
    {
        Fortify::createUsersUsing(CreateNewUser::class);
        Fortify::updateUserProfileInformationUsing(UpdateUserProfileInformation::class);
        Fortify::updateUserPasswordsUsing(UpdateUserPassword::class);
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::redirectUserForTwoFactorAuthenticationUsing(RedirectIfTwoFactorAuthenticatable::class);

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('passkeys', function (Request $request) {
            $credentialId = $request->input('credential.id');

            return Limit::perMinute(10)->by(
                ($credentialId ?: $request->session()->getId()).'|'.$request->ip()
            );
        });

        // 1. صفحة تسجيل الدخول عبر Inertia
        Fortify::loginView(function () {
            return Inertia::render('Auth/Login');
        });

        // 2. صفحة إنشاء حساب جديد عبر Inertia
        Fortify::registerView(function () {
            return Inertia::render('Auth/Register');
        });

        // 3. صفحة نسيان كلمة المرور
        Fortify::requestPasswordResetLinkView(function () {
            return Inertia::render('Auth/ForgotPassword', [
                'status' => session('status'),
            ]);
        });

        // 4. صفحة إعادة تعيين كلمة المرور
        Fortify::resetPasswordView(function ($request) {
            return Inertia::render('Auth/ResetPassword', ['request' => $request]);
        });

        // 5. صفحة التحقق بخطوتين
        Fortify::twoFactorChallengeView(function () {
            return Inertia::render('Auth/TwoFactorChallenge');
        });

        // التحقق المخصص للحسابات المحظورة
        Fortify::authenticateUsing(function ($request) {
            $user = User::where('email', $request->email)->first();

            if ($user && Hash::check($request->password, $user->password)) {
                if (! $user->status) {
                    throw ValidationException::withMessages([
                        'email' => __('Your account is banned: ') . ($user->ban_reason ?? 'Please contact support.'),
                    ]);
                }

                return $user;
            }

            return null;
        });
    }
}

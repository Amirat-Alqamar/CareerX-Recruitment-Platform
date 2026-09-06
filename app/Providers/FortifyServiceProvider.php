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

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
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

        // صفحة تسجيل الدخول
        Fortify::loginView(function () {
            return view('auth.login');
        });
        // صفحة إنشاء حساب جديد
        Fortify::registerView(function () {
            return view('auth.register');
        });
        // صفحة نسيان كلمة المرور
        Fortify::requestPasswordResetLinkView(function () {
            return view('auth.forgot-password');
        });
        // صفحة إعادة تعيين كلمة المرور
        Fortify::resetPasswordView(function ($request) {
            return view('auth.reset-password', ['request' => $request]);
        });

        // التحقق من المستخدم قبل تسجيل الدخول
        Fortify::authenticateUsing(function ($request) {
            // 1. نبحث عن المستخدم في قاعدة البيانات عبر الإيميل المدخل
            $user = User::where('email', $request->email)->first();

            // 2. نتأكد أن المستخدم موجود وأن كلمة المرور المدخلة مطابقة للباسورد المشفر
            if ($user && Hash::check($request->password, $user->password)) {
                
                // 3. الشرط الخاص بنا: هل الحساب محظور (status == 0 أو false)؟
                if (! $user->status) {
                    // نمنعه من الدخول ونظهر له رسالة خطأ مع سبب الحظر
                    throw ValidationException::withMessages([
                        'email' => __('Your account is banned: ') . ($user->ban_reason ?? 'Please contact support.'),
                    ]);
                }

                // 4. إذا كل شيء سليم وحسابه مفعل، نرجعه لفورتيفاي ليكمل تسجيل دخوله
                return $user;
            }

            // 5. إذا كان الإيميل أو الباسورد خطأ، نرجع null ليفهم فورتيفاي أن البيانات غير صحيحة
            return null;
        });

    }
}

<?php

use Illuminate\Support\Facades\Route;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Inertia\Inertia;
use App\Http\Controllers\JobSeeker\DashboardController;
use App\Http\Controllers\JobListingController;

Route::group([
    'prefix' => LaravelLocalization::setLocale(),
    'middleware' => ['localeSessionRedirect', 'localizationRedirect', 'localeViewPath']
], function () {

    Route::get('/', [JobListingController::class, 'home'])->name('home');
    Route::get('/jobs', [JobListingController::class, 'index'])->name('jobs.index');
    Route::get('/companies', [JobListingController::class, 'companies'])->name('companies.index');
    Route::get('/categories', function () {
        return redirect('/' . app()->getLocale() . '#categories');
    })->name('categories.redirect');
    Route::get('/blog', function () {
        return redirect('/' . app()->getLocale() . '#blog');
    })->name('blog.redirect');
    Route::get('/about', function () {
        return redirect('/' . app()->getLocale() . '#about');
    })->name('about.redirect');

    Route::get('/login', function () {
        return Inertia::render('Auth/Login');
    })->name('login');

    Route::get('/register', function () {
        return Inertia::render('Auth/Register');
    })->name('register');

    Route::get('/forgot-password', function () {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    })->name('password.request');

    // Job Seeker Dashboard and Profile routes (Protected for authenticated users only)
    Route::group(['middleware' => ['auth']], function () {
        Route::get('/2fa', [\App\Http\Controllers\Dashboard\TwoFactorAuthenticationController::class, 'index'])->name('2fa');
        Route::get('/seeker/dashboard', [DashboardController::class, 'index'])->name('seeker.dashboard');
        Route::get('/seeker/profile', [DashboardController::class, 'profile'])->name('seeker.profile');
        Route::get('/profile', function () {
            return redirect()->route('seeker.profile');
        })->name('profile.index');

        // Notification actions
        Route::get('/notifications', [\App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications/read-all', [\App\Http\Controllers\NotificationController::class, 'markAllAsRead'])->name('notifications.read-all');
        Route::post('/notifications/clear', [\App\Http\Controllers\NotificationController::class, 'clearAll'])->name('notifications.clear');
        Route::post('/notifications/{id}/read', [\App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
    });

    require __DIR__ . '/job_seeker.php';
    require __DIR__ . '/employer.php';
    require __DIR__ . '/admin.php';

});


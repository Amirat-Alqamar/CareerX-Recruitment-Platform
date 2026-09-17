<?php

use Illuminate\Support\Facades\Route;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Inertia\Inertia;
use App\Http\Controllers\JobSeeker\DashboardController;

Route::group([
    'prefix' => LaravelLocalization::setLocale(),
    'middleware' => ['localeSessionRedirect', 'localizationRedirect', 'localeViewPath']
], function () {

    Route::get('/', function () {
        return Inertia::render('LandingPage');
    })->name('home');

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
        Route::get('/seeker/dashboard', [DashboardController::class, 'index'])->name('seeker.dashboard');
        Route::get('/seeker/profile', [DashboardController::class, 'profile'])->name('seeker.profile');
        Route::get('/profile', function () {
            return redirect()->route('seeker.profile');
        })->name('profile.index');
    });

    require __DIR__ . '/job_seeker.php';
    require __DIR__ . '/employer.php';
    require __DIR__ . '/admin.php';

});


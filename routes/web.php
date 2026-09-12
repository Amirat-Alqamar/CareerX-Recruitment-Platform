<?php

use Illuminate\Support\Facades\Route;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;
use Inertia\Inertia;

Route::group([
    'prefix' => LaravelLocalization::setLocale(),
    'middleware' => ['localeSessionRedirect', 'localizationRedirect', 'localeViewPath']
], function () {

    Route::get('/', function () {
        return Inertia::render('LandingPage');
    })->name('home');

    require __DIR__ . '/job_seeker.php';
    require __DIR__ . '/employer.php';

});

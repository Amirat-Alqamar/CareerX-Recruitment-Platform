<?php

use Illuminate\Support\Facades\Route;
use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

Route::group([
    'prefix' => LaravelLocalization::setLocale(),
    'middleware' => ['localeSessionRedirect', 'localizationRedirect', 'localeViewPath']
], function () {

    Route::get('/', function () {
        return view('welcome');
    });

    require __DIR__ . '/job_seeker.php';
    require __DIR__ . '/employer.php';

});


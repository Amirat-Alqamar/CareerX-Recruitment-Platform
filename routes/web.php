<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('LandingPage');
});
// Route::get('/', function () {
//     return view('welcome');
// });

Route::get('/seeker/dashboard', function () {
    return Inertia::render('Seeker/Dashboard', [
        'stats' => [
            'applied' => 24,
            'underReview' => 8,
            'interviews' => 3,
            'offers' => 1,
        ],
        'profileCompletion' => 72,
    ]);
})->name('seeker.dashboard');

Route::get('/profile', function () {
    return inertia('Seeker/Profile');
})->name('profile.index');

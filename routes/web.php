<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\JobSeeker\ProfileController;
use App\Http\Controllers\JobSeeker\ExperienceController;
use App\Http\Controllers\JobSeeker\EducationController;
use App\Http\Controllers\JobSeeker\SkillController;
use App\Http\Controllers\JobSeeker\ResumeController;
use App\Http\Controllers\JobSeeker\JobApplicationController;

Route::get('/', function () {
    return view('welcome');
});

require __DIR__ . '/job_seeker.php';

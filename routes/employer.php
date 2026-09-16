<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Employer\CompanyProfileController;
use App\Http\Controllers\Employer\JobController;
use App\Http\Controllers\Employer\ApplicantController;
use App\Http\Controllers\Employer\DashboardController;

Route::middleware(['auth', 'employer'])->prefix('employer')->name('employer.')->group(function () {

    // لوحة التحكم الرئيسية
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // إدارة ملف الشركة
    Route::get('/company', [CompanyProfileController::class, 'show'])->name('company.show');
    Route::get('/company/edit', [CompanyProfileController::class, 'edit'])->name('company.edit');
    Route::match(['put', 'post'], '/company/update', [CompanyProfileController::class, 'update'])->name('company.update');
    Route::delete('/company/logo', [CompanyProfileController::class, 'deleteLogo'])->name('company.logo.delete');
    Route::delete('/company/cover', [CompanyProfileController::class, 'deleteCover'])->name('company.cover.delete');

    // إدارة ونشر الوظائف (CRUD)
    Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
    Route::get('/jobs/create', [JobController::class, 'create'])->name('jobs.create');
    Route::post('/jobs', [JobController::class, 'store'])->name('jobs.store');
    Route::get('/jobs/{job}/edit', [JobController::class, 'edit'])->name('jobs.edit');
    Route::put('/jobs/{job}', [JobController::class, 'update'])->name('jobs.update');
    Route::delete('/jobs/{job}', [JobController::class, 'destroy'])->name('jobs.destroy');
    Route::post('/jobs/{job}/toggle', [JobController::class, 'toggleStatus'])->name('jobs.toggle');
    Route::post('/jobs/{job}/duplicate', [JobController::class, 'duplicate'])->name('jobs.duplicate');

    // مراجعة المتقدمين للوظائف
    Route::get('/applicants', [ApplicantController::class, 'index'])->name('applicants.index');
    Route::get('/applicants/{application}', [ApplicantController::class, 'show'])->name('applicants.show');
    Route::put('/applicants/{application}/status', [ApplicantController::class, 'updateStatus'])->name('applicants.status');
    Route::post('/applicants/{application}/interview', [ApplicantController::class, 'scheduleInterview'])->name('applicants.interview');
    Route::put('/applicants/{application}/evaluation', [ApplicantController::class, 'updateEvaluation'])->name('applicants.evaluation');
    Route::get('/applicants/{application}/resume', [ApplicantController::class, 'downloadResume'])->name('applicants.resume');

});

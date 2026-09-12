<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Employer\CompanyProfileController;
use App\Http\Controllers\Employer\JobController;
use App\Http\Controllers\Employer\ApplicantController;

Route::middleware(['auth', 'employer'])->prefix('employer')->name('employer.')->group(function () {

    // إدارة ملف الشركة
    Route::get('/company', [CompanyProfileController::class, 'show'])->name('company.show');
    Route::get('/company/edit', [CompanyProfileController::class, 'edit'])->name('company.edit');
    Route::put('/company/update', [CompanyProfileController::class, 'update'])->name('company.update');

    // إدارة ونشر الوظائف (CRUD)
    Route::get('/jobs', [JobController::class, 'index'])->name('jobs.index');
    Route::get('/jobs/create', [JobController::class, 'create'])->name('jobs.create');
    Route::post('/jobs', [JobController::class, 'store'])->name('jobs.store');
    Route::get('/jobs/{job}/edit', [JobController::class, 'edit'])->name('jobs.edit');
    Route::put('/jobs/{job}', [JobController::class, 'update'])->name('jobs.update');
    Route::delete('/jobs/{job}', [JobController::class, 'destroy'])->name('jobs.destroy');
    Route::post('/jobs/{job}/toggle', [JobController::class, 'toggleStatus'])->name('jobs.toggle');

    // مراجعة المتقدمين للوظائف
    Route::get('/applicants', [ApplicantController::class, 'index'])->name('applicants.index');
    Route::get('/applicants/{application}', [ApplicantController::class, 'show'])->name('applicants.show');
    Route::put('/applicants/{application}/status', [ApplicantController::class, 'updateStatus'])->name('applicants.status');
    Route::get('/applicants/{application}/resume', [ApplicantController::class, 'downloadResume'])->name('applicants.resume');

});

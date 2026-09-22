<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\JobManagementController;
use App\Http\Controllers\Admin\PendingJobController;
use App\Http\Controllers\Admin\ReportController;

Route::middleware(['auth', 'can:admin.access'])->prefix('admin')->name('admin.')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/toggle-ban', [UserController::class, 'toggleBan'])->name('users.toggle-ban');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    Route::get('/jobs', [JobManagementController::class, 'index'])->name('jobs.index');
    Route::post('/jobs/{job}/approve', [JobManagementController::class, 'approve'])->name('jobs.approve');
    Route::post('/jobs/{job}/reject', [JobManagementController::class, 'reject'])->name('jobs.reject');
    Route::post('/jobs/{job}/toggle', [JobManagementController::class, 'toggleStatus'])->name('jobs.toggle');
    Route::delete('/jobs/{job}', [JobManagementController::class, 'destroy'])->name('jobs.destroy');

    Route::get('/pending-jobs', [PendingJobController::class, 'index'])->name('pending-jobs.index');
    Route::post('/pending-jobs/{job}/approve', [JobManagementController::class, 'approve'])->name('pending-jobs.approve');
    Route::post('/pending-jobs/{job}/reject', [JobManagementController::class, 'reject'])->name('pending-jobs.reject');

    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

});


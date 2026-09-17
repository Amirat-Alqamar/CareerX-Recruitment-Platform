<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\JobManagementController;
use App\Http\Controllers\Admin\PendingJobController;
use App\Http\Controllers\Admin\ReportController;

Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {

    // لوحة التحكم الرئيسية للمسؤول
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // إدارة المستخدمين (عرض / حظر / حذف)
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users/{user}/toggle-ban', [UserController::class, 'toggleBan'])->name('users.toggle-ban');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // إدارة الوظائف (عرض / موافقة / رفض / تبديل حالة / حذف)
    Route::get('/jobs', [JobManagementController::class, 'index'])->name('jobs.index');
    Route::post('/jobs/{job}/approve', [JobManagementController::class, 'approve'])->name('jobs.approve');
    Route::post('/jobs/{job}/reject', [JobManagementController::class, 'reject'])->name('jobs.reject');
    Route::post('/jobs/{job}/toggle', [JobManagementController::class, 'toggleStatus'])->name('jobs.toggle');
    Route::delete('/jobs/{job}', [JobManagementController::class, 'destroy'])->name('jobs.destroy');

    // طابور مراجعة والموافقة على الوظائف المعلقة (إشعارات وطلبات النشر)
    Route::get('/pending-jobs', [PendingJobController::class, 'index'])->name('pending-jobs.index');
    Route::post('/pending-jobs/{job}/approve', [PendingJobController::class, 'approve'])->name('pending-jobs.approve');
    Route::post('/pending-jobs/{job}/reject', [PendingJobController::class, 'reject'])->name('pending-jobs.reject');

    // التقارير والإحصائيات الشاملة
    Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');

});

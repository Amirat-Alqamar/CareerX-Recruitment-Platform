<?php

use App\Http\Controllers\RolePermession\RoleController;
use App\Http\Controllers\RolePermession\UserRoleController;
use Illuminate\Support\Facades\Route;

$prefix = config('role-permession.ui.prefix', 'admin/roles');
$namePrefix = config('role-permession.ui.route_name_prefix', 'admin.roles.');
$middleware = config('role-permession.ui.middleware', ['web', 'auth', 'can:admin.access']);

Route::middleware($middleware)
    ->prefix($prefix)
    ->name($namePrefix)
    ->group(function () {
        Route::get('/users', [UserRoleController::class, 'index'])->name('users.index');
        Route::put('/users/{user}', [UserRoleController::class, 'update'])->name('users.update');

        Route::get('/', [RoleController::class, 'index'])->name('index');
        Route::get('/create', [RoleController::class, 'create'])->name('create');
        Route::post('/', [RoleController::class, 'store'])->name('store');
        Route::get('/{role}/edit', [RoleController::class, 'edit'])->name('edit');
        Route::put('/{role}', [RoleController::class, 'update'])->name('update');
        Route::delete('/{role}', [RoleController::class, 'destroy'])->name('destroy');
    });

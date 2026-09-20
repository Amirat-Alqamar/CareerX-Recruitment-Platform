<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TwoFactorAuthenticationController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        return Inertia::render('Dashboard/TwoFactorAuth', [
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
                'two_factor_secret' => !is_null($user->two_factor_secret),
                'two_factor_confirmed' => !is_null($user->two_factor_confirmed_at),
                'qr_code' => $user->two_factor_secret ? $user->twoFactorQrCodeSvg() : null,
                'recovery_codes' => $user->two_factor_secret ? $user->recoveryCodes() : [],
            ],
        ]);
    }
}


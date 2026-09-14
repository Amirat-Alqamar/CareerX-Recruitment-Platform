<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the job seeker dashboard with key metrics and profile strength.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user && $user->isEmployer()) {
            return redirect()->to(
                class_exists(\Mcamara\LaravelLocalization\Facades\LaravelLocalization::class)
                    ? \Mcamara\LaravelLocalization\Facades\LaravelLocalization::localizeUrl(route('employer.dashboard'))
                    : route('employer.dashboard')
            );
        }

        // Default mock stats for guest preview / new users
        $stats = [
            'applied' => 24,
            'underReview' => 8,
            'interviews' => 3,
            'offers' => 1,
        ];
        $profileCompletion = 72;

        if ($user && $user->profile) {
            $profile = $user->profile;

            $appliedCount = $profile->applications()->count();
            $underReviewCount = $profile->applications()->where('status', 'under_review')->count();
            $interviewsCount = $profile->applications()->where('status', 'interview')->count();
            $offersCount = $profile->applications()->whereIn('status', ['accepted', 'offer'])->count();

            // Use real metrics when applications exist
            if ($appliedCount > 0) {
                $stats = [
                    'applied' => $appliedCount,
                    'underReview' => $underReviewCount,
                    'interviews' => $interviewsCount,
                    'offers' => $offersCount,
                ];
            }

            // Calculate profile completion percentage based on profile sections
            $score = 20; // Base score for account
            if (!empty($profile->job_title)) {
                $score += 15;
            }
            if (!empty($profile->bio)) {
                $score += 15;
            }
            if ($profile->skills()->count() > 0) {
                $score += 15;
            }
            if ($profile->experiences()->count() > 0) {
                $score += 15;
            }
            if ($profile->educations()->count() > 0) {
                $score += 10;
            }
            if ($profile->resumes()->count() > 0) {
                $score += 10;
            }

            $profileCompletion = min(100, $score);
        }

        return Inertia::render('Seeker/Dashboard', [
            'stats' => $stats,
            'profileCompletion' => $profileCompletion,
        ]);
    }

    /**
     * Display the modern job seeker public profile preview.
     */
    public function profile(Request $request)
    {
        $user = $request->user();

        if ($user && $user->isEmployer()) {
            return redirect()->to(
                class_exists(\Mcamara\LaravelLocalization\Facades\LaravelLocalization::class)
                    ? \Mcamara\LaravelLocalization\Facades\LaravelLocalization::localizeUrl(route('employer.company.show'))
                    : route('employer.company.show')
            );
        }

        $profileData = null;

        if ($user) {
            $profile = $user->profile ? $user->profile()->with([
                'skills',
                'languages',
                'experiences',
                'educations',
                'resumes',
                'city',
                'country',
            ])->first() : null;

            $location = '';
            if ($profile) {
                $location = trim(($profile->city?->name ?? '') . ($profile->country ? ', ' . $profile->country->name : ''));
            }

            $profileData = [
                'header' => [
                    'name' => $user->name,
                    'headline' => $profile?->job_title ?: null,
                    'location' => !empty($location) ? $location : null,
                    'email' => $user->email,
                    'website' => $user->website ?? null,
                ],
                'summary' => $profile?->bio ?: null,
                'experiences' => $profile ? $profile->experiences : [],
                'skills' => $profile ? $profile->skills->pluck('name')->toArray() : [],
                'languages' => $profile ? $profile->languages->map(function ($lang) {
                    return [
                        'name' => $lang->name,
                        'level' => $lang->pivot->level ?? 'Professional',
                        'percentage' => ($lang->pivot->level ?? '') === 'Native' ? 100 : (($lang->pivot->level ?? '') === 'Professional' ? 80 : 40),
                    ];
                }) : [],
            ];
        }

        return Inertia::render('Seeker/Profile', [
            'profileData' => $profileData,
        ]);
    }
}

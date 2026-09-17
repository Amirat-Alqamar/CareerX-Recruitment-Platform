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

        // Real metrics from database for user
        $stats = [
            'applied' => 0,
            'underReview' => 0,
            'interviews' => 0,
            'offers' => 0,
        ];
        $profileCompletion = 20;

        if ($user && $user->profile) {
            $profile = $user->profile;

            $appliedCount = $profile->applications()->count();
            $underReviewCount = $profile->applications()->whereIn('status', ['applied', 'under_review', 'pending'])->count();
            $interviewsCount = $profile->applications()->where('status', 'interview')->count();
            $offersCount = $profile->applications()->whereIn('status', ['accepted', 'offer', 'hired'])->count();

            $stats = [
                'applied' => $appliedCount,
                'underReview' => $underReviewCount,
                'interviews' => $interviewsCount,
                'offers' => $offersCount,
            ];

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
                'experiences' => fn($q) => $q->orderBy('start_date', 'desc'),
                'educations' => fn($q) => $q->orderBy('start_year', 'desc'),
                'certifications' => fn($q) => $q->latest(),
                'resumes' => fn($q) => $q->latest(),
                'portfolioItems' => fn($q) => $q->latest(),
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
                    'avatar' => $user->avatar ? (str_starts_with($user->avatar, 'http') ? $user->avatar : asset('storage/' . $user->avatar)) : null,
                    'cover_image' => $user->cover_image ? (str_starts_with($user->cover_image, 'http') ? $user->cover_image : asset('storage/' . $user->cover_image)) : null,
                ],
                'summary' => $profile?->bio ?: null,
                'details' => $profile ? [
                    'job_title' => $profile->job_title,
                    'bio' => $profile->bio,
                    'country_id' => $profile->country_id,
                    'city_id' => $profile->city_id,
                    'nationality' => $profile->nationality,
                    'address' => $profile->address,
                    'marital_status' => $profile->marital_status,
                    'birth_date' => $profile->birth_date ? \Carbon\Carbon::parse($profile->birth_date)->format('Y-m-d') : null,
                    'years_of_experience' => $profile->years_of_experience,
                    'work_type' => $profile->work_type,
                    'gender_preference' => $profile->gender_preference,
                ] : null,
                'experiences' => $profile ? $profile->experiences : [],
                'educations' => $profile ? $profile->educations : [],
                'certifications' => $profile ? $profile->certifications : [],
                'resumes' => $profile ? $profile->resumes : [],
                'portfolio' => $profile ? $profile->portfolioItems : [],
                'skills' => $profile ? $profile->skills->map(function ($skill) {
                    return [
                        'id' => $skill->id,
                        'name' => $skill->name,
                        'level_id' => $skill->pivot->level_id ?? null,
                    ];
                }) : [],
                'languages' => $profile ? $profile->languages->map(function ($lang) {
                    $level = $lang->pivot->level ?? 'Professional';
                    $percentage = 70;
                    if (str_contains($level, 'Native') || $level === 'Native') {
                        $percentage = 100;
                    } elseif (str_contains($level, 'Fluent') || str_contains($level, 'Advanced')) {
                        $percentage = 85;
                    } elseif (str_contains($level, 'Intermediate')) {
                        $percentage = 60;
                    } elseif (str_contains($level, 'Beginner')) {
                        $percentage = 35;
                    }

                    return [
                        'id' => $lang->id,
                        'name' => $lang->name,
                        'level' => $level,
                        'percentage' => $percentage,
                    ];
                }) : [],
            ];

            $allLanguages = \App\Models\Language::orderBy('name')->get(['id', 'name']);
            $allSkills = \App\Models\Skill::orderBy('name')->limit(50)->get(['id', 'name']);
            $countries = \App\Models\Country::with('cities')->orderBy('name')->get(['id', 'name']);
            $cities = \App\Models\City::orderBy('name')->get(['id', 'name', 'country_id']);
        }

        return Inertia::render('Seeker/Profile', [
            'profileData' => $profileData,
            'allLanguages' => $allLanguages ?? [],
            'allSkills' => $allSkills ?? [],
            'countries' => $countries ?? [],
            'cities' => $cities ?? [],
        ]);
    }
}

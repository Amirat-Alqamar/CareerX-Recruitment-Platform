<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\JobCategory;
use App\Models\JobSeekerProfile;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController extends Controller
{
    /**
     * Display comprehensive platform reports and analytics.
     */
    public function index()
    {
        // 1. Overall System Summary
        $totalJobs = Job::count();
        $totalApplications = JobApplication::count();
        $totalCompanies = Company::count();
        $totalSeekers = User::where('role', 'job_seeker')->count();
        $totalEmployers = User::where('role', 'employer')->count();

        // 2. Job Statistics Breakdown
        $jobsByStatus = [
            'published' => Job::where('status', 'published')->count(),
            'pending'   => Job::where('status', 'pending')->count(),
            'closed'    => Job::where('status', 'closed')->count(),
            'draft'     => Job::where('status', 'draft')->count(),
        ];

        $jobsByWorkType = [
            'on_site' => Job::where('work_type', 'on_site')->count(),
            'remote'  => Job::where('work_type', 'remote')->count(),
            'hybrid'  => Job::where('work_type', 'hybrid')->count(),
        ];

        $jobsByJobType = [
            'full_time'  => Job::where('job_type', 'full_time')->count(),
            'part_time'  => Job::where('job_type', 'part_time')->count(),
            'freelance'  => Job::where('job_type', 'freelance')->count(),
            'internship' => Job::where('job_type', 'internship')->count(),
        ];

        // 3. Top in-demand Job Categories (أكثر الأعمال المطلوبة)
        $topCategories = JobCategory::withCount('jobs')
            ->orderByDesc('jobs_count')
            ->get()
            ->map(function ($cat) {
                $appCount = JobApplication::whereHas('jobPost', function ($q) use ($cat) {
                    $q->where('category_id', $cat->id);
                })->count();

                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'jobs_count' => $cat->jobs_count,
                    'applications_count' => $appCount,
                ];
            });

        // 4. Top in-demand Skills
        $topSkills = Skill::withCount('jobs')
            ->orderByDesc('jobs_count')
            ->take(12)
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'name' => $s->name,
                    'jobs_count' => $s->jobs_count,
                ];
            });

        // 5. Company Statistics (Top active hiring companies)
        $topCompanies = Company::withCount(['jobs', 'users'])
            ->orderByDesc('jobs_count')
            ->take(8)
            ->get()
            ->map(function ($comp) {
                $compApps = JobApplication::whereHas('jobPost', function ($q) use ($comp) {
                    $q->where('company_id', $comp->id);
                })->count();

                return [
                    'id' => $comp->id,
                    'name' => $comp->name,
                    'logo' => $comp->logo ? asset('storage/' . $comp->logo) : null,
                    'company_size' => $comp->company_size ?? 'General',
                    'jobs_count' => $comp->jobs_count,
                    'applications_count' => $compApps,
                ];
            });

        // 6. Application Status Breakdown
        $applicationsByStatus = [
            'applied'     => JobApplication::where('status', 'applied')->count(),
            'pending'     => JobApplication::where('status', 'pending')->count(),
            'reviewed'    => JobApplication::where('status', 'reviewed')->count(),
            'shortlisted' => JobApplication::where('status', 'shortlisted')->count(),
            'interview'   => JobApplication::where('status', 'interview')->count(),
            'hired'       => JobApplication::where('status', 'hired')->count(),
            'rejected'    => JobApplication::where('status', 'rejected')->count(),
        ];

        // 7. Seeker Profiles Breakdown
        $totalProfiles = JobSeekerProfile::count();
        $profilesWithTitle = JobSeekerProfile::whereNotNull('job_title')->count();
        $profilesWithBio = JobSeekerProfile::whereNotNull('bio')->count();

        return Inertia::render('Admin/Reports', [
            'summary' => [
                'totalJobs'         => $totalJobs,
                'totalApplications' => $totalApplications,
                'totalCompanies'    => $totalCompanies,
                'totalSeekers'      => $totalSeekers,
                'totalEmployers'    => $totalEmployers,
            ],
            'jobsByStatus'         => $jobsByStatus,
            'jobsByWorkType'       => $jobsByWorkType,
            'jobsByJobType'        => $jobsByJobType,
            'topCategories'        => $topCategories,
            'topSkills'            => $topSkills,
            'topCompanies'         => $topCompanies,
            'applicationsByStatus' => $applicationsByStatus,
            'seekerProfileStats'   => [
                'total_profiles'       => $totalProfiles,
                'profiles_with_title'  => $profilesWithTitle,
                'profiles_with_bio'    => $profilesWithBio,
            ],
        ]);
    }
}

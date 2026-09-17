<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Company;
use App\Models\Job;
use App\Models\JobApplication;
use App\Models\JobCategory;
use App\Models\Skill;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the Admin Overview Dashboard.
     */
    public function index()
    {
        // System-wide counts
        $totalUsers = User::count();
        $totalSeekers = User::where('role', 'job_seeker')->count();
        $totalEmployers = User::where('role', 'employer')->count();
        $totalCompanies = Company::count();

        $totalJobs = Job::count();
        $activeJobs = Job::where('status', 'published')->where('is_active', true)->count();
        $pendingJobs = Job::where('status', 'pending')->count();
        $closedJobs = Job::where('status', 'closed')->count();

        $totalApplications = JobApplication::count();
        $hiredApplications = JobApplication::where('status', 'hired')->count();
        $hiringRate = $totalApplications > 0 ? round(($hiredApplications / $totalApplications) * 100, 1) : 0;

        // Pending job approvals queue (max 5 for quick action)
        $pendingApprovals = Job::where('status', 'pending')
            ->with(['company:id,name,logo', 'category:id,name', 'creator:id,name,email'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company_name' => $job->company?->name ?? 'Company',
                    'company_logo' => $job->company?->logo ? asset('storage/' . $job->company->logo) : null,
                    'category' => $job->category?->name ?? 'General',
                    'job_type' => $job->job_type ?? 'Full Time',
                    'work_type' => $job->work_type ?? 'On-site',
                    'salary_min' => $job->salary_min,
                    'salary_max' => $job->salary_max,
                    'created_at' => $job->created_at ? $job->created_at->diffForHumans() : '',
                ];
            });

        // Top In-Demand Job Categories (أكثر الأعمال المطلوبة)
        $topCategories = JobCategory::withCount('jobs')
            ->orderByDesc('jobs_count')
            ->take(6)
            ->get()
            ->map(function ($cat) {
                $applicationsCount = JobApplication::whereHas('jobPost', function ($q) use ($cat) {
                    $q->where('category_id', $cat->id);
                })->count();

                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                    'jobs_count' => $cat->jobs_count,
                    'applications_count' => $applicationsCount,
                ];
            });

        // Most In-Demand Skills
        $topSkills = Skill::withCount('jobs')
            ->orderByDesc('jobs_count')
            ->take(8)
            ->get()
            ->map(function ($skill) {
                return [
                    'id' => $skill->id,
                    'name' => $skill->name,
                    'jobs_count' => $skill->jobs_count,
                ];
            });

        // Recent Job Postings
        $recentJobs = Job::with(['company:id,name,logo', 'category:id,name'])
            ->withCount('applications')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company_name' => $job->company?->name ?? 'Company',
                    'company_logo' => $job->company?->logo ? asset('storage/' . $job->company->logo) : null,
                    'category' => $job->category?->name ?? 'General',
                    'status' => $job->status,
                    'is_active' => $job->is_active,
                    'applications_count' => $job->applications_count ?? 0,
                    'created_at' => $job->created_at ? $job->created_at->diffForHumans() : '',
                ];
            });

        // Recent Users Joined
        $recentUsers = User::latest()
            ->take(5)
            ->get()
            ->map(function ($u) {
                return [
                    'id' => $u->id,
                    'name' => $u->name,
                    'email' => $u->email,
                    'role' => $u->role,
                    'status' => (bool) $u->status,
                    'avatar' => $u->avatar ? (str_starts_with($u->avatar, 'http') ? $u->avatar : asset('storage/' . $u->avatar)) : null,
                    'created_at' => $u->created_at ? $u->created_at->diffForHumans() : '',
                ];
            });

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'total_users'        => $totalUsers,
                'total_seekers'      => $totalSeekers,
                'total_employers'    => $totalEmployers,
                'total_companies'    => $totalCompanies,
                'total_jobs'         => $totalJobs,
                'active_jobs'        => $activeJobs,
                'pending_jobs'       => $pendingJobs,
                'closed_jobs'        => $closedJobs,
                'total_applications' => $totalApplications,
                'hired_applications' => $hiredApplications,
                'hiring_rate'        => $hiringRate,
            ],
            'pendingApprovals' => $pendingApprovals,
            'topCategories'    => $topCategories,
            'topSkills'        => $topSkills,
            'recentJobs'       => $recentJobs,
            'recentUsers'      => $recentUsers,
        ]);
    }
}

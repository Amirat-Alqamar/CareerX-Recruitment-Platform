<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the employer dashboard overview.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $company = $user->company;

        if (!$company) {
            return redirect()->route('employer.company.edit')
                ->with('error', __('Please complete your company profile first.'));
        }

        $companyId = $company->id;

        // Key hiring metrics
        $totalJobs = Job::where('company_id', $companyId)->count();
        $activeJobs = Job::where('company_id', $companyId)->where(function ($q) {
            $q->where('status', 'published')->orWhere('is_active', true);
        })->count();

        $totalApplicants = JobApplication::whereHas('jobPost', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })->count();

        $pendingApplicants = JobApplication::whereHas('jobPost', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })->whereIn('status', ['applied', 'pending'])->count();

        $acceptedApplicants = JobApplication::whereHas('jobPost', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })->where('status', 'accepted')->count();

        $shortlistedApplicants = JobApplication::whereHas('jobPost', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })->where('status', 'shortlisted')->count();

        $hiredApplicants = JobApplication::whereHas('jobPost', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })->where('status', 'hired')->count();

        $hiringRate = $totalApplicants > 0 ? round(($hiredApplicants / $totalApplicants) * 100, 1) : 0;

        // Recent posted jobs
        $recentJobs = Job::where('company_id', $companyId)
            ->withCount('applications')
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'job_type' => $job->job_type ?? 'Full Time',
                    'work_type' => $job->work_type ?? 'On-site',
                    'status' => $job->status ?? ($job->is_active ? 'active' : 'closed'),
                    'applications_count' => $job->applications_count ?? 0,
                    'created_at' => $job->created_at ? $job->created_at->diffForHumans() : '',
                ];
            });

        // Recent job applications received
        $recentApplicants = JobApplication::whereHas('jobPost', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })
            ->with(['jobPost:id,title', 'profile.user:id,name,email'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($app) {
                return [
                    'id' => $app->id,
                    'applicant_name' => $app->profile?->user?->name ?? 'Candidate',
                    'applicant_email' => $app->profile?->user?->email ?? '',
                    'job_title' => $app->jobPost?->title ?? 'N/A',
                    'status' => $app->status ?? 'applied',
                    'rating' => $app->rating,
                    'applied_at' => $app->created_at ? $app->created_at->diffForHumans() : '',
                ];
            });

        $mostAppliedJobModel = Job::where('company_id', $companyId)
            ->withCount('applications')
            ->orderByDesc('applications_count')
            ->first();

        $mostAppliedJob = null;
        if ($mostAppliedJobModel && $mostAppliedJobModel->applications_count > 0) {
            $mostAppliedJob = [
                'id' => $mostAppliedJobModel->id,
                'title' => $mostAppliedJobModel->title,
                'applications_count' => $mostAppliedJobModel->applications_count,
                'job_type' => $mostAppliedJobModel->job_type ?? 'Full Time',
                'work_type' => $mostAppliedJobModel->work_type ?? 'On-site',
                'status' => $mostAppliedJobModel->status ?? 'published',
            ];
        }

        return Inertia::render('Employer/Dashboard', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'logo' => $company->logo ? asset('storage/' . $company->logo) : null,
                'website' => $company->website,
            ],
            'stats' => [
                'totalJobs'             => $totalJobs,
                'activeJobs'            => $activeJobs,
                'totalApplicants'       => $totalApplicants,
                'pendingApplicants'     => $pendingApplicants,
                'shortlistedApplicants' => $shortlistedApplicants,
                'acceptedApplicants'    => $acceptedApplicants,
                'hiredApplicants'       => $hiredApplicants,
                'hiringRate'            => $hiringRate,
            ],
            'mostAppliedJob' => $mostAppliedJob,
            'recentJobs' => $recentJobs,
            'recentApplicants' => $recentApplicants,
        ]);
    }
}

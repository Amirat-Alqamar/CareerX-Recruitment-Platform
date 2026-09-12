<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ApplicantController extends Controller
{
    /**
     * Display a listing of candidates who applied to the employer's jobs.
     */
    public function index(Request $request)
    {
        $companyId = Auth::user()->company_id;

        // Jobs for the filter dropdown
        $companyJobs = Job::where('company_id', $companyId)->select('id', 'title')->get();

        $query = JobApplication::whereHas('jobPost', function ($q) use ($companyId) {
            $q->where('company_id', $companyId);
        })->with(['jobPost', 'profile.user', 'resume']);

        // Filter by job
        if ($request->filled('job_id')) {
            $query->where('job_post_id', $request->job_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $applications = $query->latest()->paginate(15)->withQueryString();

        // Application status counts for quick badges
        $counts = [
            'total'    => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->count(),
            'pending'  => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->where('status', 'pending')->count(),
            'reviewed' => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->where('status', 'reviewed')->count(),
            'accepted' => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->where('status', 'accepted')->count(),
            'rejected' => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->where('status', 'rejected')->count(),
        ];

        return view('employer.applicants.index', compact('applications', 'companyJobs', 'counts'));
    }

    /**
     * Display the specified applicant's profile and application details.
     */
    public function show(JobApplication $application)
    {
        $this->authorizeCompanyApplication($application);

        // Auto mark as reviewed if it is currently pending
        if ($application->status === 'pending') {
            $application->update(['status' => 'reviewed']);
        }

        $application->load([
            'jobPost',
            'resume',
            'profile.user',
            'profile.country',
            'profile.city',
            'profile.experiences' => fn($q) => $q->orderBy('start_date', 'desc'),
            'profile.educations' => fn($q) => $q->orderBy('start_date', 'desc'),
            'profile.skills',
            'profile.languages',
            'profile.certifications',
            'profile.portfolioItems',
        ]);

        return view('employer.applicants.show', compact('application'));
    }

    /**
     * Update the application status (accepted / rejected / reviewed).
     */
    public function updateStatus(Request $request, JobApplication $application)
    {
        $this->authorizeCompanyApplication($application);

        $validated = $request->validate([
            'status' => ['required', 'in:pending,reviewed,accepted,rejected'],
        ]);

        $application->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', __('Applicant status updated to :status successfully.', [
            'status' => __(ucfirst($validated['status']))
        ]));
    }

    /**
     * Download the candidate's resume for this application.
     */
    public function downloadResume(JobApplication $application)
    {
        $this->authorizeCompanyApplication($application);

        $resume = $application->resume;

        if (!$resume || !Storage::disk('public')->exists($resume->file_path)) {
            return redirect()->back()->with('error', __('Resume file not found or has been removed.'));
        }

        return Storage::disk('public')->download($resume->file_path, $resume->title . '.' . pathinfo($resume->file_path, PATHINFO_EXTENSION));
    }

    /**
     * Security check: ensure the application belongs to a job posted by the employer's company.
     */
    protected function authorizeCompanyApplication(JobApplication $application): void
    {
        $application->loadMissing('jobPost');

        if ($application->jobPost->company_id !== Auth::user()->company_id) {
            abort(403, __('You do not have permission to view this job application.'));
        }
    }
}

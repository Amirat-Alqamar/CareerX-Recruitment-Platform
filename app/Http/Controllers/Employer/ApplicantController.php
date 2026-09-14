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

        // Filter by search (candidate name, email, or job title)
        if ($request->filled('search')) {
            $term = '%' . $request->search . '%';
            $query->where(function ($q) use ($term) {
                $q->whereHas('profile.user', function ($uq) use ($term) {
                    $uq->where('name', 'like', $term)
                       ->orWhere('email', 'like', $term);
                })->orWhereHas('jobPost', function ($jq) use ($term) {
                    $jq->where('title', 'like', $term);
                });
            });
        }

        // Filter by job
        if ($request->filled('job_id')) {
            $query->where('job_post_id', $request->job_id);
        }

        // Filter by status
        if ($request->filled('status')) {
            $status = $request->status;
            if ($status === 'pending' || $status === 'applied') {
                $query->whereIn('status', ['applied', 'pending']);
            } else {
                $query->where('status', $status);
            }
        }

        $applications = $query->latest()->paginate(15)->withQueryString();

        $appliedCount = JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->whereIn('status', ['applied', 'pending'])->count();

        // Application status counts for quick badges
        $counts = [
            'total'       => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->count(),
            'applied'     => $appliedCount,
            'pending'     => $appliedCount,
            'reviewed'    => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->where('status', 'reviewed')->count(),
            'shortlisted' => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->where('status', 'shortlisted')->count(),
            'accepted'    => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->where('status', 'accepted')->count(),
            'rejected'    => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->where('status', 'rejected')->count(),
            'hired'       => JobApplication::whereHas('jobPost', fn($q) => $q->where('company_id', $companyId))->where('status', 'hired')->count(),
        ];

        return view('employer.applicants.index', compact('applications', 'companyJobs', 'counts'));
    }

    /**
     * Display the specified applicant's profile and application details.
     */
    public function show(JobApplication $application)
    {
        $this->authorizeCompanyApplication($application);

        // Auto mark as reviewed if it is currently applied or pending
        if (in_array($application->status, ['applied', 'pending'])) {
            $application->update(['status' => 'reviewed']);
        }

        $application->load([
            'jobPost',
            'resume',
            'profile.user',
            'profile.country',
            'profile.city',
            'profile.experiences' => fn($q) => $q->orderBy('start_date', 'desc'),
            'profile.educations' => fn($q) => $q->orderBy('start_year', 'desc'),
            'profile.skills',
            'profile.languages',
            'profile.certifications',
            'profile.portfolioItems',
        ]);

        return view('employer.applicants.show', compact('application'));
    }

    /**
     * Update the application status (applied / reviewed / shortlisted / accepted / rejected / hired).
     */
    public function updateStatus(Request $request, JobApplication $application)
    {
        $this->authorizeCompanyApplication($application);

        $validated = $request->validate([
            'status' => ['required', 'in:applied,pending,reviewed,shortlisted,accepted,rejected,hired'],
        ]);

        $status = $validated['status'] === 'pending' ? 'applied' : $validated['status'];
        $application->update(['status' => $status]);

        return redirect()->back()->with('success', __('Applicant status updated to :status successfully.', [
            'status' => __(ucfirst($status))
        ]));
    }

    /**
     * Update candidate rating and internal recruiter notes.
     */
    public function updateEvaluation(Request $request, JobApplication $application)
    {
        $this->authorizeCompanyApplication($application);

        $validated = $request->validate([
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'notes'  => ['nullable', 'string', 'max:5000'],
        ]);

        $application->update($validated);

        return redirect()->back()->with('success', __('Candidate evaluation and private notes saved successfully.'));
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

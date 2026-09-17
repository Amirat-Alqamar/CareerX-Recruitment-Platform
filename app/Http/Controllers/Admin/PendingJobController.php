<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PendingJobController extends Controller
{
    /**
     * Display all job posts awaiting admin approval.
     */
    public function index()
    {
        $pendingJobs = Job::where('status', 'pending')
            ->with([
                'company:id,name,logo,website,industry',
                'category:id,name',
                'city:id,name',
                'country:id,name',
                'creator:id,name,email',
                'skills:id,name'
            ])
            ->latest()
            ->get()
            ->map(function ($job) {
                return [
                    'id' => $job->id,
                    'title' => $job->title,
                    'company_name' => $job->company?->name ?? 'Company',
                    'company_logo' => $job->company?->logo ? asset('storage/' . $job->company->logo) : null,
                    'company_website' => $job->company?->website,
                    'creator_name' => $job->creator?->name,
                    'creator_email' => $job->creator?->email,
                    'category' => $job->category?->name ?? 'General',
                    'location' => $job->city?->name . ($job->country?->name ? ', ' . $job->country->name : ''),
                    'job_type' => $job->job_type,
                    'work_type' => $job->work_type,
                    'experience_years' => $job->experience_years,
                    'salary_min' => $job->salary_min,
                    'salary_max' => $job->salary_max,
                    'salary_type' => $job->salary_type,
                    'description' => $job->description,
                    'requirements' => $job->requirements,
                    'responsibilities' => $job->responsibilities,
                    'skills' => $job->skills->pluck('name'),
                    'created_at' => $job->created_at ? $job->created_at->format('Y-m-d H:i') : '',
                    'time_ago' => $job->created_at ? $job->created_at->diffForHumans() : '',
                ];
            });

        return Inertia::render('Admin/PendingJobs', [
            'pendingJobs' => $pendingJobs,
            'count' => $pendingJobs->count(),
        ]);
    }

    /**
     * Approve pending job post.
     */
    public function approve(Job $job)
    {
        $job->update([
            'status' => 'published',
            'is_active' => true,
        ]);

        $employer = $job->createdByUser ?? $job->company?->users()->first();
        if ($employer) {
            $employer->notify(new \App\Notifications\JobModerationStatusNotification($job, 'approved'));
        }

        return redirect()->back()->with('success', __('Job post approved and published successfully.'));
    }

    /**
     * Reject pending job post.
     */
    public function reject(Job $job)
    {
        $job->update([
            'status' => 'closed',
            'is_active' => false,
        ]);

        $employer = $job->createdByUser ?? $job->company?->users()->first();
        if ($employer) {
            $employer->notify(new \App\Notifications\JobModerationStatusNotification($job, 'rejected'));
        }

        return redirect()->back()->with('success', __('Job post rejected.'));
    }
}

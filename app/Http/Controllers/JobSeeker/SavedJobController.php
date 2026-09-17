<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\SavedJob;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SavedJobController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $savedJobs = SavedJob::with([
            'jobPost.company',
            'jobPost.city',
            'jobPost.category',
            'jobPost.skills'
        ])
        ->where('user_id', $user->id)
        ->latest()
        ->get();

        $resumes = $user->profile ? $user->profile->resumes()->latest()->get() : [];

        return Inertia::render('Seeker/SavedJobs', [
            'savedJobs' => $savedJobs,
            'resumes' => $resumes,
        ]);
    }

    public function toggle($jobId)
    {
        $user = Auth::user();
        $existing = SavedJob::where('user_id', $user->id)
            ->where('job_post_id', $jobId)
            ->first();

        if ($existing) {
            $existing->delete();
            return redirect()->back()->with('success', __('Job removed from saved list.'));
        }

        $job = Job::find($jobId);
        if (!$job) {
            return redirect()->back()->with('error', __('Job not found.'));
        }

        SavedJob::create([
            'user_id' => $user->id,
            'job_post_id' => $jobId,
        ]);

        return redirect()->back()->with('success', __('Job saved successfully.'));
    }
}

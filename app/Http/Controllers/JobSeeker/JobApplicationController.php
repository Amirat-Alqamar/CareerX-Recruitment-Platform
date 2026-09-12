<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobApplication;
use App\Models\Job;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class JobApplicationController extends Controller
{

    public function index()
    {
        $profile = Auth::user()->profile;

        $applications = $profile ? $profile->applications()->with('jobPost.company')->latest()->get() : [];

        return view('job_seeker.applications.index', compact('applications'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'job_post_id'  => 'required|exists:job_posts,id',
            'resume_id'    => 'nullable|exists:resumes,id',
            'cover_letter' => 'nullable|string',
        ]);

        $profile = Auth::user()->profile;

        if (!$profile) {
            return redirect()->back()->with('error', "You must complete your profile data before applying for jobs.");
        }

        $alreadyApplied = JobApplication::where('job_post_id', $validated['job_post_id'])
            ->where('profile_id', $profile->id)
            ->exists();

        if ($alreadyApplied) {
            return redirect()->back()->with('error', 'You have already applied for this job.');
        }

        JobApplication::create([
            'job_post_id'  => $validated['job_post_id'],
            'profile_id'   => $profile->id,
            'resume_id'    => $validated['resume_id'] ?? null,
            'cover_letter' => $validated['cover_letter'] ?? null,
            'status'       => 'applied',
        ]);

        return redirect()->back()->with('success', 'You have successfully applied for this job.');
    }

    public function show(JobApplication $application)
    {
        if ($application->profile_id !== Auth::user()->profile?->id) {
            abort(403, 'You are not authorized to view this application.');
        }

        $application->load(['jobPost.company', 'resume']);

        return view('job_seeker.applications.show', compact('application'));
    }
}

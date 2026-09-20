<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobCategory;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobSearchController extends Controller
{

    public function index(Request $request)
    {
        $query = Job::with(['company', 'category', 'city', 'skills'])
            ->where('is_active', true)
            ->where('status', 'published');

        if ($request->filled('keyword')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->keyword . '%')
                  ->orWhere('description', 'like', '%' . $request->keyword . '%');
            });
        }

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('work_type')) {
            $query->where('work_type', $request->work_type);
        }

        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        $jobs = $query->latest()->paginate(12)->withQueryString();

        $categories = JobCategory::withCount(['jobs' => function ($q) {
            $q->where('is_active', true)->where('status', 'published');
        }])->get();

        $cities = City::orderBy('name')->get();

        $user = Auth::user();
        $savedJobIds = $user ? $user->savedJobs()->pluck('job_post_id')->toArray() : [];
        $appliedJobIds = $user?->profile ? $user->profile->applications()->pluck('job_post_id')->toArray() : [];
        $resumes = $user?->profile ? $user->profile->resumes()->latest()->get() : [];

        return Inertia::render('Seeker/Jobs', [
            'jobs' => $jobs,
            'categories' => $categories,
            'cities' => $cities,
            'savedJobIds' => $savedJobIds,
            'appliedJobIds' => $appliedJobIds,
            'resumes' => $resumes,
            'filters' => $request->only(['keyword', 'category_id', 'city_id', 'work_type', 'job_type']),
            'selectedJobId' => $request->get('job_id'),
        ]);
    }

    public function show(Job $job)
    {
        $job->increment('views_count');
        return redirect()->route('job-seeker.jobs.index', ['job_id' => $job->id]);
    }
}


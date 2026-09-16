<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use App\Models\Job;
use App\Models\JobCategory;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class JobController extends Controller
{
    /**
     * Display a listing of the employer's company jobs.
     */
    public function index(Request $request)
    {
        $companyId = Auth::user()->company_id;

        $query = Job::where('company_id', $companyId)
            ->with(['category', 'city', 'country'])
            ->withCount('applications');

        // Optional status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $jobs = $query->latest()->paginate(10)->withQueryString();

        // Key stats for employer dashboard
        $stats = [
            'total_jobs'        => Job::where('company_id', $companyId)->count(),
            'active_jobs'       => Job::where('company_id', $companyId)->where('is_active', true)->where('status', 'published')->count(),
            'closed_jobs'       => Job::where('company_id', $companyId)->where('status', 'closed')->count(),
            'total_applications'=> Job::where('company_id', $companyId)->withCount('applications')->get()->sum('applications_count'),
        ];

        return Inertia::render('Employer/Jobs', [
            'jobs' => $jobs,
            'stats' => $stats,
            'filters' => $request->only('status'),
        ]);
    }

    /**
     * Show the form for creating a new job.
     */
    public function create()
    {
        $categories = JobCategory::orderBy('name')->get();
        $countries = Country::orderBy('name')->get();
        $skills = Skill::orderBy('name')->get();

        $company = Auth::user()->company;
        $cities = $company && $company->country_id
            ? City::where('country_id', $company->country_id)->orderBy('name')->get()
            : City::orderBy('name')->get();

        return Inertia::render('Employer/JobForm', [
            'categories' => $categories,
            'countries' => $countries,
            'cities' => $cities,
            'skills' => $skills,
            'company' => $company,
            'job' => null,
            'selectedSkills' => [],
        ]);
    }

    /**
     * Store a newly created job in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title'            => ['required', 'string', 'max:255'],
            'category_id'      => ['required', 'exists:job_categories,id'],
            'job_type'         => ['required', 'in:full_time,part_time,freelance,internship'],
            'work_type'        => ['required', 'in:on_site,remote,hybrid'],
            'salary_min'       => ['nullable', 'numeric', 'min:0'],
            'salary_max'       => ['nullable', 'numeric', 'gte:salary_min'],
            'salary_type'      => ['required', 'in:hourly,monthly'],
            'experience_years' => ['required', 'integer', 'min:0', 'max:50'],
            'country_id'       => ['nullable', 'exists:countries,id'],
            'city_id'          => ['nullable', 'exists:cities,id'],
            'description'      => ['required', 'string'],
            'responsibilities' => ['nullable', 'string'],
            'requirements'     => ['nullable', 'string'],
            'status'           => ['required', 'in:draft,published,closed'],
            'skills'           => ['nullable', 'array'],
            'skills.*'         => ['exists:skills,id'],
        ]);

        $companyId = Auth::user()->company_id;

        $validated['company_id'] = $companyId;
        $validated['created_by_user_id'] = Auth::id();
        $validated['slug'] = Str::slug($validated['title']) . '-' . time() . '-' . rand(100, 999);
        $validated['is_active'] = ($validated['status'] === 'published');

        $job = Job::create($validated);

        if (!empty($request->skills)) {
            $job->skills()->sync($request->skills);
        }

        return redirect()->route('employer.jobs.index')
            ->with('success', __('Job post created successfully.'));
    }

    /**
     * Show the form for editing the specified job.
     */
    public function edit(Job $job)
    {
        $this->authorizeCompanyJob($job);

        $categories = JobCategory::orderBy('name')->get();
        $countries = Country::orderBy('name')->get();
        $cities = $job->country_id
            ? City::where('country_id', $job->country_id)->orderBy('name')->get()
            : City::orderBy('name')->get();
        $skills = Skill::orderBy('name')->get();
        $selectedSkills = $job->skills->pluck('id')->toArray();

        return Inertia::render('Employer/JobForm', [
            'job' => $job,
            'categories' => $categories,
            'countries' => $countries,
            'cities' => $cities,
            'skills' => $skills,
            'selectedSkills' => $selectedSkills,
            'company' => Auth::user()->company,
        ]);
    }

    /**
     * Update the specified job in storage.
     */
    public function update(Request $request, Job $job)
    {
        $this->authorizeCompanyJob($job);

        $validated = $request->validate([
            'title'            => ['required', 'string', 'max:255'],
            'category_id'      => ['required', 'exists:job_categories,id'],
            'job_type'         => ['required', 'in:full_time,part_time,freelance,internship'],
            'work_type'        => ['required', 'in:on_site,remote,hybrid'],
            'salary_min'       => ['nullable', 'numeric', 'min:0'],
            'salary_max'       => ['nullable', 'numeric', 'gte:salary_min'],
            'salary_type'      => ['required', 'in:hourly,monthly'],
            'experience_years' => ['required', 'integer', 'min:0', 'max:50'],
            'country_id'       => ['nullable', 'exists:countries,id'],
            'city_id'          => ['nullable', 'exists:cities,id'],
            'description'      => ['required', 'string'],
            'responsibilities' => ['nullable', 'string'],
            'requirements'     => ['nullable', 'string'],
            'status'           => ['required', 'in:draft,published,closed'],
            'skills'           => ['nullable', 'array'],
            'skills.*'         => ['exists:skills,id'],
        ]);

        $validated['is_active'] = ($validated['status'] === 'published');

        if ($job->title !== $validated['title']) {
            $validated['slug'] = Str::slug($validated['title']) . '-' . time() . '-' . rand(100, 999);
        }

        $job->update($validated);

        if (isset($request->skills)) {
            $job->skills()->sync($request->skills);
        }

        return redirect()->route('employer.jobs.index')
            ->with('success', __('Job post updated successfully.'));
    }

    /**
     * Remove the specified job from storage.
     */
    public function destroy(Job $job)
    {
        $this->authorizeCompanyJob($job);

        $job->delete();

        return redirect()->route('employer.jobs.index')
            ->with('success', __('Job post deleted successfully.'));
    }

    /**
     * Toggle the status of a job (publish/close).
     */
    public function toggleStatus(Job $job)
    {
        $this->authorizeCompanyJob($job);

        if ($job->status === 'published') {
            $job->update(['status' => 'closed', 'is_active' => false]);
            $message = __('Job has been closed.');
        } else {
            $job->update(['status' => 'published', 'is_active' => true]);
            $message = __('Job has been published.');
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Duplicate an existing job post as a new draft.
     */
    public function duplicate(Job $job)
    {
        $this->authorizeCompanyJob($job);

        $newJob = $job->replicate();
        $newJob->title = $job->title . ' (' . __('Copy') . ')';
        $newJob->slug = Str::slug($newJob->title) . '-' . time() . '-' . rand(100, 999);
        $newJob->status = 'draft';
        $newJob->is_active = false;
        $newJob->views_count = 0;
        $newJob->created_by_user_id = Auth::id();
        $newJob->save();

        // Copy skills relation
        $skills = $job->skills->pluck('id')->toArray();
        if (!empty($skills)) {
            $newJob->skills()->sync($skills);
        }

        return redirect()->route('employer.jobs.edit', $newJob)
            ->with('success', __('Job duplicated successfully as a draft. You can now make changes and publish it.'));
    }

    /**
     * Security check: ensure the job belongs to the authenticated user's company.
     */
    protected function authorizeCompanyJob(Job $job): void
    {
        if ($job->company_id !== Auth::user()->company_id) {
            abort(403, __('You do not have permission to manage this job post.'));
        }
    }
}

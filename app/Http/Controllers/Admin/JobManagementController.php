<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JobManagementController extends Controller
{
    /**
     * Display a listing of all platform jobs with filtering.
     */
    public function index(Request $request)
    {
        $query = Job::with(['company:id,name,logo', 'category:id,name', 'city:id,name', 'country:id,name', 'creator:id,name,email'])
            ->withCount('applications');

        // Filter by status
        if ($request->filled('status') && in_array($request->status, ['pending', 'published', 'closed', 'draft'])) {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Search title or company name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('company', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $jobs = $query->latest()->paginate(10)->withQueryString()->through(function ($job) {
            return [
                'id' => $job->id,
                'title' => $job->title,
                'slug' => $job->slug,
                'company_name' => $job->company?->name ?? 'Company',
                'company_logo' => $job->company?->logo ? asset('storage/' . $job->company->logo) : null,
                'creator_name' => $job->creator?->name,
                'category' => $job->category?->name ?? 'General',
                'category_id' => $job->category_id,
                'location' => $job->city?->name . ($job->country?->name ? ', ' . $job->country->name : ''),
                'job_type' => $job->job_type,
                'work_type' => $job->work_type,
                'salary_min' => $job->salary_min,
                'salary_max' => $job->salary_max,
                'salary_type' => $job->salary_type,
                'status' => $job->status,
                'is_active' => (bool) $job->is_active,
                'applications_count' => $job->applications_count ?? 0,
                'views_count' => $job->views_count ?? 0,
                'description' => $job->description,
                'requirements' => $job->requirements,
                'responsibilities' => $job->responsibilities,
                'created_at' => $job->created_at ? $job->created_at->format('Y-m-d') : '',
            ];
        });

        $categories = JobCategory::orderBy('name')->get(['id', 'name']);

        $stats = [
            'total'     => Job::count(),
            'published' => Job::where('status', 'published')->count(),
            'pending'   => Job::where('status', 'pending')->count(),
            'closed'    => Job::where('status', 'closed')->count(),
            'draft'     => Job::where('status', 'draft')->count(),
        ];

        return Inertia::render('Admin/Jobs', [
            'jobs'       => $jobs,
            'categories' => $categories,
            'stats'      => $stats,
            'filters'    => $request->only(['status', 'category_id', 'search']),
        ]);
    }

    /**
     * Approve a pending job post for publication.
     */
    public function approve(Job $job)
    {
        $job->update([
            'status' => 'published',
            'is_active' => true,
        ]);

        return redirect()->back()->with('success', __('Job post has been approved and is now live.'));
    }

    /**
     * Reject a job post.
     */
    public function reject(Job $job)
    {
        $job->update([
            'status' => 'closed',
            'is_active' => false,
        ]);

        return redirect()->back()->with('success', __('Job post has been rejected and closed.'));
    }

    /**
     * Toggle status between published and closed.
     */
    public function toggleStatus(Job $job)
    {
        if ($job->status === 'published') {
            $job->update(['status' => 'closed', 'is_active' => false]);
            $msg = __('Job post marked as closed.');
        } else {
            $job->update(['status' => 'published', 'is_active' => true]);
            $msg = __('Job post published successfully.');
        }

        return redirect()->back()->with('success', $msg);
    }

    /**
     * Delete a job permanently.
     */
    public function destroy(Job $job)
    {
        $job->delete();

        return redirect()->back()->with('success', __('Job post deleted successfully.'));
    }
}

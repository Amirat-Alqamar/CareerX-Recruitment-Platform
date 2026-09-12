<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Job;
use App\Models\JobCategory;
use App\Models\City;
use Illuminate\Http\Request;

class JobSearchController extends Controller
{
    /**
     * تصفح الوظائف والبحث مع التصفية (Filters)
     */
    public function index(Request $request)
    {
        $query = Job::with(['company', 'category', 'city'])
            ->where('is_active', true)
            ->where('status', 'published');

        // فلترة بالكلمة المفتاحية في العنوان أو الوصف
        if ($request->filled('keyword')) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->keyword . '%')
                  ->orWhere('description', 'like', '%' . $request->keyword . '%');
            });
        }

        // فلترة بالتصنيف / القسم
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // فلترة بنوع العمل (remotely / on_site / hybrid)
        if ($request->filled('work_type')) {
            $query->where('work_type', $request->work_type);
        }

        // فلترة بنوع الوظيفة (full_time / part_time / internship)
        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        // فلترة بالمدينة
        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        $jobs = $query->latest()->paginate(10);

        $categories = JobCategory::withCount(['jobs' => function ($q) {
            $q->where('is_active', true)->where('status', 'published');
        }])->get();
        $cities = City::orderBy('name')->get();

        return view('job_seeker.jobs.index', compact('jobs', 'categories', 'cities'));
    }

    /**
     * عرض تفاصيل وظيفة محددة
     */
    public function show(Job $job)
    {
        // زيادة عدد المشاهدات
        $job->increment('views_count');

        $job->load(['company', 'category', 'city', 'skills']);

        return view('job_seeker.jobs.show', compact('job'));
    }
}

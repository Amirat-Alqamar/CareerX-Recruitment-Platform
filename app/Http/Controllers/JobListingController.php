<?php

namespace App\Http\Controllers;

use App\Models\Job;
use App\Models\JobCategory;
use App\Models\Company;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class JobListingController extends Controller
{

    public function home()
    {
        $featuredJobs = Job::with(['company', 'category', 'city', 'skills'])
            ->where('is_active', true)
            ->where('status', 'published')
            ->latest()
            ->take(6)
            ->get();

        $totalJobsCount = Job::where('is_active', true)
            ->where('status', 'published')
            ->count();

        $categories = JobCategory::withCount(['jobs' => function ($q) {
            $q->where('is_active', true)->where('status', 'published');
        }])->get();

        $featuredCompanies = Company::with(['city'])
            ->withCount(['jobs' => function ($q) {
                $q->where('is_active', true)->where('status', 'published');
            }])
            ->latest()
            ->take(6)
            ->get();

        $totalCompaniesCount = Company::count();

        $user = Auth::user();
        $savedJobIds = $user ? $user->savedJobs()->pluck('job_post_id')->toArray() : [];
        $appliedJobIds = $user?->profile ? $user->profile->applications()->pluck('job_post_id')->toArray() : [];
        $resumes = $user?->profile ? $user->profile->resumes()->latest()->get() : [];

        return Inertia::render('LandingPage', [
            'featuredJobs'        => $featuredJobs,
            'totalJobsCount'      => $totalJobsCount,
            'featuredCompanies'   => $featuredCompanies,
            'totalCompaniesCount' => $totalCompaniesCount,
            'categories'          => $categories,
            'savedJobIds'         => $savedJobIds,
            'appliedJobIds'       => $appliedJobIds,
            'resumes'             => $resumes,
        ]);
    }

    public function index(Request $request)
    {
        $query = Job::with(['company', 'category', 'city', 'skills'])
            ->where('is_active', true)
            ->where('status', 'published');

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('title', 'like', '%' . $keyword . '%')
                  ->orWhere('description', 'like', '%' . $keyword . '%')
                  ->orWhereHas('company', function ($c) use ($keyword) {
                      $c->where('name', 'like', '%' . $keyword . '%');
                  });
            });
        }

        if ($request->filled('company_id')) {
            $query->where('company_id', $request->company_id);
        }

        if ($request->filled('category')) {
            $cat = $request->category;
            $query->where(function ($q) use ($cat) {
                if (is_numeric($cat)) {
                    $q->where('category_id', $cat);
                } else {
                    $q->whereHas('category', function ($sub) use ($cat) {
                        $sub->where('slug', $cat)->orWhere('name', $cat);
                    });
                }
            });
        } elseif ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('work_type')) {
            $workType = $request->work_type;
            if ($workType === 'remote' || $workType === 'remotely') {
                $query->whereIn('work_type', ['remote', 'remotely']);
            } else {
                $query->where('work_type', $workType);
            }
        }

        if ($request->filled('job_type')) {
            $query->where('job_type', $request->job_type);
        }

        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }

        if ($request->filled('location')) {
            $loc = $request->location;
            $query->where(function ($q) use ($loc) {
                $q->whereHas('city', function ($c) use ($loc) {
                    $c->where('name', 'like', '%' . $loc . '%');
                })->orWhere('work_type', 'like', '%' . $loc . '%');
            });
        }

        $jobs = $query->latest()->paginate(9)->withQueryString();

        $totalJobsQuery = Job::where('is_active', true)->where('status', 'published');
        if ($request->filled('company_id')) {
            $totalJobsQuery->where('company_id', $request->company_id);
        } elseif ($request->filled('keyword')) {
            $kw = $request->keyword;
            $totalJobsQuery->where(function ($sq) use ($kw) {
                $sq->where('title', 'like', '%' . $kw . '%')
                   ->orWhere('description', 'like', '%' . $kw . '%')
                   ->orWhereHas('company', function ($c) use ($kw) {
                       $c->where('name', 'like', '%' . $kw . '%');
                   });
            });
        }
        $totalJobsCount = $totalJobsQuery->count();

        $selectedCompany = $request->filled('company_id')
            ? Company::find($request->company_id)
            : null;

        $categories = JobCategory::withCount(['jobs' => function ($q) use ($request) {
            $q->where('is_active', true)->where('status', 'published');

            if ($request->filled('company_id')) {
                $q->where('company_id', $request->company_id);
            }

            if ($request->filled('keyword')) {
                $kw = $request->keyword;
                $q->where(function ($sq) use ($kw) {
                    $sq->where('title', 'like', '%' . $kw . '%')
                       ->orWhere('description', 'like', '%' . $kw . '%')
                       ->orWhereHas('company', function ($c) use ($kw) {
                           $c->where('name', 'like', '%' . $kw . '%');
                       });
                });
            }
        }])->get();

        $cities = City::orderBy('name')->get();

        $user = Auth::user();
        $savedJobIds = $user ? $user->savedJobs()->pluck('job_post_id')->toArray() : [];
        $appliedJobIds = $user?->profile ? $user->profile->applications()->pluck('job_post_id')->toArray() : [];
        $resumes = $user?->profile ? $user->profile->resumes()->latest()->get() : [];

        return Inertia::render('Jobs/Index', [
            'jobs'            => $jobs,
            'totalJobsCount'  => $totalJobsCount,
            'selectedCompany' => $selectedCompany,
            'categories'      => $categories,
            'cities'          => $cities,
            'savedJobIds'     => $savedJobIds,
            'appliedJobIds'   => $appliedJobIds,
            'resumes'         => $resumes,
            'filters'         => [
                'keyword'     => $request->get('keyword', ''),
                'category'    => $request->get('category', ''),
                'category_id' => $request->get('category_id', ''),
                'company_id'  => $request->get('company_id', ''),
                'work_type'   => $request->get('work_type', ''),
                'job_type'    => $request->get('job_type', ''),
                'city_id'     => $request->get('city_id', ''),
            ],
            'selectedJobId'   => $request->get('job_id'),
        ]);
    }

    public function companies(Request $request)
    {
        $query = Company::withCount(['jobs' => function ($q) {
            $q->where('is_active', true)->where('status', 'published');
        }]);

        if ($request->filled('keyword')) {
            $keyword = $request->keyword;
            $query->where(function ($q) use ($keyword) {
                $q->where('name', 'like', '%' . $keyword . '%')
                  ->orWhere('description', 'like', '%' . $keyword . '%')
                  ->orWhere('address', 'like', '%' . $keyword . '%');
            });
        }

        $companies = $query->latest()->paginate(12)->withQueryString();

        return Inertia::render('Companies/Index', [
            'companies' => $companies,
            'filters'   => [
                'keyword' => $request->get('keyword', ''),
            ],
        ]);
    }
}


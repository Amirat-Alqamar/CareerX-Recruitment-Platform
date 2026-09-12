<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SavedJobController extends Controller
{
    public function index()
    {
        return view('job_seeker.saved_jobs.index', ['savedJobs' => collect()]);
    }

    public function toggle($jobId)
    {
        return redirect()->back()->with('success', 'تم تحديث حالة حفظ الوظيفة.');
    }
}

<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Resume;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ResumeController extends Controller
{
    
    public function index()
    {
        return redirect()->route('seeker.profile', ['modal' => 'resumes']);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'file'  => 'required|file|mimes:pdf,doc,docx|max:5120',
        ]);

        $profile = Auth::user()->profile;

        if (!$profile) {
            return redirect()->back()->with('error', 'You must create the basic profile data first.');
        }

        $filePath = $request->file('file')->store('resumes', 'public');

        $profile->resumes()->create([
            'title'     => $request->title,
            'file_path' => $filePath,
        ]);

        return redirect()->back()->with('success', 'You have successfully uploaded your resume.');
    }

    private function checkAuthorization(Resume $resume)
    {
        if ($resume->profile_id !== Auth::user()->profile?->id) {
            abort(403, 'You are not authorized to update this resume.');
        }
    }

    public function download(Resume $resume)
    {
        $this->checkAuthorization($resume);

        if (!Storage::disk('public')->exists($resume->file_path)) {
            return redirect()->back()->with('error', 'The file is not found on the server.');
        }

        return Storage::disk('public')->download($resume->file_path, $resume->title);
    }

    public function destroy(Resume $resume)
    {
        $this->checkAuthorization($resume);
        if (Storage::disk('public')->exists($resume->file_path)) {
            Storage::disk('public')->delete($resume->file_path);
        }

        $resume->delete();

        return redirect()->back()->with('success', 'You have successfully deleted the resume.');
    }
}

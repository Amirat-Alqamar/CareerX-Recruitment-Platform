<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ExperienceController extends Controller
{
    public function index()
    {
        $profile = Auth::user()->profile;

        $experiences = $profile ? $profile->experiences()->orderBy('start_date', 'desc')->get() : [];

        return view('job_seeker.experiences.index', compact('experiences'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'start_date'   => 'required|date',
            'end_date'     => 'nullable|date|after_or_equal:start_date',
        ]);

        $profile = Auth::user()->profile;

        if (!$profile) {
            return redirect()->back()->with('error', 'You must create the basic profile data first.');
        }

        $profile->experiences()->create($validated);

        return redirect()->back()->with('success', 'You have successfully added the experience.');
    }

    private function checkAuthorization(Experience $experience)
    {
        if ($experience->profile_id !== Auth::user()->profile?->id) {
            abort(403, 'You are not authorized to update this experience.');
        }
    }

    public function update(Request $request, Experience $experience)
    {
        $this->checkAuthorization($experience);
        $validated = $request->validate([
            'company_name' => 'required|string|max:255',
            'title'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'start_date'   => 'required|date',
            'end_date'     => 'nullable|date|after_or_equal:start_date',
        ]);

        $experience->update($validated);

        return redirect()->back()->with('success', 'You have successfully updated the experience.');
    }

    public function destroy(Experience $experience)
    {
        $this->checkAuthorization($experience);
        $experience->delete();

        return redirect()->back()->with('success', 'You have successfully deleted the experience.');
    }


}

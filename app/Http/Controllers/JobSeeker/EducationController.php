<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EducationController extends Controller
{
    public function index()
    {
        return redirect()->route('seeker.profile', ['modal' => 'education']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'university' => 'required|string|max:255',
            'degree'     => 'required|string|max:255',
            'gpa'        => 'nullable|string|max:50',
            'start_year' => 'required|integer|digits:4|min:1950|max:' . (date('Y') + 10),
            'end_year'   => 'nullable|integer|digits:4|gte:start_year|max:' . (date('Y') + 10),
        ]);

        $profile = Auth::user()->profile;

        if (!$profile) {
            return redirect()->back()->with('error', 'You must create the basic profile data first.');
        }

        $profile->educations()->create($validated);

        return redirect()->back()->with('success', 'You have successfully added the education.');
    }


    private function checkAuthorization(Education $education)
    {
        if ($education->profile_id !== Auth::user()->profile?->id) {
            abort(403, 'You are not authorized to update this education.');
        }
    }

    public function update(Request $request, Education $education)
    {
        $this->checkAuthorization($education);
        $validated = $request->validate([
            'university' => 'required|string|max:255',
            'degree'     => 'required|string|max:255',
            'gpa'        => 'nullable|string|max:50',
            'start_year' => 'required|integer|digits:4|min:1950|max:' . (date('Y') + 10),
            'end_year'   => 'nullable|integer|digits:4|gte:start_year|max:' . (date('Y') + 10),
        ]);

        $education->update($validated);

        return redirect()->back()->with('success', 'You have successfully updated the education.');
    }


    public function destroy(Education $education)
    {
        $this->checkAuthorization($education);


        $education->delete();

        return redirect()->back()->with('success', 'You have successfully deleted the education.');
    }
}

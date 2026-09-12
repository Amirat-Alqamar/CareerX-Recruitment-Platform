<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobSeekerProfile;
use App\Models\Country;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function edit()
    {
        $user = Auth::user();

        $profile = JobSeekerProfile::firstOrCreate(
            ['user_id' => $user->id]
        );

        $countries = Country::with('cities')->orderBy('name')->get();
        $cities = City::orderBy('name')->get();

        return view('job_seeker.profile.edit', compact('profile', 'countries', 'cities'));
    }


    public function update(Request $request)
    {
        $validated = $request->validate([
            'country_id'          => 'nullable|exists:countries,id',
            'city_id'             => 'nullable|exists:cities,id',
            'job_title'           => 'required|string|max:255',
            'bio'                 => 'nullable|string',
            'nationality'         => 'nullable|string|max:100',
            'address'             => 'nullable|string|max:255',
            'marital_status'      => 'nullable|string',
            'birth_date'          => 'nullable|date',
            'years_of_experience' => 'nullable|integer|min:0',
            'work_type'           => 'nullable|string',
            'gender_preference'   => 'nullable|string',
        ]);

        $user = Auth::user();

        JobSeekerProfile::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return redirect()->back()->with('success', 'You have successfully updated your profile.');
    }

    public function show()
    {
        $user = Auth::user();
        
        $profile = JobSeekerProfile::with(['user', 'skills', 'languages', 'experiences', 'educations', 'resumes', 'country', 'city'])
            ->where('user_id', $user->id)
            ->firstOrFail();

        return view('job_seeker.profile.show', compact('profile'));
    }

}

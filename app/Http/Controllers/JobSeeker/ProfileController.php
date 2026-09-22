<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\JobSeekerProfile;
use App\Models\Country;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class ProfileController extends Controller
{
    public function edit()
    {
        return redirect()->route('seeker.profile', ['modal' => 'profile']);
    }

    public function update(Request $request)
    {
        Gate::authorize('profile.edit');

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

        return redirect()->back()->with('success', __('Profile updated successfully.'));
    }

    public function show()
    {
        return redirect()->route('seeker.profile');
    }

    public function uploadAvatar(Request $request)
    {
        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:3072',
        ]);

        $user = Auth::user();

        if ($user->avatar && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->avatar)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');
        $user->avatar = $path;
        $user->save();

        return redirect()->back()->with('success', __('Profile photo updated successfully.'));
    }

    public function uploadCover(Request $request)
    {
        $request->validate([
            'cover_image' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $user = Auth::user();

        if ($user->cover_image && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->cover_image)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($user->cover_image);
        }

        $path = $request->file('cover_image')->store('covers', 'public');
        $user->cover_image = $path;
        $user->save();

        return redirect

        ()->back()->with('success', __('Cover photo updated successfully.'));
    }

    public function deleteAvatar()
    {
        $user = Auth::user();

        if ($user->avatar && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->avatar)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($user->avatar);
        }

        $user->avatar = null;
        $user->save();

        return redirect()->back()->with('success', __('Profile photo removed successfully.'));
    }

    public function deleteCover()
    {
        $user = Auth::user();

        if ($user->cover_image && \Illuminate\Support\Facades\Storage::disk('public')->exists($user->cover_image)) {
            \Illuminate\Support\Facades\Storage::disk('public')->delete($user->cover_image);
        }

        $user->cover_image = null;
        $user->save();

        return redirect()->back()->with('success', __('Cover photo removed successfully.'));
    }
}


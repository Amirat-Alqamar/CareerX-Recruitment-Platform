<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class SkillController extends Controller
{
    public function index()
    {
        return redirect()->route('seeker.profile', ['modal' => 'skills']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'skill_name' => 'required|string|max:100',
            'level_id'   => 'nullable|integer|min:1|max:5',
        ]);

        $profile = Auth::user()->profile;

        if (!$profile) {
            return redirect()->back()->with('error', __('You must create the basic profile data first.'));
        }

        $skillName = trim($validated['skill_name']);

        $skill = Skill::firstOrCreate([
            'name' => $skillName,
        ]);

        $profile->skills()->syncWithoutDetaching([
            $skill->id => ['level_id' => $validated['level_id'] ?? null]
        ]);

        return redirect()->back()->with('success', __('Skill added successfully.'));
    }

    public function update(Request $request, Skill $skill)
    {
        $validated = $request->validate([
            'level_id' => 'required|integer|min:1|max:5',
        ]);

        $profile = Auth::user()->profile;

        if ($profile) {
            $profile->skills()->updateExistingPivot($skill->id, [
                'level_id' => $validated['level_id']
            ]);
        }

        return redirect()->back()->with('success', __('Skill level updated successfully.'));
    }

    public function destroy(Skill $skill)
    {
        $profile = Auth::user()->profile;

        if ($profile) {
            $profile->skills()->detach($skill->id);
        }

        return redirect()->back()->with('success', __('Skill removed successfully.'));
    }
}


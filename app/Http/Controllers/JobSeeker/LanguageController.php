<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Language;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LanguageController extends Controller
{
    public function index()
    {
        return redirect()->route('seeker.profile', ['modal' => 'languages']);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'language_name' => 'required|string|max:100',
            'level'         => 'required|string|max:50',
        ]);

        $profile = Auth::user()->profile;

        if (!$profile) {
            return redirect()->back()->with('error', 'يجب إنشاء البيانات الأساسية للملف الشخصي أولاً.');
        }

        $languageName = trim($validated['language_name']);

        $language = Language::firstOrCreate([
            'name' => $languageName,
        ]);

        $profile->languages()->syncWithoutDetaching([
            $language->id => ['level' => $validated['level']]
        ]);

        return redirect()->back()->with('success', 'تمت إضافة اللغة بنجاح.');
    }

    public function update(Request $request, Language $language)
    {
        $validated = $request->validate([
            'level' => 'required|string|max:50',
        ]);

        $profile = Auth::user()->profile;

        if ($profile) {
            $profile->languages()->updateExistingPivot($language->id, [
                'level' => $validated['level']
            ]);
        }

        return redirect()->back()->with('success', 'تم تحديث مستوى إتقان اللغة بنجاح.');
    }

    public function destroy(Language $language)
    {
        $profile = Auth::user()->profile;

        if ($profile) {
            $profile->languages()->detach($language->id);
        }

        return redirect()->back()->with('success', 'تم حذف اللغة بنجاح.');
    }
}

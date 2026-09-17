<?php

namespace App\Http\Controllers\JobSeeker;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CertificationController extends Controller
{
    public function index()
    {
        return redirect()->route('seeker.profile', ['modal' => 'certifications']);
    }

    public function store(Request $request)
    {
        if ($request->filled('credential_url')) {
            $url = trim($request->credential_url);
            if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
                $url = "https://" . $url;
            }
            $request->merge(['credential_url' => $url]);
        }

        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'issuer'         => 'required|string|max:255',
            'issue_date'     => 'nullable|date',
            'credential_url' => 'nullable|url|max:255',
        ]);

        $profile = Auth::user()->profile;

        if (!$profile) {
            return redirect()->back()->with('error', __('You must create the basic profile data first.'));
        }

        $profile->certifications()->create($validated);

        return redirect()->back()->with('success', __('Certification added successfully.'));
    }

    private function checkAuthorization(Certification $certification)
    {
        if ($certification->profile_id !== Auth::user()->profile?->id) {
            abort(403, __('You are not authorized to update this certification.'));
        }
    }

    public function update(Request $request, Certification $certification)
    {
        $this->checkAuthorization($certification);

        if ($request->filled('credential_url')) {
            $url = trim($request->credential_url);
            if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
                $url = "https://" . $url;
            }
            $request->merge(['credential_url' => $url]);
        }

        $validated = $request->validate([
            'name'           => 'required|string|max:255',
            'issuer'         => 'required|string|max:255',
            'issue_date'     => 'nullable|date',
            'credential_url' => 'nullable|url|max:255',
        ]);

        $certification->update($validated);

        return redirect()->back()->with('success', __('Certification updated successfully.'));
    }

    public function destroy(Certification $certification)
    {
        $this->checkAuthorization($certification);

        $certification->delete();

        return redirect()->back()->with('success', __('Certification deleted successfully.'));
    }
}

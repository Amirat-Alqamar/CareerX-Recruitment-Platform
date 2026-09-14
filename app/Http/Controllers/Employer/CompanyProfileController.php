<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CompanyProfileController extends Controller
{
    /**
     * Display the employer's company profile.
     */
    public function show()
    {
        $company = Auth::user()->company;

        if (!$company) {
            return redirect()->route('employer.company.edit')
                ->with('error', __('Please complete your company profile first.'));
        }

        $company->load(['country', 'city', 'socials', 'jobs' => function ($query) {
            $query->latest()->take(5);
        }]);

        return view('employer.company.show', compact('company'));
    }

    /**
     * Show the form for editing the company profile.
     */
    public function edit()
    {
        $company = Auth::user()->company;
        $countries = Country::orderBy('name')->get();
        $cities = $company && $company->country_id
            ? City::where('country_id', $company->country_id)->orderBy('name')->get()
            : City::orderBy('name')->get();

        $socials = $company ? $company->socials->pluck('url', 'platform')->toArray() : [];

        return view('employer.company.edit', compact('company', 'countries', 'cities', 'socials'));
    }

    /**
     * Update the company profile in storage.
     */
    public function update(Request $request)
    {
        $company = Auth::user()->company;

        $validated = $request->validate([
            'name'         => ['required', 'string', 'max:255'],
            'country_id'   => ['nullable', 'exists:countries,id'],
            'city_id'      => ['nullable', 'exists:cities,id'],
            'description'  => ['nullable', 'string'],
            'company_size' => ['nullable', 'string', 'max:100'],
            'founded_year' => ['nullable', 'integer', 'min:1800', 'max:' . date('Y')],
            'website'      => ['nullable', 'string', 'max:255'],
            'address'      => ['nullable', 'string', 'max:255'],
            'logo'         => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp,svg', 'max:2048'],
            'cover_image'  => ['nullable', 'image', 'mimes:jpeg,png,jpg,webp', 'max:4096'],
            'socials'      => ['nullable', 'array'],
            'socials.*'    => ['nullable', 'string', 'max:255'],
        ]);

        // Auto format website URL
        if (!empty($validated['website']) && !preg_match("~^(?:f|ht)tps?://~i", $validated['website'])) {
            $validated['website'] = 'https://' . $validated['website'];
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            if ($company->logo && Storage::disk('public')->exists($company->logo)) {
                Storage::disk('public')->delete($company->logo);
            }
            $validated['logo'] = $request->file('logo')->store('companies/logos', 'public');
        }

        // Handle cover image upload
        if ($request->hasFile('cover_image')) {
            if ($company->cover_image && Storage::disk('public')->exists($company->cover_image)) {
                Storage::disk('public')->delete($company->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('companies/covers', 'public');
        }

        // Update company name and ensure unique slug if name changed
        if ($company->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . $company->id;
        }

        $company->update($validated);

        // Sync social media accounts
        if ($request->has('socials')) {
            $allowedPlatforms = ['linkedin', 'facebook', 'x', 'instagram', 'other'];
            foreach ($request->input('socials') as $platform => $url) {
                if (!in_array($platform, $allowedPlatforms)) {
                    continue;
                }
                $url = trim($url ?? '');
                if (!empty($url)) {
                    if (!preg_match("~^(?:f|ht)tps?://~i", $url)) {
                        $url = 'https://' . $url;
                    }
                    $company->socials()->updateOrCreate(
                        ['platform' => $platform],
                        ['url' => $url]
                    );
                } else {
                    $company->socials()->where('platform', $platform)->delete();
                }
            }
        }

        return redirect()->back()->with('success', __('Company profile updated successfully.'));
    }
}

<?php

namespace App\Http\Controllers\Employer;

use App\Http\Controllers\Controller;
use App\Models\City;
use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CompanyProfileController extends Controller
{

    public function show()
    {
        $user = Auth::user();
        $company = $user->company;

        if (!$company) {
            $company = \App\Models\Company::create([
                'name' => $user->name . ' Co',
                'slug' => Str::slug($user->name . ' Co') . '-' . time(),
                'status' => 'verified',
            ]);
            $user->company_id = $company->id;
            $user->save();
        }

        $company->load(['country', 'city', 'socials', 'jobs' => function ($query) {
            $query->latest()->take(5);
        }]);

        $countries = Country::orderBy('name')->get();
        $cities = City::orderBy('name')->get();
        $socials = $company->socials->pluck('url', 'platform')->toArray();

        return Inertia::render('Employer/CompanyProfile', [
            'company' => [
                'id' => $company->id,
                'name' => $company->name,
                'description' => $company->description,
                'company_size' => $company->company_size,
                'founded_year' => $company->founded_year,
                'website' => $company->website,
                'address' => $company->address,
                'country_id' => $company->country_id,
                'city_id' => $company->city_id,
                'logo_url' => $company->logo ? asset('storage/' . $company->logo) : null,
                'cover_url' => $company->cover_image ? asset('storage/' . $company->cover_image) : null,
                'country' => $company->country?->name,
                'city' => $company->city?->name,
                'jobs' => $company->jobs,
            ],
            'socials' => $socials,
            'countries' => $countries,
            'cities' => $cities,
        ]);
    }

    public function edit()
    {
        return $this->show();
    }

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

        if (!empty($validated['website']) && !preg_match("~^(?:f|ht)tps?://~i", $validated['website'])) {
            $validated['website'] = 'https://' . $validated['website'];
        }

        if ($request->hasFile('logo')) {
            if ($company->logo && Storage::disk('public')->exists($company->logo)) {
                Storage::disk('public')->delete($company->logo);
            }
            $validated['logo'] = $request->file('logo')->store('companies/logos', 'public');
        }

        if ($request->hasFile('cover_image')) {
            if ($company->cover_image && Storage::disk('public')->exists($company->cover_image)) {
                Storage::disk('public')->delete($company->cover_image);
            }
            $validated['cover_image'] = $request->file('cover_image')->store('companies/covers', 'public');
        }

        if ($company->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . $company->id;
        }

        $company->update($validated);

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

    public function deleteLogo()
    {
        $company = Auth::user()->company;
        if ($company && $company->logo) {
            if (Storage::disk('public')->exists($company->logo)) {
                Storage::disk('public')->delete($company->logo);
            }
            $company->update(['logo' => null]);
        }

        return redirect()->back()->with('success', __('Company logo removed successfully.'));
    }

    public function deleteCover()
    {
        $company = Auth::user()->company;
        if ($company && $company->cover_image) {
            if (Storage::disk('public')->exists($company->cover_image)) {
                Storage::disk('public')->delete($company->cover_image);
            }
            $company->update(['cover_image' => null]);
        }

        return redirect()->back()->with('success', __('Company cover image removed successfully.'));
    }
}


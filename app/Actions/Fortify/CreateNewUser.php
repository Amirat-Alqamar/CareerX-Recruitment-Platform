<?php

namespace App\Actions\Fortify;

use App\Models\User;
use App\Models\Company;
use App\Models\JobSeekerProfile;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Illuminate\Support\Str;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     *
     * @throws ValidationException
     */
    public function create(array $input): User
    {
        $messages = [
            'name.required_if' => __('Please enter your full name.'),
            'company_name.required_if' => __('Please enter the company name.'),
            'email.required' => __('Please enter your email address.'),
            'email.email' => __('Please enter a valid email address.'),
            'email.unique' => __('The email address is already in use.'),
            'password.required' => __('Please enter a password.'),
            'password.confirmed' => __('Password confirmation does not match.'),
            'terms.accepted' => __('You must agree to the Terms of Service and Privacy Policy.'),
            'terms.required' => __('You must agree to the Terms of Service and Privacy Policy.'),
        ];

        $passwordRules = !empty($input['password_confirmation'])
            ? $this->passwordRules()
            : ['required', 'string', \Illuminate\Validation\Rules\Password::default()];

        Validator::make($input, [
            'name'         => ['required_if:role,job_seeker', 'nullable', 'string', 'max:255'],
            'company_name' => ['required_if:role,employer', 'nullable', 'string', 'max:255'],
            'email'        => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
            ],
            'password' => $passwordRules,
            'role'     => ['required', 'in:job_seeker,employer'],
            'phone'    => ['nullable', 'string', 'max:20'],
            'terms'    => ['accepted', 'required'],
        ], $messages)->validate();

        $companyId = null;
        $name = $input['name'] ?? $input['company_name'] ?? 'مستخدم';

        if (($input['role'] ?? '') === 'employer' && !empty($input['company_name'])) {
            $company = Company::create([
                'name' => $input['company_name'],
                'slug' => Str::slug($input['company_name']) . '-' . time(),
            ]);
            $companyId = $company->id;
            $name = $input['company_name'];
        }

        $user = User::create([
            'name'       => $name,
            'email'      => $input['email'],
            'password'   => Hash::make($input['password']),
            'role'       => $input['role'],
            'company_id' => $companyId,
            'phone'      => $input['phone'] ?? null,
            'status'     => true,
        ]);

        if ($user->isJobSeeker()) {
            JobSeekerProfile::firstOrCreate([
                'user_id' => $user->id,
            ]);
        }

        return $user;
    }
}



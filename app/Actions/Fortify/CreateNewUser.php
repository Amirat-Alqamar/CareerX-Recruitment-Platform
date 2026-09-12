<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;

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
            'password' => $this->passwordRules(),
            'role'     => ['required', 'in:job_seeker,employer'],
            'phone'    => ['nullable', 'string', 'max:20'],
        ])->validate();

        $companyId = null;
        $name = $input['name'] ?? $input['company_name'] ?? 'مستخدم';

        if (($input['role'] ?? '') === 'employer' && !empty($input['company_name'])) {
            $company = \App\Models\Company::create([
                'name' => $input['company_name'],
                'slug' => \Illuminate\Support\Str::slug($input['company_name']) . '-' . time(),
            ]);
            $companyId = $company->id;
            $name = $input['company_name'];
        }

        return User::create([
            'name'       => $name,
            'email'      => $input['email'],
            'password'   => Hash::make($input['password']),
            'role'       => $input['role'],
            'company_id' => $companyId,
            'phone'      => $input['phone'] ?? null,
            'status'     => true,
        ]);
    }
}


<?php

namespace Database\Seeders;

use App\Models\Company;
use App\Models\JobSeekerProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Sample Company & Employer User
        $company = Company::firstOrCreate(
            ['slug' => 'tech-solutions-ltd'],
            [
                'name' => 'Tech Solutions Ltd.',
                'company_size' => '51-200',
                'description' => 'Leading software development and IT consultancy company.',
                'website' => 'https://techsolutions.example.com',
                'status' => 'verified',
            ]
        );

        $employer = User::firstOrCreate(
            ['email' => 'employer@careerx.com'],
            [
                'name' => 'Tech Solutions Ltd.',
                'password' => Hash::make('password'),
                'role' => 'employer',
                'company_id' => $company->id,
                'status' => true,
            ]
        );

        // 2. Sample Job Seeker User
        $seeker = User::firstOrCreate(
            ['email' => 'seeker@careerx.com'],
            [
                'name' => 'Ahmad Al-Mansour',
                'password' => Hash::make('password'),
                'role' => 'job_seeker',
                'status' => true,
            ]
        );

        JobSeekerProfile::firstOrCreate(
            ['user_id' => $seeker->id],
            [
                'job_title' => 'Senior Full Stack Developer',
                'bio' => 'Experienced software engineer with 5+ years specializing in Laravel, React, and cloud architectures.',
                'years_of_experience' => 5,
            ]
        );
    }
}

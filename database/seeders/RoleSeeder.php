<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Melbedran\RolePermession\Models\Role;
use Melbedran\RolePermession\Models\RoleAbility;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $adminAbilities = [
            'admin.access',
            'users.manage',
            'roles.view',
            'roles.create',
            'roles.update',
            'roles.delete',
        ];
        foreach ($adminAbilities as $ability) {
            RoleAbility::firstOrCreate([
                'role_id' => $adminRole->id,
                'ability' => $ability,
                'type' => 'allow',
            ]);
        }

        $employerRole = Role::firstOrCreate(['name' => 'employer']);
        $employerAbilities = [
            'employer.access',
            'jobs.create',
            'jobs.update',
            'jobs.delete',
            'company.profile.edit',
            'applications.view',
            'applications.manage',
        ];
        foreach ($employerAbilities as $ability) {
            RoleAbility::firstOrCreate([
                'role_id' => $employerRole->id,
                'ability' => $ability,
                'type' => 'allow',
            ]);
        }

        $seekerRole = Role::firstOrCreate(['name' => 'job_seeker']);
        $seekerAbilities = [
            'jobs.apply',
            'jobs.save',
            'profile.edit',
        ];
        foreach ($seekerAbilities as $ability) {
            RoleAbility::firstOrCreate([
                'role_id' => $seekerRole->id,
                'ability' => $ability,
                'type' => 'allow',
            ]);
        }

        foreach (User::cursor() as $user) {
            if ($user->role === 'admin' && ! $user->roles()->where('name', 'admin')->exists()) {
                $user->roles()->syncWithoutDetaching([$adminRole->id]);
            } elseif ($user->role === 'employer' && ! $user->roles()->where('name', 'employer')->exists()) {
                $user->roles()->syncWithoutDetaching([$employerRole->id]);
            } elseif ($user->role === 'job_seeker' && ! $user->roles()->where('name', 'job_seeker')->exists()) {
                $user->roles()->syncWithoutDetaching([$seekerRole->id]);
            }
        }
    }
}

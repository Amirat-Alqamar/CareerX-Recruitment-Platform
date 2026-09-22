<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Melbedran\RolePermession\Concerns\HasRoles;

class User extends Authenticatable
{

    use HasFactory, Notifiable, TwoFactorAuthenticatable, HasRoles;

    protected $fillable = [
        'company_id',
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'cover_image',
        'bio',
        'role',
        'super_admin',
        'status',
        'ban_reason'
    ];

    public function company() { return $this->belongsTo(Company::class); }
    public function profile() { return $this->hasOne(JobSeekerProfile::class, 'user_id'); }
    public function savedJobs() { return $this->hasMany(SavedJob::class); }

    public function isEmployer(): bool
    {
        return $this->role === 'employer';
    }

    public function isJobSeeker(): bool
    {
        return $this->role === 'job_seeker';
    }

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isRolePermessionSuperAdmin(): bool
    {
        return (bool) $this->super_admin || $this->isAdmin();
    }

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'super_admin' => 'boolean',
        ];
    }

}


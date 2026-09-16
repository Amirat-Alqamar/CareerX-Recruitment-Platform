<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
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



    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }


}

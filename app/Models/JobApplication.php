<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
    protected $table = 'job_applications';

    protected $fillable = [
        'job_post_id',
        'profile_id',
        'resume_id',
        'cover_letter',
        'status',
    ];

    public function jobPost()
    {
        return $this->belongsTo(Job::class, 'job_post_id');
    }

    public function profile()
    {
        return $this->belongsTo(JobSeekerProfile::class, 'profile_id');
    }

    public function resume()
    {
        return $this->belongsTo(Resume::class, 'resume_id');
    }
}

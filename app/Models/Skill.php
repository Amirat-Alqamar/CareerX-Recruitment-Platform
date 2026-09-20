<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    protected $fillable = ['name'];

    public function profiles() {
        return $this->belongsToMany(JobSeekerProfile::class, 'profiles_skills', 'skill_id', 'profile_id');
    }

    public function jobs() {
        return $this->belongsToMany(Job::class, 'job_skill', 'skill_id', 'job_id');
    }
}


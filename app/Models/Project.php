<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = ['profile_id', 'name', 'description', 'url', 'github_url'];

    public function profile() { return $this->belongsTo(JobSeekerProfile::class, 'profile_id'); }
}


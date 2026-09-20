<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resume extends Model
{
    protected $fillable = ['profile_id', 'title', 'file_path'];

    public function profile() { return $this->belongsTo(JobSeekerProfile::class, 'profile_id'); }
}


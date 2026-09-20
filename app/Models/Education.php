<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    protected $fillable = ['profile_id', 'university', 'degree', 'gpa', 'start_year', 'end_year'];

    public function profile() { return $this->belongsTo(JobSeekerProfile::class, 'profile_id'); }
}


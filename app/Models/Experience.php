<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $fillable = ['profile_id', 'company_name', 'title', 'description', 'start_date', 'end_date'];

    public function profile() { return $this->belongsTo(JobSeekerProfile::class, 'profile_id'); }
}

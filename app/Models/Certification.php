<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    protected $fillable = ['profile_id', 'name', 'issuer', 'issue_date', 'credential_url'];

    public function profile() { return $this->belongsTo(JobSeekerProfile::class, 'profile_id'); }

}


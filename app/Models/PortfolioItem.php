<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioItem extends Model
{
    protected $fillable = ['profile_id', 'title', 'type', 'url', 'file_path'];

    public function profile() { return $this->belongsTo(JobSeekerProfile::class, 'profile_id'); }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $fillable = ['name'];

    public function profiles() {
        return $this->belongsToMany(JobSeekerProfile::class, 'profiles_languages', 'language_id', 'profile_id')->withPivot('level');
    }
}

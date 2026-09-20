<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JobSeekerProfile extends Model
{
    protected $fillable = [
        'user_id', 'country_id', 'city_id', 'job_title', 'bio', 'nationality',
        'address', 'marital_status', 'birth_date', 'years_of_experience',
        'work_type', 'gender_preference'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function skills() {
        return $this->belongsToMany(Skill::class, 'profiles_skills', 'profile_id', 'skill_id')->withPivot('level_id');
    }
    public function languages() {
        return $this->belongsToMany(Language::class, 'profiles_languages', 'profile_id', 'language_id')->withPivot('level');
    }

    public function experiences() {
        return $this->hasMany(Experience::class, 'profile_id');
    }

    public function educations() {
        return $this->hasMany(Education::class, 'profile_id');
    }

    public function resumes() {
        return $this->hasMany(Resume::class, 'profile_id');
    }

    public function applications() {
        return $this->hasMany(JobApplication::class, 'profile_id');
    }

    public function country() {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function city() {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function countries() {
        return $this->belongsTo(Country::class, 'country_id');
    }

    public function cities() {
        return $this->belongsTo(City::class, 'city_id');
    }

    public function certifications() {
        return $this->hasMany(Certification::class, 'profile_id');
    }

    public function portfolioItems(){
        return $this->hasMany(PortfolioItem::class, 'profile_id');
    }
}


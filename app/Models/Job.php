<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Job extends Model
{
    protected $fillable = [
        'company_id', 'created_by_user_id', 'category_id', 'title', 'slug',
        'description', 'responsibilities', 'requirements', 'salary_min',
        'salary_max', 'salary_type', 'job_type', 'work_type', 'experience_years',
        'country_id', 'city_id', 'is_active', 'status', 'views_count'
    ];

    public function company() { return $this->belongsTo(Company::class); }
    public function creator() { return $this->belongsTo(User::class, 'created_by_user_id'); }
    public function category() { return $this->belongsTo(JobCategory::class, 'category_id'); }
    public function country() { return $this->belongsTo(Country::class); }
    public function city() { return $this->belongsTo(City::class); }
    public function skills() {
        return $this->belongsToMany(Skill::class, 'job_skill');
    }
}

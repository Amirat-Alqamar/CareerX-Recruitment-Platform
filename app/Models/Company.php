<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    protected $fillable = [
        'name', 'country_id', 'city_id', 'slug', 'logo', 'cover_image',
        'description', 'company_size', 'founded_year', 'website', 'address', 'status'
    ];

    public function users() { return $this->hasMany(User::class); }
    public function socials() { return $this->hasMany(CompanySocial::class); }
    //public function jobs() { return $this->hasMany(Job::class); }
    public function country() { return $this->belongsTo(Country::class); }
    public function city() { return $this->belongsTo(City::class); }
}

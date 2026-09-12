<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Country;
use App\Models\City;
use App\Models\Skill;
use App\Models\Language;
use App\Models\JobCategory;
use App\Models\Company;
use App\Models\User;
use App\Models\Job;
use Illuminate\Support\Facades\Hash;

class InitialDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Countries and Cities (Clean English)
        $countriesWithCities = [
            'Syria' => [
                'Damascus', 'Rural Damascus', 'Aleppo', 'Homs', 'Latakia', 'Hama', 'Tartus',
                'Idlib', 'Daraa', 'As-Suwayda', 'Deir ez-Zor', 'Raqqa', 'Al-Hasakah', 'Quneitra'
            ],
            'Saudi Arabia' => [
                'Riyadh', 'Jeddah', 'Dammam', 'Mecca', 'Medina', 'Khobar', 'Dhahran', 'Tabuk'
            ],
            'United Arab Emirates' => [
                'Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Al Ain'
            ],
            'Egypt' => [
                'Cairo', 'Alexandria', 'Giza', 'Mansoura', 'Tanta', 'Port Said', 'Suez'
            ],
            'Jordan' => [
                'Amman', 'Zarqa', 'Irbid', 'Aqaba', 'Salt'
            ],
            'Lebanon' => [
                'Beirut', 'Tripoli', 'Sidon', 'Zahle'
            ],
            'Turkey' => [
                'Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Gaziantep', 'Konya'
            ],
            'Germany' => [
                'Berlin', 'Munich', 'Frankfurt', 'Hamburg', 'Cologne', 'Stuttgart'
            ],
            'United States' => [
                'New York', 'San Francisco', 'Austin', 'Seattle', 'Chicago', 'Los Angeles'
            ],
            'United Kingdom' => [
                'London', 'Manchester', 'Birmingham', 'Edinburgh'
            ],
        ];

        foreach ($countriesWithCities as $countryName => $cities) {
            $country = Country::firstOrCreate(['name' => $countryName]);
            foreach ($cities as $cityName) {
                City::firstOrCreate([
                    'country_id' => $country->id,
                    'name' => $cityName,
                ]);
            }
        }

        // 2. Common Professional Skills
        $commonSkills = [
            'PHP', 'Laravel', 'JavaScript', 'Vue.js', 'React.js',
            'Python', 'Django', 'Node.js', 'HTML5 & CSS3', 'Tailwind CSS',
            'Bootstrap', 'MySQL', 'PostgreSQL', 'Git & GitHub', 'RESTful API',
            'Docker', 'UI/UX Design', 'Figma', 'Adobe Photoshop',
            'Project Management', 'Agile / Scrum', 'Digital Marketing',
            'SEO', 'Content Writing', 'Accounting', 'Data Analysis'
        ];

        foreach ($commonSkills as $skillName) {
            Skill::firstOrCreate(['name' => $skillName]);
        }

        // 3. Languages
        $commonLanguages = [
            'English', 'Arabic', 'French', 'German', 'Spanish',
            'Turkish', 'Russian', 'Chinese', 'Italian'
        ];

        foreach ($commonLanguages as $langName) {
            Language::firstOrCreate(['name' => $langName]);
        }

        // 4. Job Categories
        $categories = [
            ['name' => 'Software & IT', 'slug' => 'software-and-it'],
            ['name' => 'Design & Creative', 'slug' => 'design-and-creative'],
            ['name' => 'Marketing & Sales', 'slug' => 'marketing-and-sales'],
            ['name' => 'Engineering & Technology', 'slug' => 'engineering-and-tech'],
            ['name' => 'Finance & Accounting', 'slug' => 'finance-and-accounting'],
            ['name' => 'Business & Project Management', 'slug' => 'business-and-project-management'],
            ['name' => 'Human Resources (HR)', 'slug' => 'human-resources'],
            ['name' => 'Customer Support', 'slug' => 'customer-support'],
            ['name' => 'Writing & Translation', 'slug' => 'writing-and-translation'],
            ['name' => 'Healthcare & Medical', 'slug' => 'healthcare-and-medical'],
        ];

        foreach ($categories as $catData) {
            JobCategory::firstOrCreate(
                ['slug' => $catData['slug']],
                ['name' => $catData['name']]
            );
        }
    }
}

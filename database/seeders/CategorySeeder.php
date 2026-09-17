<?php

namespace Database\Seeders;

use App\Models\JobCategory;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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

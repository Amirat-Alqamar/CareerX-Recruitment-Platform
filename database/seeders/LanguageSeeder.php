<?php

namespace Database\Seeders;

use App\Models\Language;
use Illuminate\Database\Seeder;

class LanguageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $commonLanguages = [
            'English', 'Arabic', 'French', 'German', 'Spanish',
            'Turkish', 'Russian', 'Chinese', 'Italian'
        ];

        foreach ($commonLanguages as $langName) {
            Language::firstOrCreate(['name' => $langName]);
        }
    }
}

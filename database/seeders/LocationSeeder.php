<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Country;
use Illuminate\Database\Seeder;

class LocationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
    }
}

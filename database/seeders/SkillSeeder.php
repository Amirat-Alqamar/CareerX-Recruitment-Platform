<?php

namespace Database\Seeders;

use App\Models\Skill;
use Illuminate\Database\Seeder;

class SkillSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
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
    }
}

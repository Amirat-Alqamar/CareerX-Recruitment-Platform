<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("UPDATE `job_applications` SET `status` = 'reviewed' WHERE `status` = 'shortlisted'");
        DB::statement("UPDATE `job_applications` SET `status` = 'accepted' WHERE `status` = 'hired'");

        DB::statement("ALTER TABLE `job_applications` MODIFY COLUMN `status` ENUM('applied', 'reviewed', 'accepted', 'rejected', 'interview', 'interview_success', 'interview_failed') DEFAULT 'applied'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `job_applications` MODIFY COLUMN `status` ENUM('applied', 'reviewed', 'shortlisted', 'interview', 'accepted', 'rejected', 'hired') DEFAULT 'applied'");
    }
};

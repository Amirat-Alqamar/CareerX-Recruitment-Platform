<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->unsignedTinyInteger('rating')->nullable()->after('cover_letter');
            $table->text('notes')->nullable()->after('rating');
        });

        // Expand status enum to include 'shortlisted' and 'hired'
        DB::statement("ALTER TABLE `job_applications` MODIFY COLUMN `status` ENUM('applied', 'reviewed', 'shortlisted', 'accepted', 'rejected', 'hired') DEFAULT 'applied'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE `job_applications` MODIFY COLUMN `status` ENUM('applied', 'reviewed', 'accepted', 'rejected') DEFAULT 'applied'");

        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn(['rating', 'notes']);
        });
    }
};

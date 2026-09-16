<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dateTime('interview_date')->nullable()->after('notes');
            $table->string('meeting_link')->nullable()->after('interview_date');
            $table->text('interview_notes')->nullable()->after('meeting_link');
        });

        \Illuminate\Support\Facades\DB::statement("ALTER TABLE `job_applications` MODIFY COLUMN `status` ENUM('applied', 'reviewed', 'shortlisted', 'interview', 'accepted', 'rejected', 'hired') DEFAULT 'applied'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('job_applications', function (Blueprint $table) {
            $table->dropColumn(['interview_date', 'meeting_link', 'interview_notes']);
        });

        \Illuminate\Support\Facades\DB::statement("ALTER TABLE `job_applications` MODIFY COLUMN `status` ENUM('applied', 'reviewed', 'shortlisted', 'accepted', 'rejected', 'hired') DEFAULT 'applied'");
    }
};

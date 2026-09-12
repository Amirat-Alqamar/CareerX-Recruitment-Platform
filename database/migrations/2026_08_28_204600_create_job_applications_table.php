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
        Schema::create('job_applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('job_post_id')->constrained('job_posts')->cascadeOnDelete();
            $table->foreignId('profile_id')->constrained('job_seeker_profiles')->cascadeOnDelete();
            $table->foreignId('resume_id')->nullable()->constrained('resumes')->nullOnDelete();
            $table->text('cover_letter')->nullable();
            $table->enum('status', ['applied', 'reviewed', 'accepted', 'rejected'])->default('applied');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('job_applications');
    }
};

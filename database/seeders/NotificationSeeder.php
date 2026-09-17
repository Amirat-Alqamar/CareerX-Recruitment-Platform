<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Job;
use App\Models\JobApplication;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('role', 'admin')->first();
        $employer = User::where('role', 'employer')->first();
        $seeker = User::where('role', 'job_seeker')->first();

        // 1. Seed notifications for Admin
        if ($admin) {
            $admin->notifications()->delete();

            $admin->notifications()->create([
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'type' => 'App\Notifications\JobPendingApprovalNotification',
                'data' => [
                    'type'        => 'job_pending_approval',
                    'title'       => 'New Job Pending Approval',
                    'title_ar'    => 'طلب نشر وظيفة جديد بانتظار الموافقة',
                    'message'     => "Company 'Tech Solutions Ltd.' submitted 'Senior Full Stack Developer' for approval.",
                    'message_ar'  => "قامت شركة 'Tech Solutions Ltd.' بتقديم وظيفة 'Senior Full Stack Developer' بانتظار الموافقة على النشر.",
                    'link'        => "/admin/pending-jobs",
                ],
                'read_at' => null,
                'created_at' => now()->subMinutes(10),
                'updated_at' => now()->subMinutes(10),
            ]);

            $admin->notifications()->create([
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'type' => 'App\Notifications\SystemNotification',
                'data' => [
                    'type'        => 'admin_reports',
                    'title'       => 'Platform Analytics Updated',
                    'title_ar'    => 'تم تحديث تقارير وإحصائيات المنصة',
                    'message'     => 'Real-time job demand, hiring rate, and top in-demand skills metrics are available in the reports center.',
                    'message_ar'  => 'أصبحت إحصائيات سوق العمل، معدلات التوظيف، والمهارات الأكثر طلباً متوفرة في قسم التقارير.',
                    'link'        => "/admin/reports",
                ],
                'read_at' => null,
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ]);
        }

        // 2. Seed notifications for Employer
        if ($employer) {
            $employer->notifications()->delete();

            $employer->notifications()->create([
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'type' => 'App\Notifications\JobModerationStatusNotification',
                'data' => [
                    'type'        => 'job_approved',
                    'title'       => 'Job Approved & Published',
                    'title_ar'    => 'تمت الموافقة على نشر الوظيفة',
                    'message'     => 'Your job opening has been approved and is now live for applicants.',
                    'message_ar'  => 'تمت الموافقة على إعلان وظيفتك وهو الآن منشور ومتاح للمتقدمين.',
                    'link'        => "/employer/jobs",
                ],
                'read_at' => null,
                'created_at' => now()->subHours(2),
                'updated_at' => now()->subHours(2),
            ]);
        }

        // 3. Seed notifications for Seeker
        if ($seeker) {
            $seeker->notifications()->delete();

            $seeker->notifications()->create([
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'type' => 'App\Notifications\ApplicationStatusChangedNotification',
                'data' => [
                    'type'        => 'interview_scheduled',
                    'title'       => 'Interview Scheduled!',
                    'title_ar'    => 'تمت جدولة موعد مقابلة عمل!',
                    'message'     => 'Tech Solutions Ltd. scheduled a Google Meet technical interview.',
                    'message_ar'  => 'حددت شركة Tech Solutions Ltd. موعد مقابلة تقنية عبر Google Meet.',
                    'link'        => "/job-seeker/applications",
                ],
                'read_at' => null,
                'created_at' => now()->subMinutes(15),
                'updated_at' => now()->subMinutes(15),
            ]);
        }
    }
}

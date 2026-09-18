<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class ApplicationStatusChangedNotification extends Notification
{
    use Queueable;

    public function __construct(public JobApplication $application, public string $actionType)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $jobTitle = $this->application->jobPost?->title ?? 'your application';
        $companyName = $this->application->jobPost?->company?->name ?? 'the employer';

        if ($this->actionType === 'applied' || $this->application->status === 'applied' || $this->application->status === 'pending') {
            return [
                'type'           => 'application_received',
                'application_id' => $this->application->id,
                'title'          => 'Application Received',
                'title_ar'       => 'تم استلام طلب التوظيف',
                'message'        => 'Your application for :job at :company has been received and is pending review.',
                'message_ar'     => "تم استلام طلبك للتقديم على وظيفة {$jobTitle} لدى شركة {$companyName} وهو قيد المراجعة.",
                'params'         => ['job' => $jobTitle, 'company' => $companyName],
                'link'           => '/job-seeker/applications',
            ];
        }

        if ($this->actionType === 'interview_rescheduled') {
            $dateStr = $this->application->interview_date ? $this->application->interview_date->format('Y-m-d h:i A') : '';
            return [
                'type'           => 'interview_scheduled',
                'application_id' => $this->application->id,
                'title'          => 'Interview Rescheduled! 📅',
                'title_ar'       => 'تمت إعادة جدولة المقابلة! 📅',
                'message'        => $dateStr
                    ? 'Note: :company has updated your interview schedule to :date.'
                    : 'Note: :company has updated your interview schedule for :job.',
                'message_ar'     => $dateStr
                    ? "تنبيه: قامت شركة {$companyName} بتحديث موعد المقابلة الوظيفية إلى {$dateStr}."
                    : "تنبيه: قامت شركة {$companyName} بتحديث موعد المقابلة الوظيفية لوظيفة {$jobTitle}.",
                'params'         => ['company' => $companyName, 'job' => $jobTitle, 'date' => $dateStr],
                'link'           => '/job-seeker/applications',
            ];
        }

        if ($this->actionType === 'interview' || $this->application->status === 'interview') {
            $dateStr = $this->application->interview_date ? $this->application->interview_date->format('Y-m-d h:i A') : '';
            return [
                'type'           => 'interview_scheduled',
                'application_id' => $this->application->id,
                'title'          => 'Interview Scheduled! 📅',
                'title_ar'       => 'تم تحديد موعد مقابلة وظيفية 📅',
                'message'        => $dateStr
                    ? 'Congratulations! :company invited you for an interview on :date.'
                    : 'Congratulations! :company invited you for an interview for :job.',
                'message_ar'     => $dateStr
                    ? "تهانينا! قامت شركة {$companyName} بدعوتك لإجراء مقابلة وظيفية في {$dateStr}."
                    : "تهانينا! قامت شركة {$companyName} بدعوتك لإجراء مقابلة وظيفية لوظيفة {$jobTitle}.",
                'params'         => ['company' => $companyName, 'job' => $jobTitle, 'date' => $dateStr],
                'link'           => '/job-seeker/applications',
            ];
        }

        if ($this->application->status === 'reviewed' || $this->actionType === 'reviewed') {
            return [
                'type'           => 'application_reviewed',
                'application_id' => $this->application->id,
                'title'          => 'Application Reviewed',
                'title_ar'       => 'تمت مراجعة طلب التوظيف',
                'message'        => 'Company :company has reviewed your profile and resume for :job.',
                'message_ar'     => "قامت شركة {$companyName} بمراجعة ملفك الشخصي وسيرتك الذاتية لوظيفة {$jobTitle}.",
                'params'         => ['company' => $companyName, 'job' => $jobTitle],
                'link'           => '/job-seeker/applications',
            ];
        }

        if ($this->application->status === 'interview_success' || in_array($this->application->status, ['accepted', 'hired'])) {
            return [
                'type'           => 'application_accepted',
                'application_id' => $this->application->id,
                'title'          => 'Interview Passed & Application Accepted! 🎉',
                'title_ar'       => 'تم اجتياز المقابلة وقبول طلبك! 🎉',
                'message'        => 'Congratulations! :company has approved your interview and accepted your application for :job.',
                'message_ar'     => "تهانينا! قامت شركة {$companyName} بالموافقة على مقابلتك وقبول طلبك لوظيفة {$jobTitle}.",
                'params'         => ['company' => $companyName, 'job' => $jobTitle],
                'link'           => '/job-seeker/applications',
            ];
        }

        if ($this->application->status === 'interview_failed') {
            return [
                'type'           => 'application_rejected',
                'application_id' => $this->application->id,
                'title'          => 'Interview Result Update',
                'title_ar'       => 'تحديث نتيجة المقابلة',
                'message'        => 'Thank you for attending the interview. :company has decided not to proceed further for :job.',
                'message_ar'     => "شكراً لحضورك المقابلة. قررت شركة {$companyName} عدم المتابعة في هذا الوقت لوظيفة {$jobTitle}.",
                'params'         => ['company' => $companyName, 'job' => $jobTitle],
                'link'           => '/job-seeker/applications',
            ];
        }

        if ($this->application->status === 'rejected') {
            return [
                'type'           => 'application_rejected',
                'application_id' => $this->application->id,
                'title'          => 'Application Update',
                'title_ar'       => 'تحديث بشأن طلب التوظيف',
                'message'        => 'Thank you for your interest. :company has decided not to move forward with your application for :job.',
                'message_ar'     => "شكراً لاهتمامك. قررت شركة {$companyName} عدم المتابعة في طلب توظيفك لوظيفة {$jobTitle}.",
                'params'         => ['company' => $companyName, 'job' => $jobTitle],
                'link'           => '/job-seeker/applications',
            ];
        }

        if ($this->application->status === 'shortlisted') {
            return [
                'type'           => 'application_shortlisted',
                'application_id' => $this->application->id,
                'title'          => 'Application Shortlisted! ⭐',
                'message'        => 'Good news! Your application for :job at :company has been shortlisted.',
                'params'         => ['company' => $companyName, 'job' => $jobTitle],
                'link'           => '/job-seeker/applications',
            ];
        }

        // Generic fallback
        return [
            'type'           => 'application_status_update',
            'application_id' => $this->application->id,
            'title'          => 'Application Status Updated',
            'message'        => 'Your application for :job at :company status was updated.',
            'params'         => ['job' => $jobTitle, 'company' => $companyName],
            'link'           => '/job-seeker/applications',
        ];
    }
}

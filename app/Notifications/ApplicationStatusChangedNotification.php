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

        if ($this->actionType === 'interview') {
            return [
                'type'           => 'interview_scheduled',
                'application_id' => $this->application->id,
                'title'          => 'Interview Scheduled!',
                'title_ar'       => 'تمت جدولة مقابلة عمل!',
                'message'        => "{$companyName} scheduled an interview for '{$jobTitle}'.",
                'message_ar'     => "حددت شركة {$companyName} موعد مقابلة عمل لوظيفة '{$jobTitle}'.",
                'link'           => "/job-seeker/applications",
            ];
        }

        $status = $this->application->status;
        $statusLabels = [
            'reviewed'    => ['en' => 'Under Review', 'ar' => 'قيد المراجعة'],
            'shortlisted' => ['en' => 'Shortlisted', 'ar' => 'ضمن القائمة المختصرة'],
            'accepted'    => ['en' => 'Accepted', 'ar' => 'تم القبول'],
            'rejected'    => ['en' => 'Not Selected', 'ar' => 'لم يتم الاختيار'],
            'hired'       => ['en' => 'Hired', 'ar' => 'تم التوظيف بنجاح'],
        ];

        $enLabel = $statusLabels[$status]['en'] ?? ucfirst($status);
        $arLabel = $statusLabels[$status]['ar'] ?? $status;

        return [
            'type'           => 'application_status_update',
            'application_id' => $this->application->id,
            'title'          => "Application Status: {$enLabel}",
            'title_ar'       => "تحديث طلب التوظيف: {$arLabel}",
            'message'        => "Your application for '{$jobTitle}' at {$companyName} is now {$enLabel}.",
            'message_ar'     => "تم تحديث حالة طلبك لوظيفة '{$jobTitle}' لدى شركة {$companyName} إلى: {$arLabel}.",
            'link'           => "/job-seeker/applications",
        ];
    }
}

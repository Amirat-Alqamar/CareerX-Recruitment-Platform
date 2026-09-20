<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class NewJobApplicationNotification extends Notification
{
    use Queueable;

    public function __construct(public JobApplication $application)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $applicantName = $this->application->profile?->user?->name ?? 'A candidate';
        $jobTitle = $this->application->jobPost?->title ?? 'your job opening';

        return [
            'type'           => 'new_application',
            'application_id' => $this->application->id,
            'title'          => 'New Application Received',
            'title_ar'       => 'طلب توظيف جديد',
            'message'        => "{$applicantName} applied for {$jobTitle}.",
            'message_ar'     => "تقدم {$applicantName} بطلب توظيف للوظيفة '{$jobTitle}'.",
            'link'           => "/employer/applicants/{$this->application->id}",
        ];
    }
}


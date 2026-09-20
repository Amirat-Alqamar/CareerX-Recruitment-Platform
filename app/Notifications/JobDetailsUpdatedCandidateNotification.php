<?php

namespace App\Notifications;

use App\Models\Job;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class JobDetailsUpdatedCandidateNotification extends Notification
{
    use Queueable;

    public function __construct(public Job $job)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $companyName = $this->job->company?->name ?? 'Company';
        $jobTitle = $this->job->title;

        return [
            'type'        => 'job_updated',
            'job_id'      => $this->job->id,
            'title'       => 'Job Posting Updated',
            'title_ar'    => 'تحديث في إعلان الوظيفة',
            'message'     => "Company '{$companyName}' updated details for '{$jobTitle}', which you applied for.",
            'message_ar'  => "قامت شركة '{$companyName}' بتحديث بعض تفاصيل وظيفة '{$jobTitle}' التي تقدمت إليها.",
            'link'        => '/job-seeker/applications',
        ];
    }
}


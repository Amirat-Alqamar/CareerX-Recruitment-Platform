<?php

namespace App\Notifications;

use App\Models\Job;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class JobModerationStatusNotification extends Notification
{
    use Queueable;

    public function __construct(public Job $job, public string $statusAction)
    {
    }

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        $isApproved = $this->statusAction === 'approved';

        return [
            'type'       => $isApproved ? 'job_approved' : 'job_rejected',
            'job_id'     => $this->job->id,
            'title'      => $isApproved ? 'Job Approved & Published' : 'Job Post Not Approved',
            'title_ar'   => $isApproved ? 'تمت الموافقة على نشر الوظيفة' : 'تم رفض نشر الوظيفة',
            'message'    => $isApproved
                ? "Your job opening '{$this->job->title}' has been approved and is now live."
                : "Your job opening '{$this->job->title}' was rejected by platform administration.",
            'message_ar' => $isApproved
                ? "تمت الموافقة على إعلان الوظيفة '{$this->job->title}' وأصبح معروضاً للباحثين عن عمل."
                : "تم رفض إعلان الوظيفة '{$this->job->title}' من قبل إدارة المنصة.",
            'link'       => "/employer/jobs",
        ];
    }
}

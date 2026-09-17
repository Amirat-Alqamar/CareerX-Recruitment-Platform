<?php

namespace App\Notifications;

use App\Models\Job;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class JobPendingApprovalNotification extends Notification
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
        return [
            'type'        => 'job_pending_approval',
            'job_id'      => $this->job->id,
            'title'       => 'New Job Pending Approval',
            'title_ar'    => 'طلب نشر وظيفة جديد بانتظار الموافقة',
            'message'     => "Company '{$this->job->company?->name}' submitted '{$this->job->title}' for approval.",
            'message_ar'  => "قامت شركة '{$this->job->company?->name}' بتقديم وظيفة '{$this->job->title}' بانتظار الموافقة على النشر.",
            'link'        => "/admin/pending-jobs",
        ];
    }
}

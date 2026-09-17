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
            'type'    => $isApproved ? 'job_approved' : 'job_rejected',
            'job_id'  => $this->job->id,
            'title'   => $isApproved ? 'Job Approved & Published' : 'Job Post Not Approved',
            'message' => $isApproved
                ? 'Your job opening :job has been approved and is now live.'
                : 'Your job opening :job was rejected by platform administration.',
            'params'  => ['job' => "'{$this->job->title}'"],
            'link'    => '/employer/jobs',
        ];
    }
}

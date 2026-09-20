<?php

namespace App\Notifications;

use App\Models\Job;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class JobPendingApprovalNotification extends Notification
{
    use Queueable;

    public function __construct(public Job $job, public bool $isUpdate = false)
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

        if ($this->isUpdate) {
            return [
                'type'        => 'job_updated',
                'job_id'      => $this->job->id,
                'title'       => 'Job Posting Updated',
                'title_ar'    => 'تم تحديث إعلان وظيفي',
                'message'     => "Company '{$companyName}' updated details for job '{$jobTitle}'.",
                'message_ar'  => "قامت شركة '{$companyName}' بتحديث بيانات الإعلان الوظيفي '{$jobTitle}'.",
                'link'        => "/admin/jobs",
            ];
        }

        return [
            'type'        => 'job_pending_approval',
            'job_id'      => $this->job->id,
            'title'       => 'New Job Pending Approval',
            'title_ar'    => 'طلب نشر وظيفة جديد بانتظار الموافقة',
            'message'     => "Company '{$companyName}' submitted '{$jobTitle}' for approval.",
            'message_ar'  => "قامت شركة '{$companyName}' بتقديم وظيفة '{$jobTitle}' بانتظار الموافقة على النشر.",
            'link'        => "/admin/pending-jobs",
        ];
    }
}


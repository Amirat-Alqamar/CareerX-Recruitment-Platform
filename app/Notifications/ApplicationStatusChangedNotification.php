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
                'message'        => 'Your application for :job at :company has been received and is pending review.',
                'params'         => ['job' => $jobTitle, 'company' => $companyName],
                'link'           => '/job-seeker/applications',
            ];
        }

        if ($this->actionType === 'interview' || $this->application->status === 'interview') {
            $dateStr = $this->application->interview_date ? $this->application->interview_date->format('Y-m-d h:i A') : '';
            return [
                'type'           => 'interview_scheduled',
                'application_id' => $this->application->id,
                'title'          => 'Interview Scheduled! 📅',
                'message'        => $dateStr
                    ? 'Congratulations! :company invited you for an interview on :date.'
                    : 'Congratulations! :company invited you for an interview for :job.',
                'params'         => ['company' => $companyName, 'job' => $jobTitle, 'date' => $dateStr],
                'link'           => '/job-seeker/applications',
            ];
        }

        if ($this->application->status === 'reviewed' || $this->actionType === 'reviewed') {
            return [
                'type'           => 'application_reviewed',
                'application_id' => $this->application->id,
                'title'          => 'Application Reviewed',
                'message'        => 'Company :company has reviewed your profile and resume for :job.',
                'params'         => ['company' => $companyName, 'job' => $jobTitle],
                'link'           => '/job-seeker/applications',
            ];
        }

        if (in_array($this->application->status, ['accepted', 'hired'])) {
            return [
                'type'           => 'application_accepted',
                'application_id' => $this->application->id,
                'title'          => 'Application Accepted! 🎉',
                'message'        => 'Congratulations! :company has accepted your application for :job.',
                'params'         => ['company' => $companyName, 'job' => $jobTitle],
                'link'           => '/job-seeker/applications',
            ];
        }

        if ($this->application->status === 'rejected') {
            return [
                'type'           => 'application_rejected',
                'application_id' => $this->application->id,
                'title'          => 'Application Update',
                'message'        => 'Thank you for your interest. :company has decided not to move forward with your application for :job.',
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

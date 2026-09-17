<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Display a paginated listing of notifications with full details.
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $locale = app()->getLocale();

        $notifications = $user ? $user->notifications()->latest()->paginate(10)->through(function ($n) use ($locale) {
            $data = $n->data;
            $title = ($locale === 'ar' && !empty($data['title_ar'])) ? $data['title_ar'] : ($data['title'] ?? 'Notification');
            $message = ($locale === 'ar' && !empty($data['message_ar'])) ? $data['message_ar'] : ($data['message'] ?? '');
            $link = !empty($data['link']) ? "/{$locale}" . ltrim($data['link'], '/') : null;

            return [
                'id'         => $n->id,
                'type'       => $data['type'] ?? 'info',
                'title'      => $title,
                'message'    => $message,
                'link'       => $link,
                'read_at'    => $n->read_at,
                'is_read'    => !is_null($n->read_at),
                'created_at' => $n->created_at ? $n->created_at->format('Y-m-d H:i') : '',
                'time_ago'   => $n->created_at ? $n->created_at->diffForHumans() : '',
                'data'       => $data,
            ];
        }) : collect();

        $unreadCount = $user ? $user->unreadNotifications()->count() : 0;
        $totalCount = $user ? $user->notifications()->count() : 0;

        return \Inertia\Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'unreadCount'   => $unreadCount,
            'totalCount'    => $totalCount,
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, string $id)
    {
        $user = Auth::user();
        if ($user) {
            $notification = $user->notifications()->where('id', $id)->first();
            if ($notification) {
                $notification->markAsRead();
            }
        }

        return redirect()->back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->unreadNotifications->markAsRead();
        }

        return redirect()->back()->with('success', __('All notifications marked as read.'));
    }

    /**
     * Clear all notifications for the current user.
     */
    public function clearAll(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->notifications()->delete();
        }

        return redirect()->back()->with('success', __('All notifications have been cleared.'));
    }
}

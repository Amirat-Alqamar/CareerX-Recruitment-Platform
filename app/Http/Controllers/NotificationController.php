<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{

    public function index(Request $request)
    {
        $user = Auth::user();
        $locale = app()->getLocale();

        $notifications = $user ? $user->notifications()->latest()->paginate(10)->through(function ($n) use ($locale) {
            $data = $n->data;
            $params = $data['params'] ?? [];
            $rawTitle = $data['title'] ?? 'Notification';
            $rawMessage = $data['message'] ?? '';

            $title = __($rawTitle, $params);
            $message = __($rawMessage, $params);

            if ($locale === 'ar' && !empty($data['title_ar']) && $title === $rawTitle) {
                $title = $data['title_ar'];
            }
            if ($locale === 'ar' && !empty($data['message_ar']) && $message === $rawMessage) {
                $message = $data['message_ar'];
            }

            $rawLink = !empty($data['link']) ? '/' . ltrim($data['link'], '/') : null;
            $link = $rawLink ? "/{$locale}" . $rawLink : null;

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

    public function markAsRead(Request $request, string $id)
    {
        $user = Auth::user();
        if ($user) {
            $notification = $user->notifications()->where('id', $id)->first();
            if ($notification) {
                $notification->markAsRead();
            }
        }

        if (!$request->header('X-Inertia') && ($request->expectsJson() || $request->wantsJson())) {
            return response()->json(['success' => true]);
        }

        return redirect()->back();
    }

    public function markAllAsRead(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->unreadNotifications->markAsRead();
        }

        return redirect()->back()->with('success', __('All notifications marked as read.'));
    }

    public function clearAll(Request $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->notifications()->delete();
        }

        return redirect()->back()->with('success', __('All notifications have been cleared.'));
    }
}


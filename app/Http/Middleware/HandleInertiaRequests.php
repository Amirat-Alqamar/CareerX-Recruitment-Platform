<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

use Mcamara\LaravelLocalization\Facades\LaravelLocalization;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $locale = app()->getLocale();
        $direction = class_exists(LaravelLocalization::class)
            ? LaravelLocalization::getCurrentLocaleDirection()
            : ($locale === 'ar' ? 'rtl' : 'ltr');

        // Modular Auto-Merge: Load all domain translation files from lang/{locale}/*.json
        $translations = [];
        $localeDir = base_path("lang/{$locale}");
        if (is_dir($localeDir)) {
            $files = glob("{$localeDir}/*.json") ?: [];
            usort($files, function ($a, $b) {
                if (str_contains($a, 'common.json')) return -1;
                if (str_contains($b, 'common.json')) return 1;
                return strcmp($a, $b);
            });

            foreach ($files as $file) {
                $content = @file_get_contents($file);
                if ($content) {
                    $decoded = json_decode($content, true);
                    if (is_array($decoded)) {
                        $translations = array_merge($translations, $decoded);
                    }
                }
            }
        }

        // Also merge root or compiled locale file if it exists
        $translationsPath = base_path("lang/{$locale}.json");
        if (file_exists($translationsPath)) {
            $rootContent = @file_get_contents($translationsPath);
            if ($rootContent) {
                $rootTranslations = json_decode($rootContent, true);
                if (is_array($rootTranslations)) {
                    $translations = array_merge($translations, $rootTranslations);
                }
            }
        }

        $locales = [];
        if (class_exists(LaravelLocalization::class)) {
            foreach (LaravelLocalization::getSupportedLocales() as $code => $properties) {
                $locales[] = [
                    'code' => $code,
                    'name' => $properties['name'] ?? $code,
                    'native' => $properties['native'] ?? $code,
                    'url' => LaravelLocalization::getLocalizedURL($code, null, [], true),
                ];
            }
        }

        $user = $request->user();
        $userData = null;
        $notifications = [];
        $unreadCount = 0;

        if ($user) {
            $userData = [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'headline' => $user->profile?->job_title,
                'company' => $user->company ? [
                    'id' => $user->company->id,
                    'name' => $user->company->name,
                    'logo' => $user->company->logo ? asset('storage/' . $user->company->logo) : null,
                ] : null,
                'avatar' => $user->avatar ? (str_starts_with($user->avatar, 'http') ? $user->avatar : asset('storage/' . $user->avatar)) : null,
                'cover_image' => $user->cover_image ? (str_starts_with($user->cover_image, 'http') ? $user->cover_image : asset('storage/' . $user->cover_image)) : null,
                'two_factor_enabled' => !is_null($user->two_factor_secret),
                'two_factor_confirmed' => !is_null($user->two_factor_confirmed_at),
            ];

            $notifications = $user->notifications()->take(15)->get()->map(function ($n) use ($locale, $translations) {
                $data = $n->data;
                $params = $data['params'] ?? [];
                $rawTitle = $data['title'] ?? 'Notification';
                $rawMessage = $data['message'] ?? '';

                $title = $translations[$rawTitle] ?? __($rawTitle, $params);
                $message = $translations[$rawMessage] ?? __($rawMessage, $params);

                if ($locale === 'ar' && !empty($data['title_ar']) && $title === $rawTitle) {
                    $title = $data['title_ar'];
                }
                if ($locale === 'ar' && !empty($data['message_ar']) && $message === $rawMessage) {
                    $message = $data['message_ar'];
                }

                $rawLink = !empty($data['link']) ? '/' . ltrim($data['link'], '/') : null;
                $link = $rawLink ? "/{$locale}" . $rawLink : null;

                return [
                    'id'      => $n->id,
                    'type'    => $data['type'] ?? 'info',
                    'title'   => $title,
                    'message' => $message,
                    'link'    => $link,
                    'unread'  => is_null($n->read_at),
                    'time'    => $n->created_at ? $n->created_at->diffForHumans() : '',
                ];
            })->toArray();

            $unreadCount = $user->unreadNotifications()->count();
        }

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $userData,
                'notifications' => $notifications,
                'unread_notifications_count' => $unreadCount,
            ],
            'flash' => [
                'success' => function () use ($request, $translations) {
                    $msg = $request->session()->get('success');
                    return ($msg && isset($translations[$msg])) ? $translations[$msg] : $msg;
                },
                'error' => function () use ($request, $translations) {
                    $msg = $request->session()->get('error');
                    return ($msg && isset($translations[$msg])) ? $translations[$msg] : $msg;
                },
            ],
            'locale' => $locale,
            'direction' => $direction,
            'translations' => $translations,
            'locales' => $locales,
        ];
    }
}


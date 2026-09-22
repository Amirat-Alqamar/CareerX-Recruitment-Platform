<!DOCTYPE html>
<html lang="{{ app()->getLocale() }}" dir="{{ app()->getLocale() === 'ar' ? 'rtl' : 'ltr' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Roles & Permissions') — {{ config('app.name', 'CareerX') }}</title>

    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/images/careerX-favicon.png">
    <link rel="shortcut icon" href="/favicon.ico">

    <!-- Fonts: Inter & Cairo -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    @vite(['resources/css/app.css'])

    <style>
        body {
            font-family: {{ app()->getLocale() === 'ar' ? "'Cairo', 'Inter', sans-serif" : "'Inter', 'Cairo', sans-serif" }};
        }
    </style>
</head>
<body class="bg-[#F8FAFC] text-slate-800 antialiased min-h-screen">
    @php
        $user = Auth::user();
        $namePrefix = config('role-permession.ui.route_name_prefix', 'role-permession.');
        $isRtl = app()->getLocale() === 'ar';
    @endphp

    <div class="flex h-screen overflow-hidden">
        <!-- CareerX Admin Sidebar -->
        <aside class="w-64 bg-white border-r rtl:border-r-0 rtl:border-l border-slate-100 flex flex-col justify-between h-screen shrink-0 shadow-xs z-30 select-none">
            <div class="overflow-y-auto flex-1 p-4 [scrollbar-width:none]">
                <!-- Logo -->
                <div class="pb-4 border-b border-slate-100 flex items-center justify-between">
                    <a href="/{{ app()->getLocale() }}" class="flex items-center gap-2">
                        <img src="/images/careerX-logo.webp" alt="CareerX" class="h-8 w-auto object-contain">
                    </a>
                </div>

                <!-- Admin Profile Card -->
                <div class="my-4 p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-[#014D55] text-white flex items-center justify-center font-bold text-sm shrink-0">
                        {{ strtoupper(substr($user->name ?? 'A', 0, 1)) }}
                    </div>
                    <div class="min-w-0 flex-1">
                        <h4 class="text-xs font-bold text-slate-800 truncate">{{ $user->name ?? 'Administrator' }}</h4>
                        <p class="text-[10px] text-slate-500 truncate">{{ $user->email ?? 'admin@careerx.com' }}</p>
                        <span class="inline-block mt-0.5 px-2 py-0.5 bg-[#E6F8F6] text-[#008A7B] text-[9px] font-bold rounded-full">
                            {{ $isRtl ? 'مسؤول النظام' : 'Administrator' }}
                        </span>
                    </div>
                </div>

                <!-- Navigation Groups -->
                <nav class="space-y-6">
                    <!-- Group 1: ADMIN CONTROL -->
                    <div class="space-y-1.5">
                        <h5 class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3">
                            {{ $isRtl ? 'لوحة تحكم المسؤول' : 'ADMIN CONTROL' }}
                        </h5>
                        <div class="space-y-1">
                            <a href="/admin/dashboard" class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                                <span>{{ $isRtl ? 'الرئيسية' : 'Dashboard' }}</span>
                            </a>
                            <a href="/admin/pending-jobs" class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <span>{{ $isRtl ? 'الوظائف المعلقة' : 'Pending Approvals' }}</span>
                            </a>
                            <a href="/notifications" class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>
                                <span>{{ $isRtl ? 'الإشعارات' : 'Notifications' }}</span>
                            </a>
                            <a href="/2fa" class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 12 2 2 4-4"/><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <span>{{ $isRtl ? 'المصادقة الثنائية' : 'Two-Factor Auth' }}</span>
                            </a>
                        </div>
                    </div>

                    <!-- Group 2: PLATFORM MANAGEMENT -->
                    <div class="space-y-1.5">
                        <h5 class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3">
                            {{ $isRtl ? 'إدارة المنصة' : 'PLATFORM MANAGEMENT' }}
                        </h5>
                        <div class="space-y-1">
                            <a href="/admin/users" class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                                <span>{{ $isRtl ? 'إدارة المستخدمين' : 'Manage Users' }}</span>
                            </a>
                            <a href="/admin/jobs" class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                                <span>{{ $isRtl ? 'إدارة الوظائف' : 'Manage Jobs' }}</span>
                            </a>
                            <!-- ACTIVE ITEM: Roles & Permissions -->
                            <a href="{{ route($namePrefix.'roles.index') }}" class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm bg-[#E6F8F6] text-[#008A7B] transition-colors">
                                <svg class="w-4 h-4 text-[#008A7B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                                <span class="font-bold">{{ $isRtl ? 'الأدوار والصلاحيات' : 'Roles & Permissions' }}</span>
                            </a>
                        </div>
                    </div>

                    <!-- Group 3: ANALYTICS & REPORTS -->
                    <div class="space-y-1.5">
                        <h5 class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3">
                            {{ $isRtl ? 'التقارير والإحصائيات' : 'ANALYTICS & REPORTS' }}
                        </h5>
                        <div class="space-y-1">
                            <a href="/admin/reports" class="flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                                <svg class="w-4 h-4 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
                                <span>{{ $isRtl ? 'التقارير والإحصائيات' : 'Reports & Statistics' }}</span>
                            </a>
                        </div>
                    </div>
                </nav>
            </div>

            <!-- Bottom Back Link -->
            <div class="p-4 border-t border-slate-100">
                <a href="/admin/dashboard" class="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all">
                    <span>{{ $isRtl ? '← الرجوع للوحة التحكم' : '← Back to Dashboard' }}</span>
                </a>
            </div>
        </aside>

        <!-- Main Content Wrapper -->
        <div class="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
            <!-- Top Navbar / Header matching CareerX -->
            <header class="h-16 bg-white border-b border-slate-100 px-6 flex items-center justify-between shrink-0 z-20">
                <!-- Breadcrumbs & Quick Back -->
                <div class="flex items-center gap-3">
                    <a href="/admin/dashboard" class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors">
                        <span>{{ $isRtl ? '← الرجوع للوحة التحكم' : '← Back to Dashboard' }}</span>
                    </a>
                    <span class="text-slate-300">/</span>
                    <span class="text-xs font-semibold text-slate-500">{{ $isRtl ? 'لوحة المسؤول' : 'Admin' }}</span>
                    <span class="text-slate-300">/</span>
                    <span class="text-xs font-bold text-slate-800">{{ $isRtl ? 'الأدوار والصلاحيات' : 'Roles & Permissions' }}</span>
                </div>

                <!-- Sub-nav Tabs (Roles / Assign users) -->
                <div class="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                    <a href="{{ route($namePrefix.'roles.index') }}"
                       class="px-3 py-1.5 rounded-lg transition-all {{ request()->routeIs($namePrefix.'roles.*') ? 'bg-[#014D55] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900' }}">
                        {{ $isRtl ? 'قائمة الأدوار' : 'Roles' }}
                    </a>
                    <a href="{{ route($namePrefix.'users.index') }}"
                       class="px-3 py-1.5 rounded-lg transition-all {{ request()->routeIs($namePrefix.'users.*') ? 'bg-[#014D55] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900' }}">
                        {{ $isRtl ? 'تعيين الأدوار للمستخدمين' : 'Assign users' }}
                    </a>
                </div>
            </header>

            <!-- Main Scrollable Content Area -->
            <main class="flex-1 overflow-y-auto p-6 lg:p-8 bg-[#F8FAFC]">
                <div class="max-w-6xl mx-auto space-y-6">
                    <!-- Alerts -->
                    @if (session('role_permession_success'))
                        <div class="flex items-center gap-3 p-4 rounded-2xl bg-[#E6F8F6] text-[#008A7B] border border-teal-200 shadow-xs">
                            <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                            <span class="text-sm font-bold">{{ session('role_permession_success') }}</span>
                        </div>
                    @endif

                    @if (isset($errors) && $errors->any())
                        <div class="p-4 rounded-2xl bg-red-50 text-red-700 border border-red-200 shadow-xs">
                            <div class="flex items-center gap-2 font-bold text-sm mb-1">
                                <svg class="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                                <span>{{ $isRtl ? 'يرجى تصحيح الأخطاء التالية:' : 'Please correct the following errors:' }}</span>
                            </div>
                            <ul class="list-disc list-inside text-xs space-y-1">
                                @foreach ($errors->all() as $error)
                                    <li>{{ $error }}</li>
                                @endforeach
                            </ul>
                        </div>
                    @endif

                    <!-- Page Content -->
                    @yield('content')
                </div>
            </main>
        </div>
    </div>
</body>
</html>

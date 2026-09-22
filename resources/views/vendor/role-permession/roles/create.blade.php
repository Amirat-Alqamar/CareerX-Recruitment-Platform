@extends('role-permession::layouts.ui')

@section('title', app()->getLocale() === 'ar' ? 'إنشاء دور جديد' : 'Create Role')

@section('content')
    @php
        $namePrefix = config('role-permession.ui.route_name_prefix', 'role-permession.');
        $isRtl = app()->getLocale() === 'ar';
    @endphp

    <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <!-- Header -->
        <div class="p-6 border-b border-slate-100 flex items-center justify-between gap-4">
            <div>
                <h1 class="text-xl font-black text-slate-800 tracking-tight">
                    {{ $isRtl ? 'إنشاء دور جديد' : 'Create Role' }}
                </h1>
                <p class="text-xs text-slate-500 mt-1">
                    {{ $isRtl ? 'أدخل اسم الدور وحدد الصلاحيات الممنوحة له' : 'Define the role name and select the desired permission allowances' }}
                </p>
            </div>
            <a href="{{ route($namePrefix.'roles.index') }}"
               class="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors">
                <span>{{ $isRtl ? '← رجوع' : '← Back' }}</span>
            </a>
        </div>

        <!-- Form Body -->
        <div class="p-6 lg:p-8">
            <form method="POST" action="{{ route($namePrefix.'roles.store') }}">
                @csrf
                @include('role-permession::roles._form')

                <div class="flex items-center gap-3 pt-6 border-t border-slate-100">
                    <button type="submit"
                            class="px-5 py-2.5 bg-[#014D55] hover:bg-[#00383E] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer">
                        {{ $isRtl ? 'حفظ الدور الجديد' : 'Create Role' }}
                    </button>
                    <a href="{{ route($namePrefix.'roles.index') }}"
                       class="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors">
                        {{ $isRtl ? 'إلغاء' : 'Cancel' }}
                    </a>
                </div>
            </form>
        </div>
    </div>
@endsection

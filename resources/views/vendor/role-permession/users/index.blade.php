@extends('role-permession::layouts.ui')

@section('title', app()->getLocale() === 'ar' ? 'تعيين الأدوار للمستخدمين' : 'Assign User Roles')

@section('content')
    @php
        $namePrefix = config('role-permession.ui.route_name_prefix', 'role-permession.');
        $isRtl = app()->getLocale() === 'ar';
    @endphp

    <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <!-- Header & Search -->
        <div class="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 class="text-xl font-black text-slate-800 tracking-tight">
                    {{ $isRtl ? 'تعيين الأدوار للمستخدمين' : 'Assign Roles to Users' }}
                </h1>
                <p class="text-xs text-slate-500 mt-1">
                    {{ $isRtl ? 'البحث عن المستخدمين وتخصيص الأدوار والصلاحيات لكل مستخدم' : 'Search users and attach appropriate roles and permission sets' }}
                </p>
            </div>

            <!-- Search Form -->
            <form method="GET" action="{{ route($namePrefix.'users.index') }}" class="flex items-center gap-2">
                <div class="relative">
                    <input type="search" name="q" value="{{ $q }}"
                           placeholder="{{ $isRtl ? 'بحث بالاسم أو البريد...' : 'Search name or email...' }}"
                           class="w-64 sm:w-80 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all">
                </div>
                <button type="submit"
                        class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer">
                    {{ $isRtl ? 'بحث' : 'Search' }}
                </button>
            </form>
        </div>

        @if ($users->isEmpty())
            <div class="p-12 text-center">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                </div>
                <h3 class="text-sm font-bold text-slate-700">{{ $isRtl ? 'لم يتم العثور على أي مستخدم' : 'No users found' }}</h3>
                <p class="text-xs text-slate-400 mt-1">{{ $isRtl ? 'جرّب البحث باسم آخر أو إزالة معايير التصفية' : 'Try searching with a different term.' }}</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-start">
                    <thead>
                        <tr class="bg-slate-50/75 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider text-start">
                            <th class="py-3.5 px-6 text-start">{{ $isRtl ? 'المستخدم' : 'User' }}</th>
                            <th class="py-3.5 px-6 text-start">{{ $isRtl ? 'الأدوار المعينة' : 'Assigned Roles' }}</th>
                            <th class="py-3.5 px-6 text-end">{{ $isRtl ? 'الإجراء' : 'Action' }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach ($users as $u)
                            <tr class="hover:bg-slate-50/60 transition-colors">
                                <!-- User Info -->
                                <td class="py-4 px-6 text-start">
                                    <div class="flex items-center gap-3">
                                        <div class="w-9 h-9 rounded-full bg-[#014D55]/10 text-[#014D55] flex items-center justify-center font-bold text-xs uppercase shrink-0">
                                            {{ strtoupper(substr($u->name ?? 'U', 0, 1)) }}
                                        </div>
                                        <div>
                                            <strong class="font-bold text-slate-800 text-sm block">{{ $u->name ?? ('#'.$u->getKey()) }}</strong>
                                            <span class="text-xs text-slate-400 block font-mono">{{ $u->email }}</span>
                                        </div>
                                    </div>
                                </td>

                                <!-- Roles Checkboxes -->
                                <td class="py-4 px-6 text-start">
                                    <form method="POST" action="{{ route($namePrefix.'users.update', $u->getKey()) }}" id="user-roles-{{ $u->getKey() }}">
                                        @csrf
                                        @method('PUT')
                                        <div class="flex flex-wrap items-center gap-2">
                                            @forelse ($roles as $role)
                                                @php $isChecked = $u->roles->contains('id', $role->id); @endphp
                                                <label class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-xs font-bold cursor-pointer transition-all {{ $isChecked ? 'bg-[#E6F8F6] border-teal-200 text-[#008A7B]' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-white' }}">
                                                    <input
                                                        type="checkbox"
                                                        name="roles[]"
                                                        value="{{ $role->id }}"
                                                        @checked($isChecked)
                                                        class="accent-[#008A7B]"
                                                    >
                                                    <span class="capitalize">{{ str_replace('_', ' ', $role->name) }}</span>
                                                </label>
                                            @empty
                                                <span class="text-xs text-slate-400 italic">{{ $isRtl ? 'لا توجد أدوار متوفرة' : 'No roles yet' }}</span>
                                            @endforelse
                                        </div>
                                    </form>
                                </td>

                                <!-- Save Button -->
                                <td class="py-4 px-6 text-end">
                                    @if ($roles->isNotEmpty())
                                        <button type="submit" form="user-roles-{{ $u->getKey() }}"
                                                class="px-4 py-2 bg-[#014D55] hover:bg-[#00383E] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer">
                                            {{ $isRtl ? 'حفظ' : 'Save' }}
                                        </button>
                                    @endif
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="p-4 border-t border-slate-100 bg-slate-50/50">
                {{ $users->links() }}
            </div>
        @endif
    </div>
@endsection

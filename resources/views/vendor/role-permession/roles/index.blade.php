@extends('role-permession::layouts.ui')

@section('title', app()->getLocale() === 'ar' ? 'إدارة الأدوار' : 'Roles Management')

@section('content')
    @php
        $namePrefix = config('role-permession.ui.route_name_prefix', 'role-permession.');
        $isRtl = app()->getLocale() === 'ar';
    @endphp

    <div class="bg-white rounded-2xl border border-slate-100 shadow-xs overflow-hidden">
        <!-- Card Header -->
        <div class="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-xl font-black text-slate-800 tracking-tight">
                    {{ $isRtl ? 'الأدوار والصلاحيات' : 'Roles & Permissions' }}
                </h1>
                <p class="text-xs text-slate-500 mt-1">
                    {{ $isRtl ? 'إدارة أدوار النظام وتوزيع الصلاحيات المخصصة لكل دور' : 'Manage system roles and assign capabilities to each role' }}
                </p>
            </div>
            @canAbility('roles.create')
                <a href="{{ route($namePrefix.'roles.create') }}"
                   class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#014D55] hover:bg-[#00383E] text-white font-bold text-xs rounded-xl shadow-xs transition-all">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    <span>{{ $isRtl ? 'إضافة دور جديد' : 'New role' }}</span>
                </a>
            @endcanAbility
        </div>

        @if ($roles->isEmpty())
            <div class="p-12 text-center">
                <div class="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                    <svg class="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3 class="text-sm font-bold text-slate-700">{{ $isRtl ? 'لا توجد أدوار حالياً' : 'No roles yet' }}</h3>
                <p class="text-xs text-slate-400 mt-1">{{ $isRtl ? 'قم بإنشاء الدور الأول لتعيين الصلاحيات' : 'Create the first role to assign abilities.' }}</p>
            </div>
        @else
            <div class="overflow-x-auto">
                <table class="w-full text-start">
                    <thead>
                        <tr class="bg-slate-50/75 border-b border-slate-100 text-slate-400 text-[11px] font-extrabold uppercase tracking-wider text-start">
                            <th class="py-3.5 px-6 text-start">{{ $isRtl ? 'اسم الدور' : 'Role Name' }}</th>
                            <th class="py-3.5 px-6 text-start">{{ $isRtl ? 'عدد الصلاحيات' : 'Abilities' }}</th>
                            <th class="py-3.5 px-6 text-end">{{ $isRtl ? 'الإجراءات' : 'Actions' }}</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach ($roles as $role)
                            <tr class="hover:bg-slate-50/60 transition-colors">
                                <td class="py-4 px-6 text-start">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs uppercase">
                                            {{ substr($role->name, 0, 2) }}
                                        </div>
                                        <div>
                                            <strong class="font-bold text-slate-800 text-sm capitalize">{{ str_replace('_', ' ', $role->name) }}</strong>
                                            <span class="block text-[11px] text-slate-400 font-mono">id: {{ $role->id }}</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="py-4 px-6 text-start">
                                    <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E6F8F6] text-[#008A7B] border border-teal-100">
                                        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                                        {{ $role->abilities_count }} {{ $isRtl ? 'صلاحيات محددة' : 'set' }}
                                    </span>
                                </td>
                                <td class="py-4 px-6 text-end">
                                    <div class="inline-flex items-center gap-2 justify-end">
                                        @canAbility('roles.update')
                                            <a href="{{ route($namePrefix.'roles.edit', $role) }}"
                                               class="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors">
                                                <svg class="w-3.5 h-3.5 text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                                <span>{{ $isRtl ? 'تعديل' : 'Edit' }}</span>
                                            </a>
                                        @endcanAbility
                                        @canAbility('roles.delete')
                                            <form method="POST"
                                                  action="{{ route($namePrefix.'roles.destroy', $role) }}"
                                                  onsubmit="return confirm('{{ $isRtl ? 'هل أنت متأكد من حذف هذا الدور؟' : 'Are you sure you want to delete this role?' }}')"
                                                  class="inline-block">
                                                @csrf
                                                @method('DELETE')
                                                <button type="submit"
                                                        class="inline-flex items-center gap-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-colors cursor-pointer">
                                                    <svg class="w-3.5 h-3.5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                                    <span>{{ $isRtl ? 'حذف' : 'Delete' }}</span>
                                                </button>
                                            </form>
                                        @endcanAbility
                                    </div>
                                </td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        @endif
    </div>
@endsection

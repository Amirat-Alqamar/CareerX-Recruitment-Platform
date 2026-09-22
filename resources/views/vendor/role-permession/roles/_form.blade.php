@php
    $namePrefix = config('role-permession.ui.route_name_prefix', 'role-permession.');
    $isRtl = app()->getLocale() === 'ar';
@endphp

<!-- Role Name Input -->
<div class="mb-8">
    <label for="name" class="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
        {{ $isRtl ? 'اسم الدور' : 'Role Name' }} <span class="text-red-500">*</span>
    </label>
    <input id="name" type="text" name="name" value="{{ old('name', $role->name ?? '') }}" required maxlength="255"
           placeholder="{{ $isRtl ? 'مثال: مدير محتوى' : 'e.g. Moderator' }}"
           class="w-full max-w-lg px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all">
</div>

<!-- Abilities Selection -->
<div class="mb-6">
    <div class="mb-4">
        <h3 class="text-sm font-extrabold text-slate-800">
            {{ $isRtl ? 'تحديد الصلاحيات' : 'Abilities Catalog' }}
        </h3>
        <p class="text-xs text-slate-500 mt-0.5">
            {{ $isRtl ? 'اختر (سماح Allow) لتفعيل الصلاحية، أو (حظر Deny) لتعطيلها، أو (توريث Inherit) للاعتماد على الوضع الافتراضي.' : 'Select Allow, Deny, or leave as Inherit for each individual ability.' }}
        </p>
    </div>

    <div class="space-y-6">
        @foreach ($grouped as $group => $abilities)
            <div class="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs">
                <!-- Group Header -->
                <div class="bg-slate-50/80 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                    <span class="font-extrabold text-xs uppercase tracking-wider text-slate-700">
                        {{ $group }}
                    </span>
                    <span class="text-[11px] text-slate-400 font-semibold">
                        {{ count($abilities) }} {{ $isRtl ? 'صلاحيات' : 'abilities' }}
                    </span>
                </div>

                <!-- Group Abilities -->
                <div class="divide-y divide-slate-100">
                    @foreach ($abilities as $code => $label)
                        @php
                            $current = old("abilities.$code", $selected[$code] ?? 'inherit');
                        @endphp
                        <div class="px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                            <div>
                                <strong class="text-sm font-bold text-slate-800 block">{{ $label }}</strong>
                                <span class="text-[11px] font-mono text-slate-400">{{ $code }}</span>
                            </div>

                            <!-- Radio Choices -->
                            <div class="flex items-center gap-2">
                                <!-- Allow -->
                                <label class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all {{ $current === 'allow' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' }}">
                                    <input type="radio" name="abilities[{{ $code }}]" value="allow" @checked($current === 'allow') class="accent-[#008A7B]">
                                    <span>{{ $isRtl ? 'سماح' : 'Allow' }}</span>
                                </label>

                                <!-- Deny -->
                                <label class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all {{ $current === 'deny' ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50' }}">
                                    <input type="radio" name="abilities[{{ $code }}]" value="deny" @checked($current === 'deny') class="accent-rose-600">
                                    <span>{{ $isRtl ? 'حظر' : 'Deny' }}</span>
                                </label>

                                <!-- Inherit -->
                                <label class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold cursor-pointer transition-all {{ $current === 'inherit' ? 'bg-slate-100 border-slate-300 text-slate-700 font-extrabold' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50' }}">
                                    <input type="radio" name="abilities[{{ $code }}]" value="inherit" @checked($current === 'inherit') class="accent-slate-500">
                                    <span>{{ $isRtl ? 'توريث' : 'Inherit' }}</span>
                                </label>
                            </div>
                        </div>
                    @endforeach
                </div>
            </div>
        @endforeach
    </div>

    @if (empty($grouped))
        <div class="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            {{ $isRtl ? 'لا توجد صلاحيات معرّفة في ملف الإعدادات' : 'No abilities in config/role-permession.php. Add your catalog there first.' }}
        </div>
    @endif
</div>

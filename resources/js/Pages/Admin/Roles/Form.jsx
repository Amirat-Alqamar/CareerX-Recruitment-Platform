import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  Save,
  X,
  Layers,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function RoleForm({ role = null, grouped = {}, selected = {}, catalog = {} }) {
  const { __, locale, isRtl } = useTranslation();
  const isEditing = Boolean(role);

  // Initialize form with name and abilities dictionary
  const initialAbilities = {};
  Object.keys(catalog).forEach((code) => {
    initialAbilities[code] = selected[code] || 'inherit';
  });

  const { data, setData, post, put, processing, errors } = useForm({
    name: role?.name || '',
    abilities: initialAbilities,
  });

  const handleAbilityChange = (code, value) => {
    setData('abilities', {
      ...data.abilities,
      [code]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      put(`/${locale}/admin/roles/${role.id}`);
    } else {
      post(`/${locale}/admin/roles`);
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <Head
        title={`${isEditing ? __('Edit Role') + ': ' + role.name : __('Create Role')} - CareerX`}
      />

      <div className="space-y-6 max-w-5xl mx-auto pb-16 animate-fade-in">
        {/* Top Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Link
                href={`/${locale}/admin/roles`}
                className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"
              >
                {isRtl ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                <span>{__('Roles & Permissions')}</span>
              </Link>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{isEditing ? __('Edit Role') : __('Create Role')}</span>
              {isEditing && (
                <span className="text-[#008A7B] capitalize">
                  {role.name.replace(/_/g, ' ')}
                </span>
              )}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {isEditing
                ? __('Update role name and fine-tune permission allowances')
                : __('Define a new role and choose access permissions across CareerX')}
            </p>
          </div>

          <Link
            href={`/${locale}/admin/roles`}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            <X className="w-4 h-4" />
            <span>{__('Cancel')}</span>
          </Link>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
            {/* Role Name */}
            <div>
              <label htmlFor="name" className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2">
                {__('Role Name')} <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                placeholder={isRtl ? 'مثال: مسؤول توظيف' : 'e.g. recruiter'}
                className="w-full max-w-md px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all"
                required
              />
              {errors.name && (
                <p className="text-xs text-red-500 font-bold mt-1.5">{errors.name}</p>
              )}
            </div>

            {/* Abilities Catalog */}
            <div className="pt-4 border-t border-slate-100">
              <div className="mb-4">
                <h3 className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#008A7B]" />
                  <span>{__('Permission Allowances')}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {__('Configure explicit permission rules for this role: Allow, Deny, or Inherit default.')}
                </p>
              </div>

              <div className="space-y-6">
                {Object.entries(grouped).map(([groupTitle, abilities]) => (
                  <div key={groupTitle} className="border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/40">
                    {/* Group Header */}
                    <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                      <span className="font-black text-xs uppercase tracking-wider text-slate-700">
                        {groupTitle}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {Object.keys(abilities).length} {__('actions')}
                      </span>
                    </div>

                    {/* Abilities List */}
                    <div className="divide-y divide-slate-100 bg-white">
                      {Object.entries(abilities).map(([code, label]) => {
                        const currentVal = data.abilities[code] || 'inherit';

                        return (
                          <div
                            key={code}
                            className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors"
                          >
                            <div>
                              <strong className="text-xs font-extrabold text-slate-800 block">
                                {label}
                              </strong>
                              <span className="text-[11px] font-mono text-slate-400">
                                {code}
                              </span>
                            </div>

                            {/* Choices */}
                            <div className="inline-flex rounded-xl p-1 bg-slate-100 border border-slate-200/60 self-start sm:self-auto">
                              {/* Allow */}
                              <button
                                type="button"
                                onClick={() => handleAbilityChange(code, 'allow')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  currentVal === 'allow'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-emerald-700'
                                }`}
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{__('Allow')}</span>
                              </button>

                              {/* Deny */}
                              <button
                                type="button"
                                onClick={() => handleAbilityChange(code, 'deny')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  currentVal === 'deny'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'text-slate-600 hover:text-rose-700'
                                }`}
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                <span>{__('Deny')}</span>
                              </button>

                              {/* Inherit */}
                              <button
                                type="button"
                                onClick={() => handleAbilityChange(code, 'inherit')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                                  currentVal === 'inherit'
                                    ? 'bg-white text-slate-800 shadow-xs border border-slate-200/80'
                                    : 'text-slate-500 hover:text-slate-800'
                                }`}
                              >
                                <MinusCircle className="w-3.5 h-3.5" />
                                <span>{__('Inherit')}</span>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
              <Link
                href={`/${locale}/admin/roles`}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
              >
                {__('Cancel')}
              </Link>

              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#008A7B] text-white hover:bg-[#014D55] shadow-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{processing ? __('Saving...') : isEditing ? __('Update Role') : __('Save Role')}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

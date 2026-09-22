import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  ShieldCheck,
  PlusCircle,
  Edit3,
  Trash2,
  Users,
  Shield,
  Layers,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';
import DeleteConfirmModal from '@/Components/Common/DeleteConfirmModal';

export default function RolesIndex({ roles = [], catalog = {} }) {
  const { __, locale } = useTranslation();
  const [roleToDelete, setRoleToDelete] = useState(null);

  const confirmDelete = () => {
    if (!roleToDelete) return;
    router.delete(`/${locale}/admin/roles/${roleToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => setRoleToDelete(null),
    });
  };

  return (
    <DashboardLayout userRole="admin">
      <Head title={`${__('Roles & Permissions')} - CareerX`} />

      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
        {/* Top Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {__('Roles & Permissions')}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {__('Manage system roles and assign capabilities to each role')}
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}/admin/roles/users`}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#008A7B] transition-all cursor-pointer shadow-xs"
            >
              <Users className="w-4 h-4 text-slate-400" />
              <span>{__('Assign users')}</span>
            </Link>

            <Link
              href={`/${locale}/admin/roles/create`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#008A7B] text-white hover:bg-[#014D55] shadow-xs transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{__('Create Role')}</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Cards - Matching CareerX Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-slate-400 block mb-1">{__('Total Roles')}</span>
            <span className="text-2xl font-black text-slate-900">{roles.length}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-teal-100 bg-teal-50/30 shadow-sm">
            <span className="text-xs font-bold text-[#008A7B] block mb-1">{__('Total Catalog Abilities')}</span>
            <span className="text-2xl font-black text-[#008A7B]">{Object.keys(catalog).length}</span>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <span className="text-xs font-bold text-amber-600 block mb-1">{__('Active Admin Control')}</span>
            <span className="text-2xl font-black text-slate-900">Super Admin</span>
          </div>
        </div>

        {/* Roles Table Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-extrabold text-sm text-slate-800">
              {__('Configured Roles')}
            </h3>
            <span className="text-xs text-slate-400 font-semibold">
              {roles.length} {__('Roles')}
            </span>
          </div>

          {roles.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">{__('No roles yet')}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {__('Create the first role to assign abilities.')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-wider text-start">
                    <th className="py-3.5 px-6 text-start">{__('Role Name')}</th>
                    <th className="py-3.5 px-6 text-start">{__('Abilities')}</th>
                    <th className="py-3.5 px-6 text-end">{__('Actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {roles.map((role) => (
                    <tr key={role.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-4 px-6 text-start">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-[#008A7B] flex items-center justify-center font-bold text-xs uppercase">
                            {role.name.substring(0, 2)}
                          </div>
                          <div>
                            <strong className="font-bold text-slate-900 block capitalize">
                              {role.name.replace(/_/g, ' ')}
                            </strong>
                            <span className="text-[11px] text-slate-400 font-mono">
                              id: {role.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-start">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#E6F8F6] text-[#008A7B] border border-teal-200">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>{role.abilities_count ?? 0} {__('permissions')}</span>
                        </span>
                      </td>

                      {/* Row Actions: Clean square icon buttons matching CareerX design */}
                      <td className="py-4 px-6 text-end">
                        <div className="inline-flex items-center gap-2 justify-end">
                          <Link
                            href={`/${locale}/admin/roles/${role.id}/edit`}
                            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#008A7B] hover:border-[#008A7B] hover:bg-teal-50/40 transition-all cursor-pointer shadow-2xs"
                            title={__('Edit')}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => setRoleToDelete(role)}
                            className="p-2 rounded-xl border border-rose-200 text-rose-600 bg-rose-50/40 hover:bg-rose-100 hover:border-rose-300 transition-all cursor-pointer shadow-2xs"
                            title={__('Delete')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={Boolean(roleToDelete)}
        onClose={() => setRoleToDelete(null)}
        onConfirm={confirmDelete}
        title={__('Delete Role')}
        message={
          roleToDelete
            ? `${__('Are you sure you want to permanently delete the role')} "${roleToDelete.name}"?`
            : ''
        }
      />
    </DashboardLayout>
  );
}

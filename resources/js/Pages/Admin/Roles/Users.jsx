import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Users,
  Search,
  CheckCircle2,
  Shield,
  ArrowRight,
  ArrowLeft,
  Save,
  Check,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function RolesUsers({ users = { data: [] }, roles = [], q = '' }) {
  const { __, locale, isRtl } = useTranslation();
  const [search, setSearch] = useState(q);
  const [savingUserId, setSavingUserId] = useState(null);

  // Store local selection state for each user's assigned role ids
  const [selectedRoles, setSelectedRoles] = useState(() => {
    const map = {};
    (users.data || []).forEach((u) => {
      map[u.id] = (u.roles || []).map((r) => r.id);
    });
    return map;
  });

  useEffect(() => {
    const map = {};
    (users.data || []).forEach((u) => {
      map[u.id] = (u.roles || []).map((r) => r.id);
    });
    setSelectedRoles(map);
  }, [users.data]);

  useEffect(() => {
    setSearch(q);
  }, [q]);

  const handleRoleToggle = (userId, roleId) => {
    const current = selectedRoles[userId] || [];
    const updated = current.includes(roleId)
      ? current.filter((id) => id !== roleId)
      : [...current, roleId];

    setSelectedRoles((prev) => ({
      ...prev,
      [userId]: updated,
    }));
  };

  const handleSaveUserRoles = (userId) => {
    setSavingUserId(userId);
    const userRoleIds = selectedRoles[userId] || [];

    router.put(
      `/${locale}/admin/roles/users/${userId}`,
      { roles: userRoleIds },
      {
        preserveScroll: true,
        onFinish: () => setSavingUserId(null),
      }
    );
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.get(
      `/${locale}/admin/roles/users`,
      search ? { q: search } : {},
      {
        preserveState: true,
        preserveScroll: true,
      }
    );
  };

  return (
    <DashboardLayout userRole="admin">
      <Head title={`${__('Assign User Roles')} - CareerX`} />

      <div className="space-y-6 max-w-7xl mx-auto pb-16 animate-fade-in">
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
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {__('Assign User Roles')}
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-1">
              {__('Select users and assign their respective administrative or operational roles')}
            </p>
          </div>

          <Link
            href={`/${locale}/admin/roles`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-[#008A7B] transition-all cursor-pointer shadow-xs self-start sm:self-auto"
          >
            {isRtl ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{__('Back to Roles')}</span>
          </Link>
        </div>

        {/* Search Bar Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={__('Search by name or email...')}
                className={`w-full py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all ${
                  isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
                }`}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#008A7B] text-white hover:bg-[#014D55] shadow-xs transition-all cursor-pointer shrink-0"
            >
              {__('Search')}
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  router.get(`/${locale}/admin/roles/users`, {}, { preserveState: true, preserveScroll: true });
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer shrink-0"
              >
                {__('Clear')}
              </button>
            )}
          </form>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {(!users.data || users.data.length === 0) ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-700">{__('No users found')}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {__('Try adjusting your search query.')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-start border-collapse">
                <thead>
                  <tr className="bg-slate-50/75 border-b border-slate-100 text-slate-400 text-[11px] font-black uppercase tracking-wider text-start">
                    <th className="py-3.5 px-6 text-start">{__('User')}</th>
                    <th className="py-3.5 px-6 text-start">{__('Assigned Roles')}</th>
                    <th className="py-3.5 px-6 text-end">{__('Action')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {users.data.map((user) => {
                    const userRoleIds = selectedRoles[user.id] || [];
                    const isSaving = savingUserId === user.id;

                    return (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* User Cell */}
                        <td className="py-4 px-6 text-start">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#008A7B] flex items-center justify-center font-bold text-sm">
                              {user.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                            </div>
                            <div>
                              <strong className="font-bold text-slate-900 block">
                                {user.name}
                              </strong>
                              <span className="text-xs text-slate-400 font-medium">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Roles Cell */}
                        <td className="py-4 px-6 text-start">
                          <div className="flex flex-wrap items-center gap-2">
                            {roles.map((role) => {
                              const isChecked = userRoleIds.includes(role.id);

                              return (
                                <label
                                  key={role.id}
                                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border ${
                                    isChecked
                                      ? 'bg-teal-50 text-[#008A7B] border-teal-200 shadow-2xs'
                                      : 'bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100'
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleRoleToggle(user.id, role.id)}
                                    className="rounded text-[#008A7B] focus:ring-[#008A7B] w-3.5 h-3.5 cursor-pointer accent-[#008A7B]"
                                  />
                                  <span className="capitalize">{role.name.replace(/_/g, ' ')}</span>
                                </label>
                              );
                            })}
                          </div>
                        </td>

                        {/* Save Cell */}
                        <td className="py-4 px-6 text-end">
                          <button
                            type="button"
                            disabled={isSaving}
                            onClick={() => handleSaveUserRoles(user.id)}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs bg-[#008A7B] text-white hover:bg-[#014D55] shadow-xs transition-all disabled:opacity-50 cursor-pointer"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSaving ? __('Saving...') : __('Save')}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {users.links && users.links.length > 3 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">
                {__('Showing')} {users.from || 0} - {users.to || 0} {__('of')} {users.total || 0}
              </span>
              <div className="flex items-center gap-1">
                {users.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.url || '#'}
                    disabled={!link.url}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      link.active
                        ? 'bg-[#008A7B] text-white'
                        : link.url
                        ? 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                        : 'text-slate-300 pointer-events-none'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

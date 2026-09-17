import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
  Users,
  Search,
  UserX,
  UserCheck,
  Trash2,
  Shield,
  Briefcase,
  Building2,
  CheckCircle2,
  AlertCircle,
  X,
  Lock,
  Unlock,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import DashboardLayout from '@/Layouts/DashboardLayout';
import useTranslation from '@/hooks/useTranslation';

export default function AdminUsers({ users, stats = {}, filters = {} }) {
  const { __, locale, isRtl } = useTranslation();
  const { flash, auth } = usePage().props;

  const [search, setSearch] = useState(filters.search || '');
  const [selectedUserForBan, setSelectedUserForBan] = useState(null);
  const [banReason, setBanReason] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);

  const handleFilter = (newFilters) => {
    const updated = {
      ...filters,
      ...newFilters,
    };
    // remove empty
    Object.keys(updated).forEach((k) => !updated[k] && delete updated[k]);

    router.get(`/${locale}/admin/users`, updated, {
      preserveState: true,
      preserveScroll: true,
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilter({ search });
  };

  const handleToggleBan = (user) => {
    if (user.status) {
      // User is currently active -> show modal to input ban reason
      setSelectedUserForBan(user);
      setBanReason('');
    } else {
      // User is banned -> unban directly
      router.post(
        `/${locale}/admin/users/${user.id}/toggle-ban`,
        {},
        { preserveScroll: true }
      );
    }
  };

  const submitBan = (e) => {
    e.preventDefault();
    if (!selectedUserForBan) return;

    router.post(
      `/${locale}/admin/users/${selectedUserForBan.id}/toggle-ban`,
      { ban_reason: banReason },
      {
        preserveScroll: true,
        onSuccess: () => setSelectedUserForBan(null),
      }
    );
  };

  const confirmDelete = () => {
    if (!userToDelete) return;
    router.delete(`/${locale}/admin/users/${userToDelete.id}`, {
      preserveScroll: true,
      onSuccess: () => setUserToDelete(null),
    });
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <Shield className="w-3 h-3" />
            {__('Administrator')}
          </span>
        );
      case 'employer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Building2 className="w-3 h-3" />
            {__('Employer')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Briefcase className="w-3 h-3" />
            {__('Job Seeker')}
          </span>
        );
    }
  };

  return (
    <DashboardLayout userRole="admin">
      <Head title={__('User Management') + ' - CareerX'} />

      <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
        {/* Flash notifications */}
        {flash?.success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{flash.success}</span>
          </div>
        )}
        {flash?.error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm font-semibold flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{flash.error}</span>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {__('Platform User Management')}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
              {__('Manage job seekers, employers, and administrator accounts across CareerX')}
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => handleFilter({ role: '', status: '' })}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
              !filters.role && !filters.status
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold block opacity-75">{__('All Users')}</span>
            <span className="text-xl font-black mt-1 block">{stats.total || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilter({ role: 'job_seeker', status: '' })}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
              filters.role === 'job_seeker'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold block opacity-75">{__('Job Seekers')}</span>
            <span className="text-xl font-black mt-1 block">{stats.job_seekers || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilter({ role: 'employer', status: '' })}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
              filters.role === 'employer'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold block opacity-75">{__('Employers')}</span>
            <span className="text-xl font-black mt-1 block">{stats.employers || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilter({ role: 'admin', status: '' })}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
              filters.role === 'admin'
                ? 'bg-rose-600 text-white border-rose-600 shadow-md'
                : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold block opacity-75">{__('Admins')}</span>
            <span className="text-xl font-black mt-1 block">{stats.admins || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => handleFilter({ status: 'banned', role: '' })}
            className={`p-4 rounded-2xl border text-start transition-all cursor-pointer ${
              filters.status === 'banned'
                ? 'bg-rose-900 text-white border-rose-900 shadow-md'
                : 'bg-white text-slate-800 border-slate-100 hover:border-slate-200'
            }`}
          >
            <span className="text-[11px] font-bold block opacity-75">{__('Banned Users')}</span>
            <span className="text-xl font-black mt-1 block">{stats.banned || 0}</span>
          </button>
        </div>

        {/* Search and Filters Bar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute start-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={__('Search by name or email...')}
              className="w-full ps-10 pe-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#008A7B] focus:border-transparent transition-all"
            />
          </form>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            <select
              value={filters.status || ''}
              onChange={(e) => handleFilter({ status: e.target.value })}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#008A7B]"
            >
              <option value="">{__('All Statuses')}</option>
              <option value="active">{__('Active Only')}</option>
              <option value="banned">{__('Banned Only')}</option>
            </select>

            {(filters.role || filters.status || filters.search) && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  router.get(`/${locale}/admin/users`);
                }}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold transition-colors cursor-pointer shrink-0"
              >
                {__('Reset Filters')}
              </button>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-start border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-5 text-start">{__('User')}</th>
                  <th className="py-3.5 px-5 text-start">{__('Role')}</th>
                  <th className="py-3.5 px-5 text-start">{__('Organization / Title')}</th>
                  <th className="py-3.5 px-5 text-start">{__('Status')}</th>
                  <th className="py-3.5 px-5 text-start">{__('Joined Date')}</th>
                  <th className="py-3.5 px-5 text-end">{__('Actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold">
                {users.data && users.data.length > 0 ? (
                  users.data.map((user) => {
                    const isCurrentUser = user.id === auth?.user?.id;
                    return (
                      <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                        {/* User Profile */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-3">
                            {user.avatar ? (
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-[#014D55] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                                {user.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="font-bold text-slate-900 block truncate">
                                {user.name} {isCurrentUser && <span className="text-[10px] text-emerald-600 font-black">({__('You')})</span>}
                              </span>
                              <span className="text-[11px] text-slate-400 font-medium block truncate">
                                {user.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Role */}
                        <td className="py-4 px-5">
                          {getRoleBadge(user.role)}
                        </td>

                        {/* Company / Title */}
                        <td className="py-4 px-5 text-slate-600">
                          {user.company_name || user.job_title || '—'}
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">
                          {user.status ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              {__('Active')}
                            </span>
                          ) : (
                            <div className="space-y-0.5">
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">
                                <Lock className="w-3 h-3" />
                                {__('Banned')}
                              </span>
                              {user.ban_reason && (
                                <p className="text-[10px] text-rose-500 font-medium max-w-xs truncate">
                                  {user.ban_reason}
                                </p>
                              )}
                            </div>
                          )}
                        </td>

                        {/* Joined Date */}
                        <td className="py-4 px-5 text-slate-400 text-[11px]">
                          {user.created_at}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-end">
                          {!isCurrentUser && (
                            <div className="flex items-center justify-end gap-2">
                              {/* Toggle Ban */}
                              <button
                                type="button"
                                onClick={() => handleToggleBan(user)}
                                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                  user.status
                                    ? 'border-amber-200 text-amber-600 hover:bg-amber-50'
                                    : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'
                                }`}
                                title={user.status ? __('Ban User') : __('Reactivate User')}
                              >
                                {user.status ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                              </button>

                              {/* Delete User */}
                              <button
                                type="button"
                                onClick={() => setUserToDelete(user)}
                                className="p-2 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title={__('Delete User Permanently')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-slate-400">
                      <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                      <p className="text-xs font-semibold">{__('No users found matching your criteria.')}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {users.links && users.links.length > 3 && (
            <div className="p-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-semibold">
                {__('Showing')} {users.from || 0} {__('to')} {users.to || 0} {__('of')} {users.total || 0} {__('results')}
              </span>
              <div className="flex items-center gap-1">
                {users.links.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.url || '#'}
                    preserveScroll
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      link.active
                        ? 'bg-[#014D55] text-white'
                        : link.url
                        ? 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                        : 'opacity-40 cursor-not-allowed text-slate-400'
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ban User Modal */}
      {selectedUserForBan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Lock className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">{__('Ban User Account')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUserForBan(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              {__('Are you sure you want to suspend access for')}{' '}
              <strong className="text-slate-900">{selectedUserForBan.name}</strong> ({selectedUserForBan.email})?{' '}
              {__('They will not be able to log in.')}
            </p>

            <form onSubmit={submitBan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {__('Reason for Suspension')}
                </label>
                <textarea
                  rows="3"
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder={__('e.g., Violation of platform terms and conditions...')}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedUserForBan(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  {__('Cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  {__('Confirm Ban')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl w-full max-w-md p-6 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <Trash2 className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">{__('Delete User Permanently')}</h3>
              </div>
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {__('Are you sure you want to permanently delete')} <strong className="text-slate-900">{userToDelete.name}</strong>?{' '}
              {__('This will delete all their applications, profile data, or company relationships. This action cannot be reversed.')}
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {__('Cancel')}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {__('Yes, Delete Permanently')}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

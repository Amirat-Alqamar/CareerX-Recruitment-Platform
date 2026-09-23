<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UserController extends Controller
{

    public function index(Request $request)
    {
        Gate::authorize('users.manage');

        $query = User::with(['company:id,name', 'profile:id,user_id,job_title']);

        if ($request->filled('role') && in_array($request->role, ['job_seeker', 'employer', 'admin'])) {
            $query->where('role', $request->role);
        }

        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('status', true);
            } elseif ($request->status === 'banned') {
                $query->where('status', false);
            }
        }

        if ($request->filled('search')) {
            $search = trim($request->search);
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
                if (str_contains($search, '@')) {
                    $q->orWhere('email', 'like', "%{$search}%");
                } else {
                    $q->orWhereRaw("SUBSTRING_INDEX(email, '@', 1) LIKE ?", ["%{$search}%"]);
                }
            });
        }

        $users = $query->latest()->paginate(12)->withQueryString()->through(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'phone' => $u->phone,
                'role' => $u->role,
                'status' => (bool) $u->status,
                'ban_reason' => $u->ban_reason,
                'avatar' => $u->avatar ? (str_starts_with($u->avatar, 'http') ? $u->avatar : asset('storage/' . $u->avatar)) : null,
                'company_name' => $u->company?->name,
                'job_title' => $u->profile?->job_title,
                'created_at' => $u->created_at ? $u->created_at->format('Y-m-d') : '',
            ];
        });

        $stats = [
            'total'       => User::count(),
            'job_seekers' => User::where('role', 'job_seeker')->count(),
            'employers'   => User::where('role', 'employer')->count(),
            'admins'      => User::where('role', 'admin')->count(),
            'banned'      => User::where('status', false)->count(),
        ];

        return Inertia::render('Admin/Users', [
            'users'   => $users,
            'stats'   => $stats,
            'filters' => $request->only(['role', 'status', 'search']),
        ]);
    }

    public function toggleBan(Request $request, User $user)
    {
        Gate::authorize('users.manage');

        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', __('You cannot ban your own account.'));
        }

        if ($user->status) {

            $request->validate([
                'ban_reason' => ['nullable', 'string', 'max:255'],
            ]);

            $user->update([
                'status' => false,
                'ban_reason' => $request->ban_reason ?? __('Account suspended by administrator.'),
            ]);

            return redirect()->back()->with('success', __('User account has been banned successfully.'));
        } else {

            $user->update([
                'status' => true,
                'ban_reason' => null,
            ]);

            return redirect()->back()->with('success', __('User account has been reactivated successfully.'));
        }
    }

    public function destroy(User $user)
    {
        Gate::authorize('users.manage');

        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', __('You cannot delete your own admin account.'));
        }

        $company = $user->company;

        $user->delete();

        if ($company && $company->users()->count() === 0) {
            $company->jobs()->delete();
            $company->delete();
        }

        return redirect()->back()->with('success', __('User deleted successfully.'));
    }
}


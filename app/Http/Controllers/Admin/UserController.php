<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UserController extends Controller
{
    /**
     * Display a listing of all platform users with filtering.
     */
    public function index(Request $request)
    {
        $query = User::with(['company:id,name', 'profile:id,user_id,job_title']);

        // Filter by role
        if ($request->filled('role') && in_array($request->role, ['job_seeker', 'employer', 'admin'])) {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('status', true);
            } elseif ($request->status === 'banned') {
                $query->where('status', false);
            }
        }

        // Search by name or email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
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

        // Overview counts
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

    /**
     * Toggle ban status of a user.
     */
    public function toggleBan(Request $request, User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', __('You cannot ban your own account.'));
        }

        if ($user->status) {
            // Ban the user
            $request->validate([
                'ban_reason' => ['nullable', 'string', 'max:255'],
            ]);

            $user->update([
                'status' => false,
                'ban_reason' => $request->ban_reason ?? __('Account suspended by administrator.'),
            ]);

            return redirect()->back()->with('success', __('User account has been banned successfully.'));
        } else {
            // Unban user
            $user->update([
                'status' => true,
                'ban_reason' => null,
            ]);

            return redirect()->back()->with('success', __('User account has been reactivated successfully.'));
        }
    }

    /**
     * Delete a user permanently.
     */
    public function destroy(User $user)
    {
        if ($user->id === Auth::id()) {
            return redirect()->back()->with('error', __('You cannot delete your own admin account.'));
        }

        $user->delete();

        return redirect()->back()->with('success', __('User deleted successfully.'));
    }
}

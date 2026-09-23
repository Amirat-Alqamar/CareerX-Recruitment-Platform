<?php

namespace App\Http\Controllers\RolePermession;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Melbedran\RolePermession\Models\Role;

class UserRoleController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('roles.update');

        $userModel = $this->userModel();

        $users = $userModel::query()
            ->when(
                $request->filled('q'),
                function ($query) use ($request) {
                    $raw = trim($request->string('q')->toString());
                    $query->where(function ($inner) use ($raw) {
                        $inner->where('name', 'like', "%{$raw}%");
                        if (str_contains($raw, '@')) {
                            $inner->orWhere('email', 'like', "%{$raw}%");
                        } else {
                            $inner->orWhereRaw("SUBSTRING_INDEX(email, '@', 1) LIKE ?", ["%{$raw}%"]);
                        }
                    });
                }
            )
            ->with('roles')
            ->orderBy('name')
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Roles/Users', [
            'users' => $users,
            'roles' => Role::query()->orderBy('name')->get(),
            'q' => $request->string('q')->toString(),
        ]);
    }

    public function update(Request $request, int|string $user): RedirectResponse
    {
        Gate::authorize('roles.update');

        $data = $request->validate([
            'roles' => ['nullable', 'array'],
            'roles.*' => ['integer', 'exists:'.Config::get('role-permession.tables.roles', 'roles').',id'],
        ]);

        $model = $this->userModel()::query()->findOrFail($user);

        if (! method_exists($model, 'roles')) {
            abort(422, 'User model must use the HasRoles trait.');
        }

        $model->roles()->sync($data['roles'] ?? []);

        return redirect()
            ->back()
            ->with('success', 'User roles updated successfully.');
    }

    protected function userModel(): string
    {
        return Config::get('auth.providers.users.model');
    }
}

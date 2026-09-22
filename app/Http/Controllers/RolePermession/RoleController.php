<?php

namespace App\Http\Controllers\RolePermession;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Melbedran\RolePermession\Models\Role;
use Melbedran\RolePermession\Support\AbilityManager;

class RoleController extends Controller
{
    public function index(AbilityManager $abilities): Response
    {
        Gate::authorize('roles.view');

        $roles = Role::query()
            ->withCount('abilities')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Roles/Index', [
            'roles' => $roles,
            'catalog' => $abilities->catalog(),
        ]);
    }

    public function create(AbilityManager $abilities): Response
    {
        Gate::authorize('roles.create');

        return Inertia::render('Admin/Roles/Form', [
            'catalog' => $abilities->catalog(),
            'grouped' => $this->groupAbilities($abilities->catalog()),
            'selected' => [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('roles.create');

        $data = $this->validated($request);

        Role::createWithAbilities($data);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function edit(Role $role, AbilityManager $abilities): Response
    {
        Gate::authorize('roles.update');

        $role->load('abilities');

        $selected = $role->abilities
            ->pluck('type', 'ability')
            ->all();

        return Inertia::render('Admin/Roles/Form', [
            'role' => $role,
            'catalog' => $abilities->catalog(),
            'grouped' => $this->groupAbilities($abilities->catalog()),
            'selected' => $selected,
        ]);
    }

    public function update(Request $request, Role $role): RedirectResponse
    {
        Gate::authorize('roles.update');

        $data = $this->validated($request);

        $role->updateWithAbilities($data);

        return redirect()
            ->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role): RedirectResponse
    {
        Gate::authorize('roles.delete');

        $role->abilities()->delete();
        $role->delete();

        return redirect()
            ->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }

    protected function validated(Request $request): array
    {
        $catalog = array_keys(config('role-permession.abilities', []));

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'abilities' => ['nullable', 'array'],
            'abilities.*' => ['in:allow,deny,inherit'],
        ]);

        $abilities = [];
        foreach ($catalog as $code) {
            $abilities[$code] = $data['abilities'][$code] ?? 'inherit';
        }

        return [
            'name' => $data['name'],
            'abilities' => $abilities,
        ];
    }

    protected function groupAbilities(array $catalog): array
    {
        $grouped = [];

        foreach ($catalog as $code => $label) {
            $group = str_contains($code, '.')
                ? str($code)->before('.')->headline()->toString()
                : 'General';

            $grouped[$group][$code] = $label;
        }

        return $grouped;
    }
}

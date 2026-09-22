<?php

return [
    'abilities' => [
        'admin.access' => 'Access Admin Panel',
        'users.manage' => 'Manage Users',
        'roles.view' => 'View Roles',
        'roles.create' => 'Create Roles',
        'roles.update' => 'Update Roles',
        'roles.delete' => 'Delete Roles',
        'employer.access' => 'Access Employer Panel',
        'jobs.create' => 'Create Jobs',
        'jobs.update' => 'Update Jobs',
        'jobs.delete' => 'Delete Jobs',
        'company.profile.edit' => 'Edit Company Profile',
        'applications.view' => 'View Job Applications',
        'applications.manage' => 'Manage Job Applications',
        'jobs.apply' => 'Apply to Jobs',
        'jobs.save' => 'Save Jobs',
        'profile.edit' => 'Edit Seeker Profile',
    ],

    'super_admin_column' => 'super_admin',

    'models' => [
        'role' => Melbedran\RolePermession\Models\Role::class,
        'role_ability' => Melbedran\RolePermession\Models\RoleAbility::class,
    ],

    'tables' => [
        'roles' => 'roles',
        'role_abilities' => 'role_abilities',
        'role_user' => 'role_user',
    ],

    'morph' => 'authorizable',

    'register_gates' => true,

    'load_migrations' => true,

    'blade' => [
        'enabled' => true,
        'can' => 'canAbility',
        'cannot' => 'cannotAbility',
        'canAny' => 'canAnyAbility',
        'canAll' => 'canAllAbility',
    ],

    'ui' => [
        'enabled' => true,
        'prefix' => 'admin/roles',
        'middleware' => ['web', 'auth', 'can:admin.access'],
        'route_name_prefix' => 'admin.roles.',
    ],
];

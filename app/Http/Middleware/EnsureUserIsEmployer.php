<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsEmployer
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isEmployer()) {
            abort(403, __('Unauthorized access. Only employers can access this area.'));
        }

        if (!$request->user()->company_id) {
            abort(403, __('No company associated with this employer account.'));
        }

        return $next($request);
    }
}

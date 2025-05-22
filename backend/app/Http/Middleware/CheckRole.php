<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use function PHPUnit\Framework\isNull;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!auth('sanctum')->check()) {
            return response()->json(['message' => 'Unauthorized - Authentication Required'], 401);
        }

        $user = auth()->user();

        // Assuming you have a 'role' column in your users table
        if ($user->role !== $role) {
            return response()->json(['message' => 'Unauthorized - Insufficient Permissions.  Required role: ' . $role, "ROLE" => $role, "user" => $user->role], 403);
        }

        return $next($request);
    }
}
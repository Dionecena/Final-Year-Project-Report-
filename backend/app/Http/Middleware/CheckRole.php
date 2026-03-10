<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware de verification de role.
 *
 * Usage dans les routes :
 *   ->middleware('role:admin')
 *   ->middleware('role:secretary,admin')
 *   ->middleware('role:doctor,admin')
 *
 * Verifie que l'utilisateur authentifie possede l'un des roles autorises.
 */
class CheckRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'Non authentifie.',
            ], 401);
        }

        if (!in_array($user->role, $roles, true)) {
            return response()->json([
                'message' => 'Acces non autorise. Role requis : ' . implode(' ou ', $roles) . '.',
            ], 403);
        }

        return $next($request);
    }
}

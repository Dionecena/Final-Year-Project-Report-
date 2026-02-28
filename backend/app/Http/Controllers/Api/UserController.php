<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Lister tous les utilisateurs (admin uniquement)
     * GET /api/admin/users
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Accès réservé aux administrateurs'], 403);
        }

        $query = User::query();

        // Filtres
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderByDesc('created_at')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $users->items(),
            'current_page' => $users->currentPage(),
            'last_page' => $users->lastPage(),
            'total' => $users->total(),
        ]);
    }

    /**
     * Activer/Désactiver un compte utilisateur
     * PUT /api/admin/users/{id}/toggle-status
     */
    public function toggleStatus(Request $request, User $user): JsonResponse
    {
        $admin = $request->user();

        if (!$admin->isAdmin()) {
            return response()->json(['message' => 'Accès réservé aux administrateurs'], 403);
        }

        // Ne pas désactiver son propre compte
        if ($admin->id === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas désactiver votre propre compte'], 422);
        }

        $oldStatus = $user->is_active;
        $user->update(['is_active' => !$user->is_active]);

        AuditService::log(
            $user->is_active ? 'activate_user' : 'deactivate_user',
            'User',
            $user->id,
            ['is_active' => $oldStatus],
            ['is_active' => $user->is_active]
        );

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => $user->is_active ? 'Compte activé' : 'Compte désactivé',
        ]);
    }

    /**
     * Modifier le rôle d'un utilisateur
     * PUT /api/admin/users/{id}/role
     */
    public function updateRole(Request $request, User $user): JsonResponse
    {
        $admin = $request->user();

        if (!$admin->isAdmin()) {
            return response()->json(['message' => 'Accès réservé aux administrateurs'], 403);
        }

        $validated = $request->validate([
            'role' => 'required|in:patient,doctor,secretary,admin',
        ]);

        $oldRole = $user->role;
        $user->update(['role' => $validated['role']]);

        AuditService::log('change_role', 'User', $user->id,
            ['role' => $oldRole],
            ['role' => $validated['role']]
        );

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Rôle modifié avec succès',
        ]);
    }
}

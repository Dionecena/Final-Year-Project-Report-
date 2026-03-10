<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    /**
     * Lister tous les utilisateurs (admin uniquement)
     * GET /api/admin/users
     */
    public function index(Request $request): JsonResponse
    {
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
     * Creer un compte utilisateur (admin uniquement).
     * POST /api/admin/users
     *
     * Permet a l'admin de creer des comptes medecin, secretaire ou patient.
     * C'est le SEUL moyen de creer un compte non-patient.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Password::min(8)],
            'role' => 'required|in:patient,doctor,secretary,admin',
            'phone' => 'nullable|string|max:20',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
        ]);

        AuditService::log('create_user', 'User', $user->id, null, [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'Utilisateur cree avec succes (role : ' . $user->role . ').',
        ], 201);
    }

    /**
     * Activer/Desactiver un compte utilisateur
     * PUT /api/admin/users/{id}/toggle-status
     */
    public function toggleStatus(Request $request, User $user): JsonResponse
    {
        $admin = $request->user();

        // Ne pas desactiver son propre compte
        if ($admin->id === $user->id) {
            return response()->json(['message' => 'Vous ne pouvez pas desactiver votre propre compte'], 422);
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
            'message' => $user->is_active ? 'Compte active' : 'Compte desactive',
        ]);
    }

    /**
     * Modifier le role d'un utilisateur
     * PUT /api/admin/users/{id}/role
     */
    public function updateRole(Request $request, User $user): JsonResponse
    {
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
            'message' => 'Role modifie avec succes',
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Specialty;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SpecialtyController extends Controller
{
    /**
     * Lister toutes les spécialités
     * GET /api/specialties
     */
    public function index(Request $request): JsonResponse
    {
        $specialties = Specialty::withCount('doctors')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $specialties,
        ]);
    }

    /**
     * Afficher une spécialité
     * GET /api/specialties/{id}
     */
    public function show(Specialty $specialty): JsonResponse
    {
        $specialty->loadCount('doctors');
        $specialty->load('doctors.user');

        return response()->json([
            'success' => true,
            'data' => $specialty,
        ]);
    }

    /**
     * Créer une spécialité (admin uniquement)
     * POST /api/specialties
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorize('admin');

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:specialties',
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
        ]);

        $specialty = Specialty::create($validated);

        AuditService::log('create', 'Specialty', $specialty->id, null, $validated);

        return response()->json([
            'success' => true,
            'data' => $specialty,
            'message' => 'Spécialité créée avec succès',
        ], 201);
    }

    /**
     * Modifier une spécialité (admin uniquement)
     * PUT /api/specialties/{id}
     */
    public function update(Request $request, Specialty $specialty): JsonResponse
    {
        $this->authorize('admin');

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255|unique:specialties,name,' . $specialty->id,
            'description' => 'nullable|string',
            'icon' => 'nullable|string|max:50',
        ]);

        $oldValues = $specialty->toArray();
        $specialty->update($validated);

        AuditService::log('update', 'Specialty', $specialty->id, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'data' => $specialty,
            'message' => 'Spécialité modifiée avec succès',
        ]);
    }

    /**
     * Supprimer une spécialité (admin uniquement)
     * DELETE /api/specialties/{id}
     */
    public function destroy(Specialty $specialty): JsonResponse
    {
        $this->authorize('admin');

        // Vérifier qu'aucun médecin n'est lié
        if ($specialty->doctors()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Impossible de supprimer : des médecins sont liés à cette spécialité',
            ], 422);
        }

        $oldValues = $specialty->toArray();
        $specialty->delete();

        AuditService::log('delete', 'Specialty', $specialty->id, $oldValues);

        return response()->json([
            'success' => true,
            'message' => 'Spécialité supprimée avec succès',
        ]);
    }

    /**
     * Vérifier que l'utilisateur est admin
     */
    private function authorize(string $role): void
    {
        if (!auth()->user() || !auth()->user()->hasRole($role)) {
            abort(403, 'Accès non autorisé');
        }
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\PreConsultation;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoctorController extends Controller
{
    /**
     * Lister tous les médecins
     * GET /api/doctors
     */
    public function index(Request $request): JsonResponse
    {
        $query = Doctor::with(['user', 'specialty']);

        // Filtrer par spécialité
        if ($request->has('specialty_id')) {
            $query->where('specialty_id', $request->specialty_id);
        }

        $doctors = $query->get();

        return response()->json([
            'success' => true,
            'data' => $doctors,
        ]);
    }

    /**
     * Afficher un médecin
     * GET /api/doctors/{id}
     */
    public function show(Doctor $doctor): JsonResponse
    {
        $doctor->load(['user', 'specialty']);

        return response()->json([
            'success' => true,
            'data' => $doctor,
        ]);
    }

    /**
     * Créer un profil médecin (admin uniquement)
     * POST /api/doctors
     */
    public function store(Request $request): JsonResponse
    {
        $this->authorizeAdmin();

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id|unique:doctors,user_id',
            'specialty_id' => 'required|exists:specialties,id',
            'bio' => 'nullable|string',
            'license_number' => 'nullable|string|max:50',
        ]);

        $doctor = Doctor::create($validated);
        $doctor->load(['user', 'specialty']);

        AuditService::log('create', 'Doctor', $doctor->id, null, $validated);

        return response()->json([
            'success' => true,
            'data' => $doctor,
            'message' => 'Profil médecin créé avec succès',
        ], 201);
    }

    /**
     * Modifier un profil médecin
     * PUT /api/doctors/{id}
     */
    public function update(Request $request, Doctor $doctor): JsonResponse
    {
        // Seul l'admin ou le médecin lui-même peut modifier
        $user = auth()->user();
        if (!$user->isAdmin() && $user->id !== $doctor->user_id) {
            abort(403, 'Accès non autorisé');
        }

        $validated = $request->validate([
            'specialty_id' => 'sometimes|exists:specialties,id',
            'bio' => 'nullable|string',
            'license_number' => 'nullable|string|max:50',
        ]);

        $oldValues = $doctor->toArray();
        $doctor->update($validated);
        $doctor->load(['user', 'specialty']);

        AuditService::log('update', 'Doctor', $doctor->id, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'data' => $doctor,
            'message' => 'Profil médecin modifié avec succès',
        ]);
    }

    /**
     * Supprimer un profil médecin (admin uniquement)
     * DELETE /api/doctors/{id}
     */
    public function destroy(Doctor $doctor): JsonResponse
    {
        $this->authorizeAdmin();

        $oldValues = $doctor->toArray();
        $doctor->delete();

        AuditService::log('delete', 'Doctor', $doctor->id, $oldValues);

        return response()->json([
            'success' => true,
            'message' => 'Profil médecin supprimé avec succès',
        ]);
    }

    /**
     * Fiches de préconsultation pour le médecin connecté
     * GET /api/doctor/pre-consultations
     *
     * Retourne les préconsultations dont la spécialité suggérée
     * correspond à celle du médecin, paginées et filtrables.
     */
    public function preConsultations(Request $request): JsonResponse
    {
        $user = $request->user();
        $doctor = Doctor::where('user_id', $user->id)->firstOrFail();

        $query = PreConsultation::with(['user:id,name,email,phone', 'symptoms'])
            ->where('suggested_specialty_id', $doctor->specialty_id)
            ->orderByDesc('created_at');

        // Filtre par niveau de confiance
        if ($request->has('min_confidence')) {
            $query->where('confidence_score', '>=', (float) $request->min_confidence);
        }

        // Filtre par date
        if ($request->has('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Recherche par nom patient
        if ($request->has('search')) {
            $search = $request->search;
            $query->whereHas('user', function ($q) use ($search) {
                $q->where('name', 'ilike', "%{$search}%");
            });
        }

        $perPage = $request->input('per_page', 15);
        $preConsultations = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $preConsultations->items(),
            'meta' => [
                'current_page' => $preConsultations->currentPage(),
                'last_page' => $preConsultations->lastPage(),
                'per_page' => $preConsultations->perPage(),
                'total' => $preConsultations->total(),
            ],
        ]);
    }

    private function authorizeAdmin(): void
    {
        if (!auth()->user() || !auth()->user()->isAdmin()) {
            abort(403, 'Accès réservé aux administrateurs');
        }
    }
}

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
     * Lister tous les medecins
     * GET /api/doctors
     */
    public function index(Request $request): JsonResponse
    {
        $query = Doctor::with(['user', 'specialty']);

        // Filtrer par specialite
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
     * Afficher un medecin
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
     * Creer un profil medecin (admin uniquement)
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
            'message' => 'Profil medecin cree avec succes',
        ], 201);
    }

    /**
     * Modifier un profil medecin
     * PUT /api/doctors/{id}
     */
    public function update(Request $request, Doctor $doctor): JsonResponse
    {
        // Seul l'admin ou le medecin lui-meme peut modifier
        $user = auth()->user();
        if (!$user->isAdmin() && $user->id !== $doctor->user_id) {
            abort(403, 'Acces non autorise');
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
            'message' => 'Profil medecin modifie avec succes',
        ]);
    }

    /**
     * Supprimer un profil medecin (admin uniquement)
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
            'message' => 'Profil medecin supprime avec succes',
        ]);
    }

    /**
     * Lister les fiches de pre-consultation des patients du medecin connecte.
     * GET /api/doctor/pre-consultations
     *
     * Retourne les pre-consultations liees aux rendez-vous assignes
     * au medecin authentifie, avec patient, specialite suggeree et symptomes.
     */
    public function preConsultations(Request $request): JsonResponse
    {
        $user = auth()->user();

        // Recuperer le profil Doctor lie a l'utilisateur connecte
        $doctor = Doctor::where('user_id', $user->id)->first();

        if (!$doctor) {
            return response()->json([
                'success' => false,
                'message' => 'Profil medecin introuvable pour cet utilisateur.',
            ], 404);
        }

        // Pre-consultations liees aux RDV de ce medecin
        $preConsultations = PreConsultation::whereHas('appointment', function ($query) use ($doctor) {
                $query->where('doctor_id', $doctor->id);
            })
            ->with([
                'patient:id,name,email,phone',
                'suggestedSpecialty:id,name',
                'symptoms:id,name,category',
                'appointment:id,pre_consultation_id,scheduled_at,status',
            ])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $preConsultations,
        ]);
    }

    private function authorizeAdmin(): void
    {
        if (!auth()->user() || !auth()->user()->isAdmin()) {
            abort(403, 'Acces reserve aux administrateurs');
        }
    }
}

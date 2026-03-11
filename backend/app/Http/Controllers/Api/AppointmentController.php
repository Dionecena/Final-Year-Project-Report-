<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Notification;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Lister les rendez-vous (selon le role)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Appointment::with(['patient', 'doctor.user', 'doctor.specialty', 'specialty', 'preConsultation']);

        if ($user->isPatient()) {
            $query->forPatient($user->id);
        } elseif ($user->isDoctor()) {
            $doctor = Doctor::where('user_id', $user->id)->first();
            if ($doctor) {
                $query->forDoctor($doctor->id);
            }
        }

        $appointments = $query->orderByDesc('created_at')->get();

        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    /**
     * Patient cree un RDV : specialite + motif (pas de medecin)
     * Le RDV est cree en statut "pending" et le patient est notifie.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'specialty_id' => 'required|exists:specialties,id',
            'reason' => 'required|string|max:1000',
            'preferred_date' => 'nullable|date|after:today',
            'pre_consultation_id' => 'nullable|exists:pre_consultations,id',
            'notes' => 'nullable|string|max:500',
        ]);

        $patient = $request->user();

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'specialty_id' => $validated['specialty_id'],
            'reason' => $validated['reason'],
            'pre_consultation_id' => $validated['pre_consultation_id'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
        ]);

        $appointment->load(['specialty']);

        $specialtyName = $appointment->specialty->name ?? 'la specialite demandee';

        // Notifier le patient que sa demande est en attente
        Notification::create([
            'user_id' => $patient->id,
            'type'    => 'appointment',
            'title'   => 'Demande de rendez-vous enregistree',
            'message' => "Votre demande de rendez-vous en {$specialtyName} a ete enregistree. Elle est en attente de confirmation par notre secretariat. Vous serez notifie des qu'un medecin vous sera assigne.",
            'data'    => [
                'appointment_id' => $appointment->id,
                'specialty'      => $specialtyName,
                'action'         => 'pending',
            ],
        ]);

        AuditService::log('create', 'Appointment', $appointment->id, null, [
            'specialty_id' => $appointment->specialty_id,
            'reason' => $appointment->reason,
        ]);

        return response()->json([
            'success' => true,
            'data' => $appointment,
            'message' => 'Votre demande de rendez-vous a ete enregistree avec succes. Elle est en attente de confirmation. Vous serez notifie dans vos notifications et sur votre page de rendez-vous.',
        ], 201);
    }

    /**
     * Detail d'un rendez-vous
     */
    public function show(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        if (!$this->canAccess($user, $appointment)) {
            return response()->json(['message' => 'Acces non autorise'], 403);
        }

        $appointment->load(['patient', 'doctor.user', 'doctor.specialty', 'specialty', 'preConsultation']);

        AuditService::log('view', 'Appointment', $appointment->id);

        return response()->json([
            'success' => true,
            'data' => $appointment,
        ]);
    }

    /**
     * Modifier un rendez-vous
     */
    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        if (!$this->canAccess($user, $appointment)) {
            return response()->json(['message' => 'Acces non autorise'], 403);
        }

        $validated = $request->validate([
            'scheduled_at' => 'nullable|date|after:now',
            'reason' => 'nullable|string|max:1000',
            'notes' => 'nullable|string|max:500',
        ]);

        $old = $appointment->toArray();

        $appointment->update($validated);

        AuditService::log('update', 'Appointment', $appointment->id, $old, $appointment->toArray());

        return response()->json([
            'success' => true,
            'data' => $appointment->fresh(),
            'message' => 'Rendez-vous mis a jour',
        ]);
    }

    /**
     * Supprimer un rendez-vous
     */
    public function destroy(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        if (!$this->canAccess($user, $appointment)) {
            return response()->json(['message' => 'Acces non autorise'], 403);
        }

        if ($appointment->status === 'confirmed') {
            return response()->json(['message' => 'Impossible de supprimer un RDV confirme'], 422);
        }

        AuditService::log('delete', 'Appointment', $appointment->id, $appointment->toArray());

        $appointment->delete();

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous supprime',
        ]);
    }

    /**
     * Verifier si l'utilisateur peut acceder au RDV
     */
    private function canAccess($user, Appointment $appointment): bool
    {
        if ($user->isAdmin() || $user->isSecretary()) {
            return true;
        }

        if ($user->isPatient() && $appointment->patient_id === $user->id) {
            return true;
        }

        if ($user->isDoctor()) {
            $doctor = Doctor::where('user_id', $user->id)->first();
            if ($doctor && $appointment->doctor_id === $doctor->id) {
                return true;
            }
        }

        return false;
    }
}

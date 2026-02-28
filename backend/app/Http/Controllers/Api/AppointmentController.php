<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Lister les rendez-vous (selon le rôle)
     * GET /api/appointments
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $query = Appointment::with(['patient', 'doctor.user', 'doctor.specialty', 'preConsultation']);

        if ($user->isPatient()) {
            $query->forPatient($user->id);
        } elseif ($user->isDoctor()) {
            $doctor = Doctor::where('user_id', $user->id)->first();
            if ($doctor) {
                $query->forDoctor($doctor->id);
            }
        }
        // Admin et secrétaire voient tout

        $appointments = $query->orderByDesc('scheduled_at')->get();

        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    /**
     * Créer un rendez-vous
     * POST /api/appointments
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'pre_consultation_id' => 'nullable|exists:pre_consultations,id',
            'scheduled_at' => 'required|date|after:now',
            'notes' => 'nullable|string|max:500',
        ]);

        $patient = $request->user();

        // Vérifier que le créneau est disponible
        $conflict = Appointment::where('doctor_id', $validated['doctor_id'])
            ->where('scheduled_at', $validated['scheduled_at'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();

        if ($conflict) {
            return response()->json([
                'success' => false,
                'message' => 'Ce créneau est déjà réservé. Veuillez choisir un autre horaire.',
            ], 422);
        }

        $appointment = Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $validated['doctor_id'],
            'pre_consultation_id' => $validated['pre_consultation_id'] ?? null,
            'scheduled_at' => $validated['scheduled_at'],
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        $appointment->load(['patient', 'doctor.user', 'doctor.specialty']);

        AuditService::log('create', 'Appointment', $appointment->id, null, [
            'doctor_id' => $appointment->doctor_id,
            'scheduled_at' => $appointment->scheduled_at,
        ]);

        return response()->json([
            'success' => true,
            'data' => $appointment,
            'message' => 'Rendez-vous créé avec succès. En attente de confirmation.',
        ], 201);
    }

    /**
     * Détail d'un rendez-vous
     * GET /api/appointments/{id}
     */
    public function show(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        // Vérifier les droits d'accès
        if (!$this->canAccess($user, $appointment)) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $appointment->load(['patient', 'doctor.user', 'doctor.specialty', 'preConsultation.suggestedSpecialty']);

        AuditService::log('view', 'Appointment', $appointment->id);

        return response()->json([
            'success' => true,
            'data' => $appointment,
        ]);
    }

    /**
     * Modifier le statut d'un rendez-vous
     * PUT /api/appointments/{id}
     */
    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'status' => 'sometimes|in:confirmed,cancelled,completed',
            'cancellation_reason' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:500',
        ]);

        // Règles de transition de statut
        if (isset($validated['status'])) {
            if ($validated['status'] === 'confirmed' && !$user->isSecretary() && !$user->isAdmin()) {
                return response()->json(['message' => 'Seul le secrétaire peut confirmer un RDV'], 403);
            }
            if ($validated['status'] === 'cancelled' && $user->isPatient() && $user->id !== $appointment->patient_id) {
                return response()->json(['message' => 'Accès non autorisé'], 403);
            }
        }

        $oldValues = $appointment->toArray();
        $appointment->update($validated);

        AuditService::log('update', 'Appointment', $appointment->id, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'data' => $appointment,
            'message' => 'Rendez-vous mis à jour avec succès',
        ]);
    }

    /**
     * Annuler un rendez-vous
     * DELETE /api/appointments/{id}
     */
    public function destroy(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        if (!$this->canAccess($user, $appointment)) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $oldValues = $appointment->toArray();
        $appointment->update([
            'status' => 'cancelled',
            'cancellation_reason' => 'Annulé par ' . $user->role,
        ]);

        AuditService::log('cancel', 'Appointment', $appointment->id, $oldValues);

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous annulé avec succès',
        ]);
    }

    /**
     * Créneaux disponibles d'un médecin pour une date donnée
     * GET /api/doctors/{doctor}/slots?date=2025-03-15
     */
    public function availableSlots(Request $request, Doctor $doctor): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        $date = \Carbon\Carbon::parse($validated['date']);
        $dayOfWeek = $date->dayOfWeek; // 0=Dimanche, 1=Lundi, ...

        // Récupérer le planning du médecin pour ce jour
        $schedule = $doctor->schedules()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->first();

        if (!$schedule) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Le médecin n\'est pas disponible ce jour',
            ]);
        }

        // Générer les créneaux de 30 minutes
        $slots = [];
        $start = \Carbon\Carbon::parse($validated['date'] . ' ' . $schedule->start_time);
        $end = \Carbon\Carbon::parse($validated['date'] . ' ' . $schedule->end_time);

        while ($start->lt($end)) {
            $slotTime = $start->copy();

            // Vérifier si le créneau est déjà pris
            $isTaken = Appointment::where('doctor_id', $doctor->id)
                ->where('scheduled_at', $slotTime)
                ->whereIn('status', ['pending', 'confirmed'])
                ->exists();

            $slots[] = [
                'time' => $slotTime->format('H:i'),
                'datetime' => $slotTime->toISOString(),
                'available' => !$isTaken,
            ];

            $start->addMinutes(30);
        }

        return response()->json([
            'success' => true,
            'data' => $slots,
        ]);
    }

    private function canAccess($user, Appointment $appointment): bool
    {
        if ($user->isAdmin() || $user->isSecretary()) return true;
        if ($user->isPatient() && $user->id === $appointment->patient_id) return true;
        if ($user->isDoctor()) {
            $doctor = Doctor::where('user_id', $user->id)->first();
            return $doctor && $doctor->id === $appointment->doctor_id;
        }
        return false;
    }
}

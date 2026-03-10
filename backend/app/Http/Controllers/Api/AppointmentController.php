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

        AuditService::log('create', 'Appointment', $appointment->id, null, [
            'specialty_id' => $appointment->specialty_id,
            'reason' => $appointment->reason,
        ]);

        return response()->json([
            'success' => true,
            'data' => $appointment,
            'message' => 'Rendez-vous demande avec succes. La secretaire vous assignera un medecin.',
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
     * Modifier le statut d'un rendez-vous
     */
    public function update(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'status' => 'sometimes|in:confirmed,cancelled,completed',
            'cancellation_reason' => 'nullable|string|max:500',
            'notes' => 'nullable|string|max:500',
        ]);

        if (isset($validated['status'])) {
            if ($validated['status'] === 'confirmed' && !$user->isSecretary() && !$user->isAdmin()) {
                return response()->json(['message' => 'Seul le secretaire peut confirmer un RDV'], 403);
            }
            if ($validated['status'] === 'cancelled' && $user->isPatient() && $user->id !== $appointment->patient_id) {
                return response()->json(['message' => 'Acces non autorise'], 403);
            }
        }

        $oldValues = $appointment->toArray();
        $appointment->update($validated);

        AuditService::log('update', 'Appointment', $appointment->id, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'data' => $appointment,
            'message' => 'Rendez-vous mis a jour avec succes',
        ]);
    }

    /**
     * Annuler un rendez-vous
     */
    public function destroy(Request $request, Appointment $appointment): JsonResponse
    {
        $user = $request->user();

        if (!$this->canAccess($user, $appointment)) {
            return response()->json(['message' => 'Acces non autorise'], 403);
        }

        $oldValues = $appointment->toArray();
        $appointment->update([
            'status' => 'cancelled',
            'cancellation_reason' => 'Annule par ' . $user->role,
        ]);

        AuditService::log('cancel', 'Appointment', $appointment->id, $oldValues);

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous annule avec succes',
        ]);
    }

    /**
     * Creneaux disponibles d'un medecin pour une date donnee
     */
    public function availableSlots(Request $request, Doctor $doctor): JsonResponse
    {
        $validated = $request->validate([
            'date' => 'required|date|after_or_equal:today',
        ]);

        $date = \Carbon\Carbon::parse($validated['date']);
        $dayOfWeek = $date->dayOfWeek;

        $schedule = $doctor->schedules()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_available', true)
            ->first();

        if (!$schedule) {
            return response()->json([
                'success' => true,
                'data' => [],
                'message' => 'Le medecin n\'est pas disponible ce jour',
            ]);
        }

        $slots = [];
        $start = \Carbon\Carbon::parse($validated['date'] . ' ' . $schedule->start_time);
        $end = \Carbon\Carbon::parse($validated['date'] . ' ' . $schedule->end_time);

        while ($start->lt($end)) {
            $slotTime = $start->copy();

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
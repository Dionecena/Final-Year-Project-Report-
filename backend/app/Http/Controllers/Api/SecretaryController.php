<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use App\Mail\AppointmentConfirmed;
use App\Mail\AppointmentRejected;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Carbon\Carbon;

class SecretaryController extends Controller
{
    /**
     * Dashboard secretaire : statistiques globales.
     */
    public function dashboard(): JsonResponse
    {
        $today = Carbon::today();

        $stats = [
            'pending_appointments'    => Appointment::where('status', 'pending')->count(),
            'confirmed_today'         => Appointment::where('status', 'confirmed')
                                            ->whereDate('date', $today)
                                            ->count(),
            'total_today'             => Appointment::whereDate('date', $today)->count(),
            'total_patients'          => User::where('role', 'patient')->where('is_active', true)->count(),
            'total_doctors'           => User::where('role', 'doctor')->where('is_active', true)->count(),
            'cancelled_today'         => Appointment::where('status', 'cancelled')
                                            ->whereDate('date', $today)
                                            ->count(),
            'weekly_appointments'     => Appointment::whereBetween('date', [
                                            $today->copy()->startOfWeek(),
                                            $today->copy()->endOfWeek(),
                                        ])->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Liste des rendez-vous en attente de validation.
     */
    public function pendingAppointments(): JsonResponse
    {
        $appointments = Appointment::where('status', 'pending')
            ->with(['patient:id,name,email,phone', 'doctor:id,name,email', 'specialty:id,name'])
            ->orderBy('date', 'asc')
            ->orderBy('time', 'asc')
            ->get();

        return response()->json($appointments);
    }

    /**
     * Valider un rendez-vous et eventuellement assigner un medecin.
     * Envoie un email de confirmation au patient.
     */
    public function validateAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Ce rendez-vous ne peut plus etre valide (statut actuel : ' . $appointment->status . ').'
            ], 422);
        }

        $request->validate([
            'doctor_id' => 'sometimes|exists:users,id',
        ]);

        $appointment->status = 'confirmed';

        if ($request->has('doctor_id')) {
            $doctor = User::where('id', $request->doctor_id)->where('role', 'doctor')->first();
            if (!$doctor) {
                return response()->json(['message' => 'Medecin introuvable.'], 404);
            }
            $appointment->doctor_id = $doctor->id;
        }

        $appointment->save();

        // Charger les relations pour l'email
        $appointment->load(['patient', 'doctor', 'specialty']);

        // Envoyer l'email de confirmation au patient
        try {
            if ($appointment->patient && $appointment->patient->email) {
                Mail::to($appointment->patient->email)
                    ->send(new AppointmentConfirmed($appointment));
            }
        } catch (\Exception $e) {
            // Log l'erreur mais ne pas bloquer la validation
            \Log::warning('Email de confirmation non envoye: ' . $e->getMessage());
        }

        return response()->json([
            'message'     => 'Rendez-vous confirme avec succes.',
            'appointment' => $appointment->load(['patient:id,name,email', 'doctor:id,name,email', 'specialty:id,name']),
        ]);
    }

    /**
     * Rejeter un rendez-vous avec un motif obligatoire.
     * Envoie un email de notification au patient avec le motif.
     */
    public function rejectAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Ce rendez-vous ne peut plus etre rejete (statut actuel : ' . $appointment->status . ').'
            ], 422);
        }

        $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $appointment->status = 'cancelled';
        $appointment->notes = $request->rejection_reason;
        $appointment->save();

        // Charger les relations pour l'email
        $appointment->load(['patient', 'doctor', 'specialty']);

        // Envoyer l'email de rejet au patient
        try {
            if ($appointment->patient && $appointment->patient->email) {
                Mail::to($appointment->patient->email)
                    ->send(new AppointmentRejected($appointment, $request->rejection_reason));
            }
        } catch (\Exception $e) {
            \Log::warning('Email de rejet non envoye: ' . $e->getMessage());
        }

        return response()->json([
            'message'     => 'Rendez-vous rejete.',
            'appointment' => $appointment->load(['patient:id,name,email']),
        ]);
    }

    /**
     * Ouvrir / fermer la prise de rendez-vous en ligne.
     */
    public function toggleOnlineBooking(Request $request): JsonResponse
    {
        $request->validate([
            'enabled' => 'required|boolean',
        ]);

        cache()->forever('online_booking_enabled', $request->enabled);

        return response()->json([
            'message' => $request->enabled
                ? 'La prise de rendez-vous en ligne est activee.'
                : 'La prise de rendez-vous en ligne est desactivee.',
            'online_booking_enabled' => $request->enabled,
        ]);
    }

    /**
     * Verifier si la prise de RDV en ligne est active.
     */
    public function getOnlineBookingStatus(): JsonResponse
    {
        return response()->json([
            'online_booking_enabled' => cache()->get('online_booking_enabled', true),
        ]);
    }
}

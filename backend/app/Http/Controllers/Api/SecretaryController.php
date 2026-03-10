<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
                                            ->whereDate('scheduled_at', $today)
                                            ->count(),
            'total_today'             => Appointment::whereDate('scheduled_at', $today)->count(),
            'total_patients'          => User::where('role', 'patient')->where('is_active', true)->count(),
            'total_doctors'           => User::where('role', 'doctor')->where('is_active', true)->count(),
            'cancelled_today'         => Appointment::where('status', 'cancelled')
                                            ->whereDate('scheduled_at', $today)
                                            ->count(),
            'weekly_appointments'     => Appointment::whereBetween('scheduled_at', [
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
            ->with([
                'patient:id,name,email,phone',
                'doctor.user:id,name,email',
                'doctor.specialty:id,name',
            ])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return response()->json($appointments);
    }

    /**
     * Valider un rendez-vous et eventuellement assigner un medecin.
     */
    public function validateAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Ce rendez-vous ne peut plus etre valide (statut actuel : ' . $appointment->status . ').'
            ], 422);
        }

        $request->validate([
            'doctor_id' => 'sometimes|exists:doctors,id',
        ]);

        $appointment->status = 'confirmed';

        if ($request->has('doctor_id')) {
            $doctor = Doctor::find($request->doctor_id);
            if (!$doctor) {
                return response()->json(['message' => 'Medecin introuvable.'], 404);
            }
            $appointment->doctor_id = $doctor->id;
        }

        $appointment->save();

        return response()->json([
            'message'     => 'Rendez-vous confirme avec succes.',
            'appointment' => $appointment->load([
                'patient:id,name,email',
                'doctor.user:id,name,email',
                'doctor.specialty:id,name',
            ]),
        ]);
    }

    /**
     * Rejeter un rendez-vous avec un motif obligatoire.
     */
    public function rejectAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Ce rendez-vous ne peut plus etre rejete (statut actuel : ' . $appointment->status . ').'
            ], 422);
        }

        $request->validate([
            'cancellation_reason' => 'required|string|max:500',
        ]);

        $appointment->status = 'cancelled';
        $appointment->cancellation_reason = $request->cancellation_reason;
        $appointment->save();

        return response()->json([
            'message'     => 'Rendez-vous rejete.',
            'appointment' => $appointment->load(['patient:id,name,email']),
        ]);
    }

    /**
     * Ouvrir / fermer la prise de rendez-vous en ligne.
     * Stocke un flag dans le cache (ou config).
     */
    public function toggleOnlineBooking(Request $request): JsonResponse
    {
        $request->validate([
            'enabled' => 'required|boolean',
        ]);

        // Utilise le cache Laravel pour stocker le flag
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
    public function onlineBookingStatus(): JsonResponse
    {
        return response()->json([
            'online_booking_enabled' => cache()->get('online_booking_enabled', true),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SecretaryController extends Controller
{
    /**
     * Statistiques globales pour le dashboard secretaire.
     * GET /api/secretary/stats
     */
    public function stats(): JsonResponse
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

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }

    /**
     * Liste des rendez-vous en attente de validation.
     * GET /api/secretary/appointments
     */
    public function pendingAppointments(): JsonResponse
    {
        $appointments = Appointment::where('status', 'pending')
            ->with([
                'user:id,name,email,phone',
                'doctor.user:id,name,email',
                'doctor.specialty:id,name',
            ])
            ->orderBy('scheduled_at', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $appointments,
        ]);
    }

    /**
     * Valider un rendez-vous et eventuellement assigner un medecin.
     * PUT /api/secretary/appointments/{appointment}/validate
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
            $appointment->doctor_id = $request->doctor_id;
        }

        $appointment->save();

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous confirme avec succes.',
            'data' => $appointment->load([
                'user:id,name,email',
                'doctor.user:id,name,email',
                'doctor.specialty:id,name',
            ]),
        ]);
    }

    /**
     * Rejeter un rendez-vous avec un motif obligatoire.
     * PUT /api/secretary/appointments/{appointment}/reject
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

        return response()->json([
            'success' => true,
            'message' => 'Rendez-vous rejete.',
            'data' => $appointment->load(['user:id,name,email']),
        ]);
    }

    /**
     * Ouvrir / fermer la prise de rendez-vous en ligne.
     * PUT /api/secretary/online-booking-status
     */
    public function toggleOnlineBooking(Request $request): JsonResponse
    {
        $request->validate([
            'enabled' => 'required|boolean',
        ]);

        cache()->forever('online_booking_enabled', $request->enabled);

        return response()->json([
            'success' => true,
            'message' => $request->enabled
                ? 'La prise de rendez-vous en ligne est activee.'
                : 'La prise de rendez-vous en ligne est desactivee.',
            'online_booking_enabled' => $request->enabled,
        ]);
    }

    /**
     * Verifier si la prise de RDV en ligne est active.
     * GET /api/secretary/online-booking-status
     */
    public function onlineBookingStatus(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'online_booking_enabled' => cache()->get('online_booking_enabled', true),
        ]);
    }
}

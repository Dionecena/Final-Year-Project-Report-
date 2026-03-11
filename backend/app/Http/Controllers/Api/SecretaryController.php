<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Notification;
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
                'specialty:id,name',
            ])
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($appointments);
    }

    /**
     * Medecins disponibles pour une specialite donnee.
     * GET /api/secretary/doctors-by-specialty/{specialtyId}
     */
    public function doctorsBySpecialty(int $specialtyId): JsonResponse
    {
        $doctors = Doctor::where('specialty_id', $specialtyId)
            ->with(['user:id,name,email', 'schedules'])
            ->get()
            ->map(function ($doctor) {
                return [
                    'id' => $doctor->id,
                    'name' => $doctor->user->name ?? 'N/A',
                    'email' => $doctor->user->email ?? '',
                    'schedules' => $doctor->schedules->map(function ($s) {
                        return [
                            'day_of_week' => $s->day_of_week,
                            'start_time' => $s->start_time,
                            'end_time' => $s->end_time,
                        ];
                    }),
                ];
            });

        return response()->json($doctors);
    }

    /**
     * Confirmer un rendez-vous en attente.
     * PUT /api/secretary/appointments/{id}/confirm
     */
    public function confirmAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'pending') {
            return response()->json(['error' => 'Ce rendez-vous n\'est pas en attente'], 422);
        }

        $validated = $request->validate([
            'doctor_id'     => 'required|exists:doctors,id',
            'scheduled_at'  => 'required|date|after:now',
        ]);

        $appointment->update([
            'doctor_id'    => $validated['doctor_id'],
            'scheduled_at' => $validated['scheduled_at'],
            'status'       => 'confirmed',
        ]);

        $appointment->load(['patient:id,name', 'doctor.user:id,name', 'specialty:id,name']);

        // Notifier le patient que son RDV est confirme
        $doctorName = $appointment->doctor->user->name ?? 'un medecin';
        $specialtyName = $appointment->specialty->name ?? '';
        $scheduledAt = Carbon::parse($appointment->scheduled_at)->format('d/m/Y \u00e0 H:i');

        Notification::create([
            'user_id' => $appointment->patient_id,
            'type'    => 'appointment',
            'title'   => 'Rendez-vous confirm\u00e9',
            'message' => "Votre rendez-vous en {$specialtyName} avec Dr. {$doctorName} est confirm\u00e9 pour le {$scheduledAt}.",
            'data'    => [
                'appointment_id' => $appointment->id,
                'doctor_name'    => $doctorName,
                'scheduled_at'   => $appointment->scheduled_at,
                'action'         => 'confirmed',
            ],
        ]);

        return response()->json([
            'message' => 'Rendez-vous confirme avec succes',
            'appointment' => $appointment,
        ]);
    }

    /**
     * Refuser / annuler un rendez-vous.
     * PUT /api/secretary/appointments/{id}/cancel
     */
    public function cancelAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        if (in_array($appointment->status, ['completed', 'cancelled'])) {
            return response()->json(['error' => 'Ce rendez-vous ne peut pas etre annule'], 422);
        }

        $validated = $request->validate([
            'cancellation_reason' => 'nullable|string|max:500',
        ]);

        $appointment->update([
            'status'             => 'cancelled',
            'cancellation_reason' => $validated['cancellation_reason'] ?? null,
        ]);

        // Notifier le patient que son RDV est annul\u00e9
        Notification::create([
            'user_id' => $appointment->patient_id,
            'type'    => 'appointment',
            'title'   => 'Rendez-vous annul\u00e9',
            'message' => 'Votre rendez-vous a \u00e9t\u00e9 annul\u00e9.' . ($validated['cancellation_reason'] ? ' Raison : ' . $validated['cancellation_reason'] : ''),
            'data'    => [
                'appointment_id'     => $appointment->id,
                'cancellation_reason' => $validated['cancellation_reason'] ?? null,
                'action'             => 'cancelled',
            ],
        ]);

        return response()->json([
            'message' => 'Rendez-vous annule',
            'appointment' => $appointment->fresh(),
        ]);
    }

    /**
     * Historique des rendez-vous (tous statuts).
     */
    public function appointmentHistory(Request $request): JsonResponse
    {
        $query = Appointment::with([
            'patient:id,name,email,phone',
            'doctor.user:id,name',
            'specialty:id,name',
        ])->orderBy('scheduled_at', 'desc');

        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        if ($request->has('date_from')) {
            $query->whereDate('scheduled_at', '>=', $request->date_from);
        }

        if ($request->has('date_to')) {
            $query->whereDate('scheduled_at', '<=', $request->date_to);
        }

        return response()->json($query->paginate(20));
    }
}

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
                            'is_available' => $s->is_available,
                        ];
                    }),
                ];
            });

        return response()->json($doctors);
    }

    /**
     * Assigner un medecin et une date a un RDV pending.
     * PUT /api/secretary/appointments/{appointment}/assign
     */
    public function assignDoctor(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Ce rendez-vous ne peut plus etre modifie (statut actuel : ' . $appointment->status . ').'
            ], 422);
        }

        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'scheduled_at' => 'required|date|after:now',
        ]);

        $doctor = Doctor::with('specialty')->findOrFail($validated['doctor_id']);

        // Verifier que le medecin est de la bonne specialite
        if ($appointment->specialty_id && $doctor->specialty_id !== $appointment->specialty_id) {
            return response()->json([
                'message' => 'Ce medecin n\'est pas de la specialite demandee.',
            ], 422);
        }

        // Verifier que le creneau n'est pas deja pris
        $conflict = Appointment::where('doctor_id', $doctor->id)
            ->where('scheduled_at', $validated['scheduled_at'])
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('id', '!=', $appointment->id)
            ->exists();

        if ($conflict) {
            return response()->json([
                'message' => 'Ce creneau est deja reserve pour ce medecin.',
            ], 422);
        }

        $appointment->update([
            'doctor_id' => $doctor->id,
            'scheduled_at' => $validated['scheduled_at'],
            'status' => 'confirmed',
        ]);

        return response()->json([
            'message' => 'Medecin assigne et rendez-vous confirme.',
            'appointment' => $appointment->load([
                'patient:id,name,email',
                'doctor.user:id,name,email',
                'doctor.specialty:id,name',
                'specialty:id,name',
            ]),
        ]);
    }

    /**
     * Valider un rendez-vous (confirmer sans changer de medecin).
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
            'scheduled_at' => 'sometimes|date|after:now',
        ]);

        $appointment->status = 'confirmed';

        if ($request->has('doctor_id')) {
            $appointment->doctor_id = $request->doctor_id;
        }
        if ($request->has('scheduled_at')) {
            $appointment->scheduled_at = $request->scheduled_at;
        }

        $appointment->save();

        return response()->json([
            'message'     => 'Rendez-vous confirme avec succes.',
            'appointment' => $appointment->load([
                'patient:id,name,email',
                'doctor.user:id,name,email',
                'doctor.specialty:id,name',
                'specialty:id,name',
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
    public function onlineBookingStatus(): JsonResponse
    {
        return response()->json([
            'online_booking_enabled' => cache()->get('online_booking_enabled', true),
        ]);
    }
}

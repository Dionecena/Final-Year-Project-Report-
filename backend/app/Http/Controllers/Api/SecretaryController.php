<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Doctor;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
                    'id'        => $doctor->id,
                    'name'      => $doctor->user->name ?? 'N/A',
                    'email'     => $doctor->user->email ?? '',
                    'schedules' => $doctor->schedules->map(function ($s) {
                        return [
                            'day_of_week' => $s->day_of_week,
                            'start_time'  => $s->start_time,
                            'end_time'    => $s->end_time,
                        ];
                    }),
                ];
            });

        return response()->json($doctors);
    }

    // =========================================================
    //  ASSIGN DOCTOR  (pending -> pending, assigne medecin + creneau)
    // =========================================================

    /**
     * Assigner un medecin et un creneau a un RDV en attente.
     * Le statut reste "pending" -- la secretaire devra ensuite valider.
     * PUT /api/secretary/appointments/{appointment}/assign
     */
    public function assignDoctor(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'pending') {
            return response()->json(['error' => 'Ce rendez-vous n\'est pas en attente'], 422);
        }

        $validated = $request->validate([
            'doctor_id'    => 'required|exists:doctors,id',
            'scheduled_at' => 'required|date|after:now',
        ]);

        $appointment->update([
            'doctor_id'    => $validated['doctor_id'],
            'scheduled_at' => $validated['scheduled_at'],
        ]);

        $appointment->load(['patient:id,name', 'doctor.user:id,name', 'specialty:id,name']);

        $doctorName    = $appointment->doctor->user->name ?? 'un medecin';
        $specialtyName = $appointment->specialty->name ?? '';
        $scheduledAt   = Carbon::parse($appointment->scheduled_at)->format('d/m/Y \a H:i');

        // Notifier le patient qu'un medecin a ete assigne
        Notification::create([
            'user_id' => $appointment->patient_id,
            'type'    => 'appointment',
            'title'   => 'Medecin assigne a votre rendez-vous',
            'message' => "Dr. {$doctorName} ({$specialtyName}) vous a ete assigne pour le {$scheduledAt}. Votre rendez-vous est en attente de validation finale.",
            'data'    => [
                'appointment_id' => $appointment->id,
                'doctor_name'    => $doctorName,
                'scheduled_at'   => $appointment->scheduled_at,
                'action'         => 'doctor_assigned',
            ],
        ]);

        return response()->json([
            'message'     => 'Medecin assigne avec succes',
            'appointment' => $appointment,
        ]);
    }

    // =========================================================
    //  VALIDATE  (pending -> confirmed)
    // =========================================================

    /**
     * Valider un rendez-vous (passe a confirmed).
     * Si pas encore de medecin/creneau, on peut les fournir ici.
     * PUT /api/secretary/appointments/{appointment}/validate
     */
    public function validateAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'pending') {
            return response()->json(['error' => 'Ce rendez-vous n\'est pas en attente'], 422);
        }

        // Si doctor_id/scheduled_at fournis, on les met a jour
        $rules = [];
        if (!$appointment->doctor_id || $request->has('doctor_id')) {
            $rules['doctor_id'] = 'required|exists:doctors,id';
        }
        if (!$appointment->scheduled_at || $request->has('scheduled_at')) {
            $rules['scheduled_at'] = 'required|date|after:now';
        }

        $validated = $request->validate($rules);

        $updateData = ['status' => 'confirmed'];
        if (isset($validated['doctor_id'])) {
            $updateData['doctor_id'] = $validated['doctor_id'];
        }
        if (isset($validated['scheduled_at'])) {
            $updateData['scheduled_at'] = $validated['scheduled_at'];
        }

        // Verifier qu'on a bien un medecin et un creneau avant de confirmer
        $finalDoctorId    = $updateData['doctor_id'] ?? $appointment->doctor_id;
        $finalScheduledAt = $updateData['scheduled_at'] ?? $appointment->scheduled_at;

        if (!$finalDoctorId || !$finalScheduledAt) {
            return response()->json([
                'error' => 'Un medecin et un creneau doivent etre assignes avant de valider le rendez-vous.',
            ], 422);
        }

        $appointment->update($updateData);
        $appointment->load(['patient:id,name', 'doctor.user:id,name', 'specialty:id,name']);

        $doctorName    = $appointment->doctor->user->name ?? 'un medecin';
        $specialtyName = $appointment->specialty->name ?? '';
        $scheduledAt   = Carbon::parse($appointment->scheduled_at)->format('d/m/Y \a H:i');

        Notification::create([
            'user_id' => $appointment->patient_id,
            'type'    => 'appointment',
            'title'   => 'Rendez-vous confirme',
            'message' => "Votre rendez-vous en {$specialtyName} avec Dr. {$doctorName} est confirme pour le {$scheduledAt}.",
            'data'    => [
                'appointment_id' => $appointment->id,
                'doctor_name'    => $doctorName,
                'scheduled_at'   => $appointment->scheduled_at,
                'action'         => 'confirmed',
            ],
        ]);

        return response()->json([
            'message'     => 'Rendez-vous valide avec succes',
            'appointment' => $appointment,
        ]);
    }

    // =========================================================
    //  REJECT  (pending -> rejected)
    // =========================================================

    /**
     * Rejeter un rendez-vous en attente.
     * PUT /api/secretary/appointments/{appointment}/reject
     */
    public function rejectAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        if ($appointment->status !== 'pending') {
            return response()->json(['error' => 'Ce rendez-vous n\'est pas en attente'], 422);
        }

        $validated = $request->validate([
            'rejection_reason' => 'required|string|max:500',
        ]);

        $appointment->update([
            'status'              => 'rejected',
            'cancellation_reason' => $validated['rejection_reason'],
        ]);

        Notification::create([
            'user_id' => $appointment->patient_id,
            'type'    => 'appointment',
            'title'   => 'Rendez-vous refuse',
            'message' => 'Votre demande de rendez-vous a ete refusee. Raison : ' . $validated['rejection_reason'],
            'data'    => [
                'appointment_id'  => $appointment->id,
                'rejection_reason' => $validated['rejection_reason'],
                'action'          => 'rejected',
            ],
        ]);

        return response()->json([
            'message'     => 'Rendez-vous rejete',
            'appointment' => $appointment->fresh(),
        ]);
    }

    // =========================================================
    //  CONFIRM  (legacy -- delegue vers validateAppointment)
    // =========================================================

    /**
     * Confirmer un rendez-vous en attente (legacy).
     * PUT /api/secretary/appointments/{id}/confirm
     */
    public function confirmAppointment(Request $request, Appointment $appointment): JsonResponse
    {
        return $this->validateAppointment($request, $appointment);
    }

    // =========================================================
    //  CANCEL  (any -> cancelled)
    // =========================================================

    /**
     * Annuler un rendez-vous.
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
            'status'              => 'cancelled',
            'cancellation_reason' => $validated['cancellation_reason'] ?? null,
        ]);

        Notification::create([
            'user_id' => $appointment->patient_id,
            'type'    => 'appointment',
            'title'   => 'Rendez-vous annule',
            'message' => 'Votre rendez-vous a ete annule.' . (($validated['cancellation_reason'] ?? null) ? ' Raison : ' . $validated['cancellation_reason'] : ''),
            'data'    => [
                'appointment_id'     => $appointment->id,
                'cancellation_reason' => $validated['cancellation_reason'] ?? null,
                'action'             => 'cancelled',
            ],
        ]);

        return response()->json([
            'message'     => 'Rendez-vous annule',
            'appointment' => $appointment->fresh(),
        ]);
    }

    // =========================================================
    //  ONLINE BOOKING TOGGLE
    // =========================================================

    /**
     * Activer / desactiver la reservation en ligne.
     * PUT /api/secretary/online-booking/toggle
     */
    public function toggleOnlineBooking(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'enabled' => 'required|boolean',
        ]);

        DB::table('settings')->updateOrInsert(
            ['key' => 'online_booking_enabled'],
            ['value' => $validated['enabled'] ? '1' : '0', 'updated_at' => now()]
        );

        return response()->json([
            'message'                => $validated['enabled'] ? 'Reservation en ligne activee' : 'Reservation en ligne desactivee',
            'online_booking_enabled' => $validated['enabled'],
        ]);
    }

    /**
     * Statut actuel de la reservation en ligne.
     * GET /api/secretary/online-booking/status
     */
    public function onlineBookingStatus(): JsonResponse
    {
        $setting = DB::table('settings')->where('key', 'online_booking_enabled')->first();
        $enabled = $setting ? (bool) $setting->value : true;

        return response()->json([
            'online_booking_enabled' => $enabled,
        ]);
    }

    // =========================================================
    //  HISTORIQUE
    // =========================================================

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

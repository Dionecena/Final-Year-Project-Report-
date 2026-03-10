<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Schedule;
use App\Models\Doctor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AppointmentController extends Controller
{
    /**
     * Liste des RDV du patient connecte
     */
    public function index()
    {
        $appointments = Appointment::where('patient_id', Auth::id())
            ->with(['doctor.user', 'doctor.specialty', 'specialty', 'preConsultation'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($appointments);
    }

    /**
     * Patient cree un RDV : specialite + motif (pas de medecin)
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'specialty_id' => 'required|exists:specialties,id',
            'reason' => 'required|string|max:1000',
            'preferred_date' => 'nullable|date|after:today',
            'pre_consultation_id' => 'nullable|exists:pre_consultations,id',
            'notes' => 'nullable|string',
        ]);

        $appointment = Appointment::create([
            'patient_id' => Auth::id(),
            'specialty_id' => $validated['specialty_id'],
            'reason' => $validated['reason'],
            'pre_consultation_id' => $validated['pre_consultation_id'] ?? null,
            'notes' => $validated['notes'] ?? null,
            'status' => 'pending',
            // doctor_id et scheduled_at seront assignes par la secretaire
        ]);

        $appointment->load(['specialty']);

        return response()->json([
            'message' => 'Rendez-vous demande avec succes. La secretaire vous assignera un medecin.',
            'appointment' => $appointment,
        ], 201);
    }

    /**
     * Detail d'un RDV
     */
    public function show($id)
    {
        $appointment = Appointment::where('patient_id', Auth::id())
            ->with(['doctor.user', 'doctor.specialty', 'specialty', 'preConsultation'])
            ->findOrFail($id);

        return response()->json($appointment);
    }

    /**
     * Patient annule son RDV (seulement si pending)
     */
    public function cancel(Request $request, $id)
    {
        $appointment = Appointment::where('patient_id', Auth::id())
            ->findOrFail($id);

        if ($appointment->status !== 'pending') {
            return response()->json([
                'message' => 'Seuls les rendez-vous en attente peuvent etre annules.',
            ], 422);
        }

        $validated = $request->validate([
            'cancellation_reason' => 'nullable|string|max:500',
        ]);

        $appointment->update([
            'status' => 'cancelled',
            'cancellation_reason' => $validated['cancellation_reason'] ?? null,
        ]);

        return response()->json([
            'message' => 'Rendez-vous annule.',
            'appointment' => $appointment,
        ]);
    }
}

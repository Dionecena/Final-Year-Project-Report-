<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Doctor;
use App\Models\Schedule;
use App\Services\AuditService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    /**
     * Lister les plannings d'un médecin
     * GET /api/doctors/{doctor}/schedules
     */
    public function index(Doctor $doctor): JsonResponse
    {
        $schedules = Schedule::where('doctor_id', $doctor->id)
            ->orderBy('day_of_week')
            ->orderBy('start_time')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules,
        ]);
    }

    /**
     * Créer un créneau de planning
     * POST /api/schedules
     */
    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'doctor_id' => 'required|exists:doctors,id',
            'day_of_week' => 'required|integer|between:0,6',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'is_available' => 'boolean',
        ]);

        // Seul le médecin lui-même, le secrétaire ou l'admin peut créer
        $doctor = Doctor::find($validated['doctor_id']);
        if (!$user->isAdmin() && !$user->isSecretary() && $user->id !== $doctor->user_id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $schedule = Schedule::create($validated);

        AuditService::log('create', 'Schedule', $schedule->id, null, $validated);

        return response()->json([
            'success' => true,
            'data' => $schedule,
            'message' => 'Créneau créé avec succès',
        ], 201);
    }

    /**
     * Modifier un créneau
     * PUT /api/schedules/{id}
     */
    public function update(Request $request, Schedule $schedule): JsonResponse
    {
        $user = $request->user();
        $doctor = Doctor::find($schedule->doctor_id);

        if (!$user->isAdmin() && !$user->isSecretary() && $user->id !== $doctor->user_id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $validated = $request->validate([
            'day_of_week' => 'sometimes|integer|between:0,6',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i',
            'is_available' => 'sometimes|boolean',
        ]);

        $oldValues = $schedule->toArray();
        $schedule->update($validated);

        AuditService::log('update', 'Schedule', $schedule->id, $oldValues, $validated);

        return response()->json([
            'success' => true,
            'data' => $schedule,
            'message' => 'Créneau modifié avec succès',
        ]);
    }

    /**
     * Supprimer un créneau
     * DELETE /api/schedules/{id}
     */
    public function destroy(Request $request, Schedule $schedule): JsonResponse
    {
        $user = $request->user();
        $doctor = Doctor::find($schedule->doctor_id);

        if (!$user->isAdmin() && !$user->isSecretary() && $user->id !== $doctor->user_id) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $oldValues = $schedule->toArray();
        $schedule->delete();

        AuditService::log('delete', 'Schedule', $schedule->id, $oldValues);

        return response()->json([
            'success' => true,
            'message' => 'Créneau supprimé avec succès',
        ]);
    }
}

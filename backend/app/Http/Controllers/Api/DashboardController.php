<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\AuditLog;
use App\Models\Doctor;
use App\Models\PreConsultation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Statistiques globales pour le dashboard admin
     * GET /api/admin/dashboard
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin() && !$user->isSecretary()) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $today = now()->startOfDay();
        $thisWeek = now()->startOfWeek();
        $thisMonth = now()->startOfMonth();

        // KPIs principaux
        $totalAppointmentsToday = Appointment::where('scheduled_at', '>=', $today)->count();
        $totalAppointmentsWeek = Appointment::where('scheduled_at', '>=', $thisWeek)->count();
        $totalAppointmentsMonth = Appointment::where('scheduled_at', '>=', $thisMonth)->count();
        $totalPatients = User::where('role', 'patient')->where('is_active', true)->count();
        $totalDoctors = Doctor::count();
        $newPatientsThisMonth = User::where('role', 'patient')
            ->where('created_at', '>=', $thisMonth)
            ->count();

        // Taux d'utilisation de la préconsultation
        $totalAppointmentsAllTime = Appointment::count();
        $appointmentsWithPreConsultation = Appointment::whereNotNull('pre_consultation_id')->count();
        $preconsultationRate = $totalAppointmentsAllTime > 0
            ? round(($appointmentsWithPreConsultation / $totalAppointmentsAllTime) * 100, 1)
            : 0;

        // Taux d'annulation
        $cancelledAppointments = Appointment::where('status', 'cancelled')
            ->where('created_at', '>=', $thisMonth)
            ->count();
        $totalThisMonth = Appointment::where('created_at', '>=', $thisMonth)->count();
        $cancellationRate = $totalThisMonth > 0
            ? round(($cancelledAppointments / $totalThisMonth) * 100, 1)
            : 0;

        // RDV par spécialité (top 5)
        $appointmentsBySpecialty = DB::table('appointments')
            ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
            ->join('specialties', 'doctors.specialty_id', '=', 'specialties.id')
            ->select('specialties.name', DB::raw('COUNT(*) as count'))
            ->where('appointments.created_at', '>=', $thisMonth)
            ->groupBy('specialties.name')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        // RDV par jour (30 derniers jours)
        $appointmentsByDay = DB::table('appointments')
            ->select(
                DB::raw('DATE(scheduled_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('scheduled_at', '>=', now()->subDays(30))
            ->groupBy(DB::raw('DATE(scheduled_at)'))
            ->orderBy('date')
            ->get();

        // Top 5 médecins
        $topDoctors = DB::table('appointments')
            ->join('doctors', 'appointments.doctor_id', '=', 'doctors.id')
            ->join('users', 'doctors.user_id', '=', 'users.id')
            ->select('users.name', DB::raw('COUNT(*) as count'))
            ->where('appointments.created_at', '>=', $thisMonth)
            ->groupBy('users.name')
            ->orderByDesc('count')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total_appointments_today' => $totalAppointmentsToday,
                'total_appointments_week' => $totalAppointmentsWeek,
                'total_appointments_month' => $totalAppointmentsMonth,
                'total_patients' => $totalPatients,
                'total_doctors' => $totalDoctors,
                'new_patients_this_month' => $newPatientsThisMonth,
                'preconsultation_usage_rate' => $preconsultationRate,
                'cancellation_rate' => $cancellationRate,
                'appointments_by_specialty' => $appointmentsBySpecialty,
                'appointments_by_day' => $appointmentsByDay,
                'top_doctors' => $topDoctors,
            ],
        ]);
    }

    /**
     * Statistiques pour le dashboard médecin
     * GET /api/doctor/dashboard
     */
    public function doctorStats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isDoctor()) {
            return response()->json(['message' => 'Accès non autorisé'], 403);
        }

        $doctor = $user->doctor;
        if (!$doctor) {
            return response()->json(['message' => 'Profil médecin non trouvé'], 404);
        }

        $today = now()->startOfDay();
        $thisMonth = now()->startOfMonth();

        $appointmentsToday = Appointment::forDoctor($doctor->id)
            ->where('scheduled_at', '>=', $today)
            ->where('scheduled_at', '<', now()->endOfDay())
            ->with(['patient', 'preConsultation'])
            ->orderBy('scheduled_at')
            ->get();

        $appointmentsThisMonth = Appointment::forDoctor($doctor->id)
            ->where('created_at', '>=', $thisMonth)
            ->count();

        $pendingAppointments = Appointment::forDoctor($doctor->id)
            ->pending()
            ->count();

        $preconsultationsReceived = Appointment::forDoctor($doctor->id)
            ->whereNotNull('pre_consultation_id')
            ->where('created_at', '>=', $thisMonth)
            ->count();

        return response()->json([
            'success' => true,
            'data' => [
                'appointments_today' => $appointmentsToday,
                'appointments_this_month' => $appointmentsThisMonth,
                'pending_appointments' => $pendingAppointments,
                'preconsultations_received' => $preconsultationsReceived,
            ],
        ]);
    }
}

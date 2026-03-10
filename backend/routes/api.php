<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PreConsultationController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\SecretaryController;
use App\Http\Controllers\Api\SpecialtyController;
use App\Http\Controllers\Api\SymptomController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes API -- MediConsult
|--------------------------------------------------------------------------
*/

// ==========================================
// Routes publiques
// ==========================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1'); // 5 tentatives/minute anti brute-force
});

// Specialites -- lecture publique
Route::get('/specialties', [SpecialtyController::class, 'index']);
Route::get('/specialties/{specialty}', [SpecialtyController::class, 'show']);

// Symptomes -- lecture publique
Route::get('/symptoms', [SymptomController::class, 'index']);
Route::get('/symptoms/categories', [SymptomController::class, 'categories']);

// Medecins -- lecture publique
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);
Route::get('/doctors/{doctor}/schedules', [ScheduleController::class, 'index']);
Route::get('/doctors/{doctor}/slots', [AppointmentController::class, 'availableSlots']);

// Statut de la prise de RDV en ligne (public)
Route::get('/online-booking-status', [SecretaryController::class, 'onlineBookingStatus']);

// ==========================================
// Routes protegees (token Sanctum requis)
// ==========================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
    });

    // Specialites -- ecriture (admin)
    Route::post('/specialties', [SpecialtyController::class, 'store']);
    Route::put('/specialties/{specialty}', [SpecialtyController::class, 'update']);
    Route::delete('/specialties/{specialty}', [SpecialtyController::class, 'destroy']);

    // Medecins -- ecriture
    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::put('/doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy']);

    // ==========================================
    // Phase 2 -- Preconsultation
    // ==========================================
    Route::prefix('pre-consultations')->group(function () {
        Route::get('/', [PreConsultationController::class, 'index']);
        Route::post('/', [PreConsultationController::class, 'store']);
        Route::get('/{preConsultation}', [PreConsultationController::class, 'show']);
        Route::put('/{preConsultation}', [PreConsultationController::class, 'update']);
        Route::delete('/{preConsultation}', [PreConsultationController::class, 'destroy']);
        Route::post('/{preConsultation}/analyze', [PreConsultationController::class, 'analyze']);
    });

    // Symptomes -- ecriture (admin)
    Route::post('/symptoms', [SymptomController::class, 'store']);
    Route::put('/symptoms/{symptom}', [SymptomController::class, 'update']);
    Route::delete('/symptoms/{symptom}', [SymptomController::class, 'destroy']);

    // ==========================================
    // Phase 3 -- Rendez-vous
    // ==========================================
    Route::prefix('appointments')->group(function () {
        Route::get('/', [AppointmentController::class, 'index']);
        Route::post('/', [AppointmentController::class, 'store']);
        Route::get('/{appointment}', [AppointmentController::class, 'show']);
        Route::put('/{appointment}', [AppointmentController::class, 'update']);
        Route::patch('/{appointment}/cancel', [AppointmentController::class, 'cancel']);
        Route::patch('/{appointment}/status', [AppointmentController::class, 'updateStatus']);
    });

    // Plannings medecins
    Route::prefix('schedules')->group(function () {
        Route::post('/', [ScheduleController::class, 'store']);
        Route::put('/{schedule}', [ScheduleController::class, 'update']);
        Route::delete('/{schedule}', [ScheduleController::class, 'destroy']);
    });

    // ==========================================
    // Phase 4 -- Dashboard & Administration
    // ==========================================
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/appointments/upcoming', [DashboardController::class, 'upcomingAppointments']);
        Route::get('/appointments/history', [DashboardController::class, 'appointmentHistory']);
    });

    // Gestion utilisateurs (admin)
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::put('/{user}', [UserController::class, 'update']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
        Route::patch('/{user}/role', [UserController::class, 'updateRole']);
    });

    // Journal d'audit (admin)
    Route::get('/audit-logs', [AuditLogController::class, 'index']);

    // ==========================================
    // Phase 5 -- Espace Secretaire
    // ==========================================
    Route::prefix('secretary')->group(function () {
        Route::get('/dashboard', [SecretaryController::class, 'dashboard']);
        Route::get('/pending-appointments', [SecretaryController::class, 'pendingAppointments']);
        Route::patch('/appointments/{appointment}/validate', [SecretaryController::class, 'validateAppointment']);
        Route::patch('/appointments/{appointment}/reject', [SecretaryController::class, 'rejectAppointment']);
        Route::post('/toggle-online-booking', [SecretaryController::class, 'toggleOnlineBooking']);
    });
});

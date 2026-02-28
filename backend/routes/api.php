<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\PreConsultationController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\SpecialtyController;
use App\Http\Controllers\Api\SymptomController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Routes API — MediConsult
|--------------------------------------------------------------------------
*/

// ============================================
// Routes publiques
// ============================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1'); // 5 tentatives/minute anti brute-force
});

// Spécialités — lecture publique
Route::get('/specialties', [SpecialtyController::class, 'index']);
Route::get('/specialties/{specialty}', [SpecialtyController::class, 'show']);

// Symptômes — lecture publique
Route::get('/symptoms', [SymptomController::class, 'index']);
Route::get('/symptoms/categories', [SymptomController::class, 'categories']);

// Médecins — lecture publique
Route::get('/doctors', [DoctorController::class, 'index']);
Route::get('/doctors/{doctor}', [DoctorController::class, 'show']);
Route::get('/doctors/{doctor}/schedules', [ScheduleController::class, 'index']);
Route::get('/doctors/{doctor}/slots', [AppointmentController::class, 'availableSlots']);

// ============================================
// Routes protégées (token Sanctum requis)
// ============================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
    });

    // Spécialités — écriture (admin)
    Route::post('/specialties', [SpecialtyController::class, 'store']);
    Route::put('/specialties/{specialty}', [SpecialtyController::class, 'update']);
    Route::delete('/specialties/{specialty}', [SpecialtyController::class, 'destroy']);

    // Médecins — écriture
    Route::post('/doctors', [DoctorController::class, 'store']);
    Route::put('/doctors/{doctor}', [DoctorController::class, 'update']);
    Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy']);

    // ============================================
    // Phase 2 — Préconsultation
    // ============================================
    Route::prefix('pre-consultations')->group(function () {
        Route::get('/', [PreConsultationController::class, 'index']);
        Route::post('/', [PreConsultationController::class, 'store']);
        Route::post('/suggest', [PreConsultationController::class, 'suggest']);
        Route::get('/{preConsultation}', [PreConsultationController::class, 'show']);
    });

    // ============================================
    // Phase 2 — Rendez-vous
    // ============================================
    Route::prefix('appointments')->group(function () {
        Route::get('/', [AppointmentController::class, 'index']);
        Route::post('/', [AppointmentController::class, 'store']);
        Route::get('/{appointment}', [AppointmentController::class, 'show']);
        Route::put('/{appointment}', [AppointmentController::class, 'update']);
        Route::delete('/{appointment}', [AppointmentController::class, 'destroy']);
    });

    // ============================================
    // Phase 2 — Plannings médecins
    // ============================================
    Route::prefix('schedules')->group(function () {
        Route::post('/', [ScheduleController::class, 'store']);
        Route::put('/{schedule}', [ScheduleController::class, 'update']);
        Route::delete('/{schedule}', [ScheduleController::class, 'destroy']);
    });

    // ============================================
    // Phase 3 — Dashboard & Statistiques
    // ============================================
    Route::get('/admin/dashboard', [DashboardController::class, 'stats']);
    Route::get('/doctor/dashboard', [DashboardController::class, 'doctorStats']);

    // ============================================
    // Phase 3 — Audit & Sécurité (admin)
    // ============================================
    Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
    Route::get('/admin/security-stats', [AuditLogController::class, 'securityStats']);

    // ============================================
    // Phase 3 — Gestion des utilisateurs (admin)
    // ============================================
    Route::get('/admin/users', [UserController::class, 'index']);
    Route::put('/admin/users/{user}/toggle-status', [UserController::class, 'toggleStatus']);
    Route::put('/admin/users/{user}/role', [UserController::class, 'updateRole']);
});

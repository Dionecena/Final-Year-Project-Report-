<?php

use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuditLogController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DoctorController;
use App\Http\Controllers\Api\NotificationController;
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

// ============================================
// Routes publiques
// ============================================
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login'])
        ->middleware('throttle:5,1');
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
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

// ============================================
// Routes protegees (token Sanctum requis)
// ============================================
Route::middleware('auth:sanctum')->group(function () {

    // Auth (tous les utilisateurs connectes)
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/profile', [AuthController::class, 'profile']);
        Route::put('/profile', [AuthController::class, 'updateProfile']);
    });

    // ============================================
    // Routes PATIENT (role:patient ou admin)
    // ============================================
    Route::middleware('role:patient,admin')->group(function () {
        Route::prefix('appointments')->group(function () {
            Route::post('/', [AppointmentController::class, 'store']);
        });

        Route::prefix('pre-consultations')->group(function () {
            Route::post('/', [PreConsultationController::class, 'store']);
            Route::post('/suggest', [PreConsultationController::class, 'suggest']);
        });
    });

    // ============================================
    // Routes accessibles a tous les utilisateurs connectes
    // (lecture RDV, pre-consultations, etc.)
    // ============================================
    Route::prefix('appointments')->group(function () {
        Route::get('/', [AppointmentController::class, 'index']);
        Route::get('/{appointment}', [AppointmentController::class, 'show']);
        Route::put('/{appointment}', [AppointmentController::class, 'update']);
        Route::delete('/{appointment}', [AppointmentController::class, 'destroy']);
    });

    Route::prefix('pre-consultations')->group(function () {
        Route::get('/', [PreConsultationController::class, 'index']);
        Route::get('/{preConsultation}', [PreConsultationController::class, 'show']);
    });

    // ============================================
    // Routes MEDECIN (role:doctor ou admin)
    // ============================================
    Route::middleware('role:doctor,admin')->group(function () {
        Route::get('/doctor/dashboard', [DashboardController::class, 'doctorStats']);
        Route::get('/doctor/pre-consultations', [DoctorController::class, 'preConsultations']);

        Route::prefix('schedules')->group(function () {
            Route::post('/', [ScheduleController::class, 'store']);
            Route::put('/{schedule}', [ScheduleController::class, 'update']);
            Route::delete('/{schedule}', [ScheduleController::class, 'destroy']);
        });
    });

    // ============================================
    // Routes SECRETAIRE (role:secretary ou admin)
    // ============================================
    Route::middleware('role:secretary,admin')->group(function () {
        Route::prefix('secretary')->group(function () {
            Route::get('/dashboard', [SecretaryController::class, 'dashboard']);
            Route::get('/pending-appointments', [SecretaryController::class, 'pendingAppointments']);
            Route::get('/doctors-by-specialty/{specialtyId}', [SecretaryController::class, 'doctorsBySpecialty']);
            Route::put('/appointments/{appointment}/assign', [SecretaryController::class, 'assignDoctor']);
            Route::put('/appointments/{appointment}/validate', [SecretaryController::class, 'validateAppointment']);
            Route::put('/appointments/{appointment}/reject', [SecretaryController::class, 'rejectAppointment']);
            Route::put('/online-booking/toggle', [SecretaryController::class, 'toggleOnlineBooking']);
            Route::get('/online-booking/status', [SecretaryController::class, 'onlineBookingStatus']);
        });
    });

    // ============================================
    // Routes ADMIN (role:admin uniquement)
    // ============================================
    Route::middleware('role:admin')->group(function () {
        // Specialites -- ecriture
        Route::post('/specialties', [SpecialtyController::class, 'store']);
        Route::put('/specialties/{specialty}', [SpecialtyController::class, 'update']);
        Route::delete('/specialties/{specialty}', [SpecialtyController::class, 'destroy']);

        // Medecins -- ecriture
        Route::post('/doctors', [DoctorController::class, 'store']);
        Route::put('/doctors/{doctor}', [DoctorController::class, 'update']);
        Route::delete('/doctors/{doctor}', [DoctorController::class, 'destroy']);

        // Dashboard admin
        Route::get('/admin/dashboard', [DashboardController::class, 'stats']);

        // Gestion utilisateurs
        Route::prefix('admin/users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::put('/{user}/toggle-status', [UserController::class, 'toggleStatus']);
            Route::put('/{user}/role', [UserController::class, 'updateRole']);
        });

        // Audit & Securite
        Route::get('/admin/audit-logs', [AuditLogController::class, 'index']);
        Route::get('/admin/security-stats', [AuditLogController::class, 'securityStats']);
    });

    // ============================================
    // Notifications (tous les utilisateurs connectes)
    // ============================================
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::get('/unread-count', [NotificationController::class, 'unreadCount']);
        Route::put('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/{notification}', [NotificationController::class, 'destroy']);
    });
});

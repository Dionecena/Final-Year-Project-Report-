<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
    ];

    // ============================================
    // Relations
    // ============================================

    public function doctor()
    {
        return $this->hasOne(Doctor::class);
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class);
    }

    // ============================================
    // Helpers
    // ============================================

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isDoctor(): bool
    {
        return $this->role === 'doctor';
    }

    public function isPatient(): bool
    {
        return $this->role === 'patient';
    }

    public function isSecretary(): bool
    {
        return $this->role === 'secretary';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }
}

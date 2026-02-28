<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class AuditService
{
    /**
     * Enregistrer une action dans le journal d'audit
     */
    public static function log(
        string $action,
        ?string $model = null,
        ?int $modelId = null,
        ?array $oldValues = null,
        ?array $newValues = null
    ): AuditLog {
        $request = request();

        return AuditLog::create([
            'user_id' => Auth::id(),
            'action' => $action,
            'model' => $model,
            'model_id' => $modelId,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }

    /**
     * Log de connexion
     */
    public static function logLogin(int $userId): void
    {
        $request = request();

        AuditLog::create([
            'user_id' => $userId,
            'action' => 'login',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }

    /**
     * Log de déconnexion
     */
    public static function logLogout(): void
    {
        self::log('logout');
    }

    /**
     * Log de tentative de connexion échouée
     */
    public static function logFailedLogin(string $email): void
    {
        $request = request();

        AuditLog::create([
            'user_id' => null,
            'action' => 'failed_login',
            'model' => 'User',
            'new_values' => ['email' => $email],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AuditLogController extends Controller
{
    /**
     * Lister les logs d'audit (admin uniquement)
     * GET /api/admin/audit-logs
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Accès réservé aux administrateurs'], 403);
        }

        $query = AuditLog::with('user')
            ->orderByDesc('created_at');

        // Filtres
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->has('model')) {
            $query->where('model', $request->model);
        }
        if ($request->has('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }
        if ($request->has('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        $logs = $query->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $logs->items(),
            'current_page' => $logs->currentPage(),
            'last_page' => $logs->lastPage(),
            'total' => $logs->total(),
        ]);
    }

    /**
     * Statistiques de sécurité
     * GET /api/admin/security-stats
     */
    public function securityStats(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Accès réservé aux administrateurs'], 403);
        }

        $last24h = now()->subHours(24);

        $failedLogins = AuditLog::where('action', 'failed_login')
            ->where('created_at', '>=', $last24h)
            ->count();

        $successfulLogins = AuditLog::where('action', 'login')
            ->where('created_at', '>=', $last24h)
            ->count();

        $recentActions = AuditLog::with('user')
            ->where('created_at', '>=', $last24h)
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        // IPs suspectes (plus de 5 tentatives échouées)
        $suspiciousIps = AuditLog::where('action', 'failed_login')
            ->where('created_at', '>=', $last24h)
            ->select('ip_address', \Illuminate\Support\Facades\DB::raw('COUNT(*) as attempts'))
            ->groupBy('ip_address')
            ->having('attempts', '>=', 5)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'failed_logins_24h' => $failedLogins,
                'successful_logins_24h' => $successfulLogins,
                'recent_actions' => $recentActions,
                'suspicious_ips' => $suspiciousIps,
            ],
        ]);
    }
}

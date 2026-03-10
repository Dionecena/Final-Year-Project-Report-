<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Lister les notifications de l'utilisateur connecte
     * GET /api/notifications
     */
    public function index(Request $request): JsonResponse
    {
        $query = Notification::where('user_id', auth()->id())
            ->orderBy('created_at', 'desc');

        // Filtre : non lues seulement
        if ($request->boolean('unread_only')) {
            $query->unread();
        }

        // Filtre : par type
        if ($request->has('type')) {
            $query->ofType($request->type);
        }

        $notifications = $query->paginate($request->get('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => $notifications,
        ]);
    }

    /**
     * Nombre de notifications non lues
     * GET /api/notifications/unread-count
     */
    public function unreadCount(): JsonResponse
    {
        $count = Notification::where('user_id', auth()->id())
            ->unread()
            ->count();

        return response()->json([
            'success' => true,
            'data' => ['count' => $count],
        ]);
    }

    /**
     * Marquer une notification comme lue
     * PUT /api/notifications/{id}/read
     */
    public function markAsRead(Notification $notification): JsonResponse
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403, 'Acces non autorise');
        }

        $notification->markAsRead();

        return response()->json([
            'success' => true,
            'data' => $notification->fresh(),
            'message' => 'Notification marquee comme lue',
        ]);
    }

    /**
     * Marquer toutes les notifications comme lues
     * PUT /api/notifications/read-all
     */
    public function markAllAsRead(): JsonResponse
    {
        Notification::where('user_id', auth()->id())
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json([
            'success' => true,
            'message' => 'Toutes les notifications ont ete marquees comme lues',
        ]);
    }

    /**
     * Supprimer une notification
     * DELETE /api/notifications/{id}
     */
    public function destroy(Notification $notification): JsonResponse
    {
        if ($notification->user_id !== auth()->id()) {
            abort(403, 'Acces non autorise');
        }

        $notification->delete();

        return response()->json([
            'success' => true,
            'message' => 'Notification supprimee',
        ]);
    }
}

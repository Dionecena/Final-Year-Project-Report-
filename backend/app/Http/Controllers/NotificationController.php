<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    /**
     * Lister les notifications de l'utilisateur connecte
     */
    public function index(Request $request): JsonResponse
    {
        $query = Notification::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc');

        // Filtrer par type si specifie
        if ($request->has('type')) {
            $query->ofType($request->type);
        }

        // Filtrer non lues seulement
        if ($request->boolean('unread_only')) {
            $query->unread();
        }

        $notifications = $query->paginate($request->input('per_page', 20));

        return response()->json($notifications);
    }

    /**
     * Nombre de notifications non lues
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $count = Notification::where('user_id', $request->user()->id)
            ->unread()
            ->count();

        return response()->json(['unread_count' => $count]);
    }

    /**
     * Marquer une notification comme lue
     */
    public function markAsRead(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $notification->markAsRead();

        return response()->json([
            'message' => 'Notification marquee comme lue.',
            'notification' => $notification->fresh(),
        ]);
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    public function markAllAsRead(Request $request): JsonResponse
    {
        Notification::where('user_id', $request->user()->id)
            ->unread()
            ->update(['read_at' => now()]);

        return response()->json([
            'message' => 'Toutes les notifications ont ete marquees comme lues.',
        ]);
    }

    /**
     * Supprimer une notification
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $notification = Notification::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $notification->delete();

        return response()->json([
            'message' => 'Notification supprimee.',
        ]);
    }

    /**
     * Supprimer toutes les notifications lues
     */
    public function clearRead(Request $request): JsonResponse
    {
        $deleted = Notification::where('user_id', $request->user()->id)
            ->whereNotNull('read_at')
            ->delete();

        return response()->json([
            'message' => "{$deleted} notification(s) supprimee(s).",
            'deleted_count' => $deleted,
        ]);
    }
}

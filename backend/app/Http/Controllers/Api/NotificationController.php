<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    /**
     * Display a listing of the notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = Notification::query();

        if ($user->role === 'ADMIN') {
            // Admins see their own notifications + global notifications (user_id is null)
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhereNull('user_id');
            });
        } else {
            // Normal users only see their own notifications
            $query->where('user_id', $user->id);
        }

        $notifications = $query->latest()->get();

        return response()->json([
            'status' => 'success',
            'data' => $notifications,
            'unread_count' => $notifications->where('is_read', false)->count()
        ]);
    }

    /**
     * Mark a specific notification as read.
     */
    public function markAsRead(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where(function($q) use ($request) {
                $q->where('user_id', $request->user()->id)
                  ->orWhereNull('user_id');
            })
            ->firstOrFail();

        $notification->update(['is_read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Notification marked as read'
        ]);
    }

    /**
     * Mark all notifications as read for the authenticated user.
     */
    public function markAllAsRead(Request $request)
    {
        $user = $request->user();
        
        $query = Notification::where('is_read', false);

        if ($user->role === 'ADMIN') {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhereNull('user_id');
            });
        } else {
            $query->where('user_id', $user->id);
        }

        $query->update(['is_read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'All notifications marked as read'
        ]);
    }

    /**
     * Remove a notification.
     */
    public function destroy(Request $request, $id)
    {
        $notification = Notification::where('id', $id)
            ->where(function($q) use ($request) {
                $q->where('user_id', $request->user()->id)
                  ->orWhereNull('user_id');
            })
            ->firstOrFail();

        $notification->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Notification deleted'
        ]);
    }

    /**
     * Clear all notifications for the user.
     */
    public function clearAll(Request $request)
    {
        $user = $request->user();
        
        $query = Notification::query();

        if ($user->role === 'ADMIN') {
            $query->where(function($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhereNull('user_id');
            });
        } else {
            $query->where('user_id', $user->id);
        }

        $query->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'All notifications cleared'
        ]);
    }
}

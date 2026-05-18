<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use App\Models\Notification;

abstract class Controller
{
    protected function logActivity($userId, $action, $description)
    {
        ActivityLog::create([
            'user_id' => $userId,
            'action' => $action,
            'description' => $description,
        ]);
    }

    protected function notifyAdmins($type, $title, $message)
    {
        // Global admin notifications (user_id is null means all admins see it)
        Notification::create([
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'user_id' => null, // Global for admins
            'is_read' => false,
        ]);
    }

    protected function notifyUser($userId, $type, $title, $message)
    {
        Notification::create([
            'title' => $title,
            'message' => $message,
            'type' => $type,
            'user_id' => $userId,
            'is_read' => false,
        ]);
    }
}

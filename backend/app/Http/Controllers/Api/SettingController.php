<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use App\Models\ActivityLog;
use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $settingsData = $request->all();

        foreach ($settingsData as $key => $value) {
            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Log the activity
        ActivityLog::create([
            'user_id'     => $request->user()->id,
            'action'      => 'UPDATE_SETTINGS',
            'description' => 'Updated system settings.',
        ]);

        // Notify all admins using the custom Notification model
        $admins = User::where('role', 'ADMIN')->get();
        foreach ($admins as $admin) {
            Notification::create([
                'user_id' => $admin->id,
                'type'    => 'info',
                'title'   => 'Settings Updated',
                'message' => 'System settings have been updated by ' . $request->user()->name,
                'is_read' => false,
            ]);
        }

        return response()->json(['message' => 'Settings updated successfully.']);
    }
}

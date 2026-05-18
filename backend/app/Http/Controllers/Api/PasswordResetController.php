<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\ResetPasswordMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Exception;

class PasswordResetController extends Controller
{
    /**
     * GET /api/test-mail
     * Quickly test if your SMTP settings in .env are working.
     */
    public function testMail()
    {
        try {
            Mail::raw('Hi! This is a test email from your CMS Global project. If you see this, your SMTP settings are CORRECT! ✅', function ($message) {
                $message->to(config('mail.from.address'))
                        ->subject('SMTP Test - CMS Global');
            });

            return response()->json([
                'success' => true,
                'message' => 'Test email sent successfully to ' . config('mail.from.address') . '. Check your inbox/Mailtrap!'
            ]);
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Mail configuration error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/forgot-password
     * Generates a 6-digit OTP and sends it via email.
     */
    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Security: Always return success to prevent user enumeration
        if (!$user) {
            return response()->json([
                'message' => 'If this email is registered, you will receive a 6-digit code shortly.'
            ]);
        }

        // Generate 6-digit OTP
        $otp = rand(100000, 999999);

        try {
            DB::beginTransaction();

            // Clear old tokens
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();

            // Store OTP (using SHA256 for security)
            DB::table('password_reset_tokens')->insert([
                'email'      => $request->email,
                'token'      => hash('sha256', (string)$otp),
                'created_at' => Carbon::now(),
            ]);

            // Send Email
            Mail::to($user->email)->send(new ResetPasswordMail($user->name, (string)$otp));

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'A 6-digit security code has been sent to your email.'
            ]);

        } catch (Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to send security code. Please check server logs.',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * POST /api/reset-password
     * Verifies the 6-digit OTP and updates the password.
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'otp'                   => 'required|string|size:6',
            'email'                 => 'required|email',
            'password'              => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record) {
            return response()->json(['message' => 'No reset request found for this email.'], 422);
        }

        // Check expiry (15 minutes for OTP is more secure)
        if (Carbon::parse($record->created_at)->addMinutes(15)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'The security code has expired.'], 422);
        }

        // Verify OTP hash
        if (!hash_equals($record->token, hash('sha256', $request->otp))) {
            return response()->json(['message' => 'Invalid security code.'], 422);
        }

        $user = User::where('email', $request->email)->first();
        if (!$user) return response()->json(['message' => 'User not found.'], 404);

        // Update password
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // Cleanup
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();
        $user->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successful. You can now login.'
        ]);
    }
}

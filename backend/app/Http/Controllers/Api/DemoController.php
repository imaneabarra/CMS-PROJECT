<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\DemoRequest;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

class DemoController extends Controller
{
    /**
     * Store a new technical demo request.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id'     => 'required|exists:products,id',
            'scheduled_date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    if (Carbon::parse($value)->isPast()) {
                        $fail('The scheduled date must be a future date and time.');
                    }
                },
            ],
            'phone'          => 'required|string|max:20',
            'notes'          => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $demoRequest = DemoRequest::create([
                'user_id'        => Auth::id(),
                'product_id'     => $request->product_id,
                'scheduled_date' => $request->scheduled_date,
                'phone'          => $request->phone,
                'notes'          => $request->notes,
                'status'         => 'pending',
            ]);

            // For future scalability: 
            // 1. Dispatch notification to admin
            // 2. Send email confirmation to user
            // 3. Add to system calendar

            return response()->json([
                'success' => true,
                'message' => 'Your technical demo request has been received.',
                'data'    => $demoRequest
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process request',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user's demo requests.
     */
    public function myRequests()
    {
        $requests = DemoRequest::with('product')
            ->where('user_id', Auth::id())
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $requests
        ]);
    }
}

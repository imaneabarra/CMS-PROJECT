<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'phone_number' => 'required|string|min:8',
            'delivery_address' => 'required|string|max:500',
            'notes' => 'nullable|string|max:1000',
        ]);

        $user = $request->user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Your selection is currently empty.'], 400);
        }

        $totalPrice = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        $orderReference = 'ORD-' . date('Y') . '-' . strtoupper(Str::random(6));

        try {
            DB::beginTransaction();

            $order = Order::create([
                'user_id' => $user->id,
                'order_reference' => $orderReference,
                'total_price' => $totalPrice,
                'shipping_address' => $request->delivery_address, // Map to existing column
                'phone' => $request->phone_number,             // Map to existing column
                'notes' => $request->notes,
                'status' => 'PENDING',
                'payment_method' => 'Manual Checkout',
            ]);

            $productDetails = "";
            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price,
                ]);

                $productDetails .= "- " . $item->product->name . " x" . $item->quantity . "\n";
            }

            // Clear cart
            $user->cartItems()->delete();

            DB::commit();

            // Construct WhatsApp Message
            $whatsappNumber = env('WHATSAPP_NUMBER', '212600000000');
            $message = "Hello CMS Global Team,\n\nI would like to finalize my acquisition request.\n\n" .
                       "*Order Reference:* " . $orderReference . "\n" .
                       "*Total:* $" . number_format($totalPrice, 2) . "\n\n" .
                       "*Products:*\n" . $productDetails . "\n" .
                       "*Delivery Address:*\n" . $request->delivery_address . "\n\n" .
                       "Please let me know the next steps for manual finalization.";

            $whatsappUrl = "https://wa.me/" . $whatsappNumber . "?text=" . urlencode($message);

            return response()->json([
                'success' => true,
                'message' => 'Your acquisition request has been registered successfully.',
                'order_reference' => $orderReference,
                'whatsapp_url' => $whatsappUrl,
                'order' => $order
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Acquisition failed: ' . $e->getMessage()], 400);
        }
    }
}

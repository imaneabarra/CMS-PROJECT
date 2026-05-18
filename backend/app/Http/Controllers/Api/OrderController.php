<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ActivityLog;
use App\Models\OrderItem;
use App\Models\Product;
use App\Http\Resources\OrderResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Stripe\StripeClient;

class OrderController extends Controller
{
    private $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(env('STRIPE_SECRET'));
    }

    public function index()
    {
        $orders = Order::with(['user', 'orderItems.product'])->latest()->paginate(20);
        return OrderResource::collection($orders);
    }

    public function myOrders(Request $request)
    {
        $orders = $request->user()->orders()->with('orderItems.product')->latest()->get();
        return OrderResource::collection($orders);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'payment_method' => 'required|in:stripe,cod',
            'shipping_address' => 'required|string',
            'phone' => 'required_if:payment_method,cod|string|nullable',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Your selection is currently empty.'], 400);
        }

        $totalPrice = $cartItems->sum(function ($item) {
            return $item->product->price * $item->quantity;
        });

        // Handle Stripe Payment
        if ($request->payment_method === 'stripe') {
            try {
                $paymentIntent = $this->stripe->paymentIntents->create([
                    'amount' => $totalPrice * 100,
                    'currency' => 'usd',
                    'metadata' => [
                        'user_id' => $user->id,
                        'shipping_address' => $request->shipping_address,
                        'notes' => $request->notes,
                    ],
                    'automatic_payment_methods' => ['enabled' => true],
                ]);

                return response()->json([
                    'payment_method' => 'stripe',
                    'clientSecret' => $paymentIntent->client_secret,
                    'total' => $totalPrice
                ]);
            } catch (\Exception $e) {
                return response()->json(['message' => 'Stripe initialization failed: ' . $e->getMessage()], 500);
            }
        }

        // Handle Cash on Delivery (COD)
        if ($request->payment_method === 'cod') {
            try {
                DB::beginTransaction();

                $order = Order::create([
                    'user_id' => $user->id,
                    'total_price' => $totalPrice,
                    'status' => 'PENDING_DELIVERY',
                    'payment_status' => 'UNPAID',
                    'payment_method' => 'COD',
                    'shipping_address' => $request->shipping_address,
                    'phone' => $request->phone,
                    'notes' => $request->notes,
                ]);

                foreach ($cartItems as $item) {
                    if ($item->product->stock < $item->quantity) {
                        throw new \Exception("Insufficient stock for product: {$item->product->name}");
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $item->product_id,
                        'quantity' => $item->quantity,
                        'price' => $item->product->price,
                    ]);

                    $item->product->decrement('stock', $item->quantity);
                }

                $user->cartItems()->delete();

                DB::commit();

                // Log Activity & Notify
                // $this->logActivity($user->id, 'order', "Placed COD order #{$order->id}");

                return response()->json([
                    'payment_method' => 'cod',
                    'message' => 'Order received successfully. We will contact you soon to confirm delivery.',
                    'order' => new OrderResource($order->load('orderItems.product'))
                ]);

            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json(['message' => $e->getMessage()], 400);
            }
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|string|in:PENDING,PROCESSING,SHIPPED,DELIVERED,CANCELLED',
        ]);

        $order = Order::findOrFail($id);
        $order->update(['status' => $request->status]);

        $this->logActivity($request->user()->id, 'order', "Updated order #{$order->id} status to {$request->status}");

        // Notify user about status change
        if ($request->status === 'PROCESSING') {
            $this->notifyUser($order->user_id, 'order', 'Order Confirmed', "Your order #{$order->id} has been confirmed and is being processed.");
        } elseif ($request->status === 'SHIPPED') {
            $this->notifyUser($order->user_id, 'order', 'Order Shipped', "Great news! Your order #{$order->id} is on the way.");
        }

        return new OrderResource($order);
    }
}

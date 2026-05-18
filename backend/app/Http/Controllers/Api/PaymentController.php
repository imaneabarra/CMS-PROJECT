<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Stripe\StripeClient;
use Stripe\Webhook;

class PaymentController extends Controller
{
    private $stripe;

    public function __construct()
    {
        $this->stripe = new StripeClient(config('services.stripe.secret'));
    }

    /**
     * Create a Stripe PaymentIntent for the authenticated user's cart.
     * POST /api/create-payment-intent
     */
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'currency'         => 'required|string|in:usd,eur,mad',
            'shipping_address' => 'required|string|max:500',
            'phone'            => 'required|string|min:8',
            'notes'            => 'nullable|string|max:1000',
        ]);

        $user      = $request->user();
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Your cart is empty.'], 400);
        }

        $subtotal = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);
        $tax      = round($subtotal * 0.12, 2);
        $total    = $subtotal + $tax;

        // Stripe expects amount in smallest currency unit (cents)
        $amountInCents = (int) round($total * 100);

        if ($amountInCents < 50) {
            return response()->json(['message' => 'Order amount too small.'], 400);
        }

        $orderReference = 'ORD-' . date('Y') . '-' . strtoupper(Str::random(6));

        $paymentIntent = $this->stripe->paymentIntents->create([
            'amount'   => $amountInCents,
            'currency' => $request->currency,
            'metadata' => [
                'user_id'          => $user->id,
                'order_reference'  => $orderReference,
                'shipping_address' => $request->shipping_address,
                'phone'            => $request->phone,
                'notes'            => $request->notes ?? '',
            ],
            'automatic_payment_methods' => ['enabled' => true],
        ]);

        return response()->json([
            'clientSecret'    => $paymentIntent->client_secret,
            'paymentIntentId' => $paymentIntent->id,
            'order_reference' => $orderReference,
            'total'           => $total,
        ]);
    }

    /**
     * Confirm a Stripe payment and persist the order in the database.
     * Called by the frontend immediately after stripe.confirmPayment() succeeds.
     * POST /api/confirm-stripe-order
     */
    public function confirmStripeOrder(Request $request)
    {
        $request->validate([
            'payment_intent_id' => 'required|string',
        ]);

        $user = $request->user();

        // ── 1. Retrieve the PaymentIntent from Stripe to verify it's really paid ──
        try {
            $paymentIntent = $this->stripe->paymentIntents->retrieve(
                $request->payment_intent_id
            );
        } catch (\Exception $e) {
            return response()->json(['message' => 'Could not verify payment: ' . $e->getMessage()], 400);
        }

        if ($paymentIntent->status !== 'succeeded') {
            return response()->json(['message' => 'Payment has not been completed.'], 400);
        }

        // ── 2. Idempotency guard — don't create duplicate orders ──
        $existing = Order::where('stripe_id', $paymentIntent->id)->first();
        if ($existing) {
            return response()->json([
                'success'         => true,
                'order_reference' => $existing->order_reference,
                'message'         => 'Order already recorded.',
            ]);
        }

        // ── 3. Pull cart items (still in DB at this point) ──
        $cartItems = $user->cartItems()->with('product')->get();

        if ($cartItems->isEmpty()) {
            // Cart was already cleared — still return success so the UI proceeds
            $orderRef = $paymentIntent->metadata->order_reference ?? ('ORD-' . $paymentIntent->id);
            return response()->json([
                'success'         => true,
                'order_reference' => $orderRef,
                'message'         => 'Payment confirmed.',
            ]);
        }

        // ── 4. Calculate totals from cart ──
        $subtotal  = $cartItems->sum(fn($item) => $item->product->price * $item->quantity);
        $tax       = round($subtotal * 0.12, 2);
        $total     = $subtotal + $tax;

        $orderReference = $paymentIntent->metadata->order_reference
            ?? ('ORD-' . date('Y') . '-' . strtoupper(Str::random(6)));

        $shippingAddress = $paymentIntent->metadata->shipping_address ?? '';
        $phone           = $paymentIntent->metadata->phone            ?? '';
        $notes           = $paymentIntent->metadata->notes            ?? null;

        try {
            \Illuminate\Support\Facades\DB::beginTransaction();

            // ── 5. Create order ──
            $order = Order::create([
                'user_id'          => $user->id,
                'order_reference'  => $orderReference,
                'total_price'      => $total,
                'status'           => 'PAID',
                'payment_status'   => 'PAID',
                'payment_method'   => 'STRIPE',
                'shipping_address' => $shippingAddress,
                'phone'            => $phone,
                'notes'            => $notes,
                'stripe_id'        => $paymentIntent->id,
            ]);

            // ── 6. Create order items ──
            foreach ($cartItems as $item) {
                $order->orderItems()->create([
                    'product_id' => $item->product_id,
                    'quantity'   => $item->quantity,
                    'price'      => $item->product->price,
                ]);
            }

            // ── 7. Clear cart ──
            $user->cartItems()->delete();

            \Illuminate\Support\Facades\DB::commit();
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\DB::rollBack();
            return response()->json(['message' => 'Order creation failed: ' . $e->getMessage()], 500);
        }

        return response()->json([
            'success'         => true,
            'order_reference' => $orderReference,
            'message'         => 'Order confirmed and saved.',
        ]);
    }

    public function webhook(Request $request)
    {
        $endpoint_secret = config('services.stripe.webhook_secret');
        $payload         = $request->getContent();
        $sig_header      = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (\UnexpectedValueException $e) {
            return response()->json(['error' => 'Invalid payload'], 400);
        } catch (\Stripe\Exception\SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;
            $userId = $paymentIntent->metadata->user_id;
            $shippingAddress = $paymentIntent->metadata->shipping_address;
            $notes = $paymentIntent->metadata->notes ?? null;

            $user = \App\Models\User::find($userId);
            if ($user) {
                $cartItems = $user->cartItems()->with('product')->get();
                
                if ($cartItems->isNotEmpty()) {
                    $totalAmount = $cartItems->sum(function ($item) {
                        return $item->product->price * $item->quantity;
                    });

                    // Create Order
                    $order = Order::create([
                        'user_id' => $user->id,
                        'total_price' => $totalAmount,
                        'status' => 'PAID',
                        'payment_status' => 'PAID',
                        'payment_method' => 'STRIPE',
                        'shipping_address' => $shippingAddress,
                        'notes' => $notes,
                        'stripe_id' => $paymentIntent->id,
                    ]);

                    // Create Order Items
                    foreach ($cartItems as $item) {
                        $order->orderItems()->create([
                            'product_id' => $item->product_id,
                            'quantity' => $item->quantity,
                            'price' => $item->product->price,
                        ]);
                    }

                    // Clear Cart
                    $user->cartItems()->delete();
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}

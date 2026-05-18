<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class PaymentController extends Controller
{
    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'amount' => 'required|integer|min:50', // amount in cents, minimum $0.50
            'currency' => 'required|string|in:usd,eur,mad'
        ]);

        Stripe::setApiKey(config('services.stripe.secret'));

        $paymentIntent = PaymentIntent::create([
            'amount' => $request->amount,
            'currency' => $request->currency,
            'metadata' => [
                'user_id' => auth()->id(),
                'order_reference' => $request->order_reference ?? null
            ]
        ]);

        return response()->json([
            'clientSecret' => $paymentIntent->client_secret,
            'paymentIntentId' => $paymentIntent->id
        ]);
    }
}
import React, { useState } from 'react';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShieldCheck, Loader2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Props:
 *  - onPaymentSuccess(orderData)  — called after order is saved in DB
 *  - total                         — display amount
 */
const StripePaymentForm = ({ onPaymentSuccess, total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);

    // ── 1. Confirm payment with Stripe ──────────────────────────
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.href,
      },
      redirect: 'if_required',
    });

    if (error) {
      toast.error(error.message, {
        style: { background: '#0B0F1A', color: '#fff', border: '1px solid #f43f5e' },
      });
      setIsProcessing(false);
      return;
    }

    if (!paymentIntent || paymentIntent.status !== 'succeeded') {
      toast.error('Payment could not be completed. Please try again.');
      setIsProcessing(false);
      return;
    }

    // ── 2. Tell the backend to verify & persist the order ───────
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/confirm-stripe-order`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ payment_intent_id: paymentIntent.id }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        // Payment went through but order save failed — show a warning
        // (user has paid; support can recover via Stripe dashboard)
        toast.error(
          `Payment succeeded but order save failed: ${data.message}. Please contact support.`,
          { duration: 8000 }
        );
        // Still propagate success so the user sees confirmation
        onPaymentSuccess({ ...paymentIntent, order_reference: paymentIntent.id });
        return;
      }

      onPaymentSuccess({ ...paymentIntent, order_reference: data.order_reference });
    } catch (err) {
      // Network error — payment succeeded, order may or may not have been saved
      toast.error('Network error saving order. Contact support with your payment reference.', {
        duration: 8000,
      });
      onPaymentSuccess({ ...paymentIntent, order_reference: paymentIntent.id });
    }

    setIsProcessing(false);
  };

  const paymentElementOptions = {
    layout: 'tabs',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="glass-card p-6 md:p-8 border-cyan-500/20 bg-aether-900/50">
        <div className="flex items-center gap-4 mb-8 border-b border-glass-border pb-4">
          <Lock className="w-5 h-5 text-cyan-500" />
          <h2 className="text-[11px] font-black text-text-primary tracking-[0.3em] uppercase">
            Secure Card Entry
          </h2>
        </div>

        {/* Stripe's unified PaymentElement */}
        <div className="p-5 bg-aether-950/50 rounded-2xl border border-glass-border mb-6">
          <PaymentElement options={paymentElementOptions} />
        </div>

        <div className="flex items-center gap-3 text-[9px] text-text-muted font-bold tracking-widest uppercase mb-8 opacity-60">
          <ShieldCheck className="w-4 h-4 text-cyan-500" />
          AES-256 Bit Encryption · Powered by Stripe
        </div>

        <button
          type="submit"
          disabled={!stripe || !elements || isProcessing}
          className="w-full py-5 rounded-2xl bg-cyan-500 text-white text-[11px] font-black uppercase tracking-[0.5em] hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20 disabled:opacity-30 flex items-center justify-center gap-3"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              AUTHORIZING ${total?.toLocaleString()}...
            </>
          ) : (
            `AUTHORIZE ACQUISITION ($${total?.toLocaleString()})`
          )}
        </button>
      </div>
    </form>
  );
};

export default StripePaymentForm;

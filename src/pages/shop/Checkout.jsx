import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Lock,
  User,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  ChevronLeft,
  Package,
  Truck,
  MessageSquare,
  ExternalLink,
  CreditCard,
  Loader2,
} from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';
import ProductImage from '../../components/ui/ProductImage';
import StripePaymentForm from '../../components/checkout/StripePaymentForm';

// Initialize Stripe outside of component to avoid re-creating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_KEY);

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [successData, setSuccessData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Stripe state
  const [clientSecret, setClientSecret] = useState(null);
  const [orderReference, setOrderReference] = useState(null);
  const [isCreatingIntent, setIsCreatingIntent] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Switzerland',
    notes: '',
  });

  const [errors, setErrors] = useState({});

  // Auth & Cart Protection
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        toast.error('Identity Verification Required: Please login to continue.', { icon: '🔒' });
        navigate('/login');
      } else if (cartItems.length === 0 && !successData) {
        toast.error('Your selection is empty', { icon: '🛒' });
        navigate('/cart');
      }
    }
  }, [user, cartItems, successData, navigate, authLoading]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    // If the user edits the address / phone while a payment intent exists, invalidate it
    if (['address', 'city', 'postalCode', 'country', 'phone'].includes(name)) {
      setClientSecret(null);
      setOrderReference(null);
    }
  };

  const isFormValid = useMemo(
    () => formData.fullName && formData.phone && formData.address && formData.city,
    [formData]
  );

  const tax = cartTotal * 0.12;
  const total = cartTotal + tax;

  // ─────────────────────────────────────────────────────────────
  // Create a Stripe PaymentIntent (called when card tab is opened)
  // ─────────────────────────────────────────────────────────────
  const createPaymentIntent = useCallback(async () => {
    if (!isFormValid) {
      toast.error('Please fill in your delivery details first.');
      return;
    }
    if (clientSecret) return; // already created

    setIsCreatingIntent(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          currency: 'usd',
          shipping_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          phone: formData.phone,
          notes: formData.notes,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to initialize payment.');

      setClientSecret(data.clientSecret);
      setOrderReference(data.order_reference);
    } catch (error) {
      toast.error(error.message || 'Payment initialization failed.');
    } finally {
      setIsCreatingIntent(false);
    }
  }, [isFormValid, clientSecret, formData]);

  // Auto-create intent when card method is selected and form is valid
  useEffect(() => {
    if (paymentMethod === 'card' && isFormValid && !clientSecret && !isCreatingIntent) {
      createPaymentIntent();
    }
  }, [paymentMethod]);

  // ─────────────────────────────────────────────────────────────
  // COD Checkout (cash/concierge delivery)
  // ─────────────────────────────────────────────────────────────
  const handleCodSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      toast.error('Please verify your acquisition details.');
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem('token');

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/checkout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          phone_number: formData.phone,
          delivery_address: `${formData.address}, ${formData.city}, ${formData.postalCode}, ${formData.country}`,
          notes: formData.notes,
          payment_method: 'cod',
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Acquisition failed');

      setSuccessData(data);
      clearCart();
      toast.success('Acquisition Registered Successfully');
    } catch (error) {
      toast.error(error.message || 'Acquisition process interrupted.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // Stripe payment success callback
  // ─────────────────────────────────────────────────────────────
  const handleStripeSuccess = useCallback(
    (paymentData) => {
      // Backend already cleared the DB cart; sync the local cart state
      clearCart();
      setSuccessData({
        order_reference: paymentData.order_reference || paymentData.id,
        payment_intent_id: paymentData.id,
        stripe: true,
      });
      toast.success('Payment Successful! Your order has been confirmed.', { icon: '💳' });
    },
    [clearCart]
  );

  // ─────────────────────────────────────────────────────────────
  // Success Screen
  // ─────────────────────────────────────────────────────────────
  if (successData) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center px-4 bg-aether-800 relative overflow-hidden">
        <div className="absolute inset-0 hero-glow opacity-20 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-2xl"
        >
          <div className="glass-card p-12 text-center border-cyan-500/30 shadow-2xl rounded-[3rem]">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-24 h-24 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-cyan-500/20"
            >
              <CheckCircle className="w-12 h-12 text-cyan-500" />
            </motion.div>

            <span className="text-[10px] tracking-[0.6em] uppercase text-cyan-500 font-bold mb-4 block">
              {successData.stripe ? 'Payment Confirmed' : 'Registration Successful'}
            </span>
            <h2 className="text-4xl font-serif text-text-primary mb-8 tracking-widest uppercase">
              Acquisition {successData.stripe ? 'Paid' : 'Requested'}
            </h2>

            <div className="bg-aether-700/50 p-8 rounded-2xl border border-glass-border mb-10 text-left">
              <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold mb-2">
                Order Reference
              </p>
              <p className="text-xl font-serif text-cyan-500 font-bold tracking-widest">
                {successData.order_reference}
              </p>
              {successData.stripe && (
                <p className="text-[9px] text-text-muted uppercase tracking-widest font-bold mt-3">
                  Payment processed securely via Stripe ✓
                </p>
              )}
            </div>

            <p className="text-text-secondary mb-12 leading-relaxed font-bold uppercase tracking-[0.2em] text-[11px] opacity-70">
              {successData.stripe
                ? 'Your payment was successful. You will receive a confirmation email shortly.'
                : 'Your acquisition request has been registered. Please click below to finalize via WhatsApp or wait for our concierge team.'}
            </p>

            <div className="flex flex-col gap-6">
              {!successData.stripe && successData.whatsapp_url && (
                <a href={successData.whatsapp_url} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Button
                    variant="primary"
                    className="w-full py-6 flex items-center justify-center gap-4 text-xs tracking-[0.4em] uppercase font-black shadow-[0_20px_50px_rgba(34,211,238,0.3)]"
                  >
                    <MessageSquare className="w-5 h-5" /> Finalize on WhatsApp
                  </Button>
                </a>
              )}
              <Link to="/shop">
                <Button
                  variant="outline"
                  className="w-full py-6 text-xs tracking-[0.4em] uppercase font-bold border-glass-border text-text-secondary hover:text-text-primary"
                >
                  Back to Showroom
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // Stripe Elements appearance (dark theme)
  // ─────────────────────────────────────────────────────────────
  const stripeAppearance = {
    theme: 'night',
    variables: {
      colorPrimary: '#22d3ee',
      colorBackground: '#0B0F1A',
      colorText: '#f8fafc',
      colorDanger: '#f43f5e',
      fontFamily: 'Inter, sans-serif',
      spacingUnit: '4px',
      borderRadius: '12px',
    },
  };

  // ─────────────────────────────────────────────────────────────
  // Main Checkout Page
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 text-text-muted hover:text-cyan-500 transition-colors mb-6 group"
          >
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] tracking-[0.3em] uppercase font-bold">Return to Selection</span>
          </Link>
          <span className="text-[10px] tracking-[0.4em] uppercase text-cyan-500 font-bold mb-2 block">
            Secure Checkout
          </span>
          <h1 className="text-4xl md:text-5xl font-serif text-text-primary tracking-wide uppercase font-bold">
            Complete Acquisition
          </h1>
        </div>
        <div className="flex items-center gap-6 text-[10px] text-text-muted font-bold tracking-widest uppercase bg-aether-700/30 px-6 py-4 rounded-2xl border border-glass-border">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-500" /> Stripe Protected
          </span>
          <span className="w-1 h-1 bg-glass-border rounded-full" />
          <span className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-500" /> Secure Vault
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
        {/* ── Left Column: Forms ── */}
        <div className="lg:col-span-7 space-y-12">
          {/* Identity & Contact */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-500">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-[11px] font-black text-text-primary tracking-[0.4em] uppercase">
                Identity &amp; Contact
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Input
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Direct Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+212 6..."
                required
              />
            </div>
          </section>

          {/* Delivery Address */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-500">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="text-[11px] font-black text-text-primary tracking-[0.4em] uppercase">
                Concierge Dispatch
              </h2>
            </div>
            <div className="space-y-8">
              <Input
                label="Physical Address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Rue de la Paix..."
                required
              />
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Postal Code"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
                <div className="space-y-3">
                  <label className="text-[10px] tracking-[0.2em] uppercase font-bold text-text-muted">
                    Country
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="glass-input appearance-none cursor-pointer"
                  >
                    <option value="Switzerland">Switzerland</option>
                    <option value="France">France</option>
                    <option value="Morocco">Morocco</option>
                  </select>
                </div>
              </div>
            </div>
          </section>

          {/* Notes */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-500">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-[11px] font-black text-text-primary tracking-[0.4em] uppercase">
                Additional Briefing
              </h2>
            </div>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Optional notes for our concierge team..."
              className="w-full bg-aether-900/50 border border-glass-border rounded-[2rem] p-8 text-sm text-text-primary min-h-[150px] focus:outline-none focus:border-cyan-500/50"
            />
          </section>

          {/* Payment Strategy */}
          <section className="space-y-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-500">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-[11px] font-black text-text-primary tracking-[0.4em] uppercase">
                Payment Strategy
              </h2>
            </div>

            {/* Method Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                onClick={() => setPaymentMethod('card')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'card'
                    ? 'border-cyan-500 bg-cyan-500/5'
                    : 'border-glass-border bg-aether-800/30'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">
                    Card Acquisition
                  </span>
                  {paymentMethod === 'card' && <CheckCircle className="w-4 h-4 text-cyan-500" />}
                </div>
                <p className="text-[9px] text-text-muted uppercase tracking-widest leading-relaxed">
                  Instant online payment via Stripe.
                </p>
              </div>

              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-6 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-cyan-500 bg-cyan-500/5'
                    : 'border-glass-border bg-aether-800/30'
                }`}
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">
                    Concierge Delivery
                  </span>
                  {paymentMethod === 'cod' && <CheckCircle className="w-4 h-4 text-cyan-500" />}
                </div>
                <p className="text-[9px] text-text-muted uppercase tracking-widest leading-relaxed">
                  Settle the acquisition upon physical inspection.
                </p>
              </div>
            </div>

            {/* Payment Panel */}
            <AnimatePresence mode="wait">
              {paymentMethod === 'card' ? (
                <motion.div
                  key="card-stripe"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  {isCreatingIntent ? (
                    <div className="p-10 bg-aether-900/50 rounded-3xl border border-glass-border flex flex-col items-center gap-4">
                      <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">
                        Initializing Secure Payment...
                      </p>
                    </div>
                  ) : !isFormValid ? (
                    <div className="p-8 bg-aether-900/50 rounded-3xl border border-glass-border text-center">
                      <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em]">
                        Please fill in your delivery details above to continue.
                      </p>
                    </div>
                  ) : clientSecret ? (
                    <Elements
                      stripe={stripePromise}
                      options={{ clientSecret, appearance: stripeAppearance }}
                    >
                      <StripePaymentForm
                        onPaymentSuccess={handleStripeSuccess}
                        total={total}
                      />
                    </Elements>
                  ) : (
                    <div className="p-8 bg-aether-900/50 rounded-3xl border border-glass-border text-center">
                      <button
                        type="button"
                        onClick={createPaymentIntent}
                        className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em] underline"
                      >
                        Click to load payment form
                      </button>
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="cod-message"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-8 bg-cyan-500/5 rounded-3xl border border-cyan-500/20">
                    <div className="flex gap-4">
                      <Phone className="w-5 h-5 text-cyan-500 flex-shrink-0" />
                      <p className="text-[11px] font-bold text-text-primary uppercase tracking-widest leading-relaxed">
                        Our concierge team will contact you at{' '}
                        <span className="text-cyan-500">
                          {formData.phone || '[Phone Number]'}
                        </span>{' '}
                        to authenticate the acquisition before dispatch.
                      </p>
                    </div>
                  </div>

                  {/* COD Submit Button */}
                  <form onSubmit={handleCodSubmit} className="mt-8">
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!isFormValid || isSubmitting}
                      className="w-full py-8 text-[11px] font-black tracking-[0.5em] uppercase shadow-2xl"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-3">
                          <Clock className="w-4 h-4 animate-spin" /> Processing Request...
                        </span>
                      ) : (
                        <span className="flex items-center gap-3">
                          Confirm Delivery Acquisition <ArrowRight className="w-4 h-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>

        {/* ── Right Column: Order Summary ── */}
        <div className="lg:col-span-5">
          <div className="glass-card p-10 sticky top-28 border-glass-border bg-aether-700/30 rounded-[3rem]">
            <h2 className="text-xl font-serif text-text-primary mb-10 border-b border-glass-border pb-6 tracking-widest uppercase font-bold text-center">
              Order Summary
            </h2>
            <div className="space-y-8 mb-10 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-6">
                  <div className="w-20 h-20 bg-aether-700 rounded-2xl p-3 border border-glass-border flex-shrink-0">
                    <ProductImage
                      src={item.image_url || item.image_path || item.image || item.images?.[0]}
                      alt={item.name}
                      className="w-full h-full object-contain grayscale"
                    />
                  </div>
                  <div className="flex-1 py-1">
                    <h3 className="text-[11px] font-black text-text-primary tracking-widest uppercase mb-1">
                      {item.name}
                    </h3>
                    <p className="text-[9px] text-text-muted uppercase tracking-widest mb-2">
                      {item.category}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] bg-cyan-500/10 px-2 py-0.5 rounded text-cyan-500 font-black tracking-widest uppercase">
                        Qty: {item.qty}
                      </span>
                      <span className="text-sm font-serif text-text-primary font-bold">
                        ${(item.price * item.qty).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-5 border-t border-glass-border pt-10">
              <div className="flex justify-between text-[10px] font-black tracking-[0.3em] uppercase text-text-muted">
                <span>Value</span>
                <span className="text-text-primary">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[10px] font-black tracking-[0.3em] uppercase text-text-muted">
                <span>Concierge Tax (12%)</span>
                <span className="text-text-primary">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-end pt-10 border-t border-glass-border mt-10">
                <div>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.5em] block mb-2 opacity-60">
                    Total Amount
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-serif text-cyan-500 font-bold tracking-tighter">
                      ${total.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-text-muted font-bold tracking-widest uppercase">
                      USD
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

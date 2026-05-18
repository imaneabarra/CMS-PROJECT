import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Request failed.');
      toast.success('Security code sent!');
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);
    } catch (error) {
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-aether-800">
      <div className="absolute inset-0 hero-glow opacity-30" />
      <div className="absolute inset-0 hero-lines opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-aether-700 border border-glass-border rounded-2xl p-10 md:p-12 shadow-2xl mt-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white/5 border border-white/10 p-1.5 rounded-lg flex items-center justify-center shadow-inner">
                <img src="/cms-global-logo.png" alt="CMS GLOBAL" className="h-6 w-auto object-contain" />
              </div>
              <span className="font-serif italic text-xl text-cyan-500 tracking-[0.1em] font-semibold">CMS GLOBAL</span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {!sent ? (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-10">
                  <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                    <ShieldCheck className="w-7 h-7 text-cyan-500" />
                  </div>
                  <h1 className="font-serif text-2xl text-text-primary tracking-widest uppercase font-bold">Forgot Password?</h1>
                  <p className="text-text-muted text-[10px] mt-3 tracking-[0.25em] uppercase font-bold leading-relaxed">
                    Enter your email and we'll send<br/>a secure reset link.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 font-bold">Registered Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="name@example.com"
                        className="glass-input pl-11 w-full"
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold tracking-[0.3em] uppercase text-[10px] shadow-xl shadow-cyan-500/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>Send Reset Link <ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-text-muted text-[10px] mt-8 uppercase tracking-widest font-bold">
                  Remembered it?{' '}
                  <Link to="/login" className="text-cyan-500 hover:text-cyan-400 font-bold transition-colors">
                    Back to Login
                  </Link>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12 }}
                  className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-cyan-500/20"
                >
                  <CheckCircle className="w-10 h-10 text-cyan-500" />
                </motion.div>
                <h2 className="font-serif text-2xl text-text-primary tracking-widest uppercase font-bold mb-4">Link Sent!</h2>
                <p className="text-text-muted text-[11px] tracking-[0.2em] uppercase font-bold leading-relaxed mb-10">
                  Check your inbox at <span className="text-cyan-500">{email}</span>.<br />
                  The link expires in <span className="text-cyan-500">60 minutes</span>.
                </p>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-[10px] text-text-muted hover:text-cyan-500 transition-colors tracking-[0.3em] uppercase font-bold"
                >
                  <ArrowLeft className="w-4 h-4" /> Return to Login
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

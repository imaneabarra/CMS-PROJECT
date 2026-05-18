import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, CheckCircle, AlertTriangle, ShieldCheck, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Try to get email from navigation state (passed from ForgotPassword)
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Protect the route: if no email, send back to forgot-password
  useEffect(() => {
    if (!email) {
      toast.error('Session expired. Please request a new code.');
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('The security code must be 6 digits.');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          otp,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Verification failed.');

      setSuccess(true);
      toast.success('Identity verified. Password updated.');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message || 'Invalid security code. Please check your email.');
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
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white/5 border border-white/10 p-1.5 rounded-lg flex items-center justify-center shadow-inner">
                <img src="/cms-global-logo.png" alt="CMS GLOBAL" className="h-6 w-auto object-contain" />
              </div>
              <span className="font-serif italic text-xl text-cyan-500 tracking-[0.1em] font-semibold">CMS GLOBAL</span>
            </Link>
          </div>

          <AnimatePresence mode="wait">
            {success ? (
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
                <h2 className="font-serif text-2xl text-text-primary tracking-widest uppercase font-bold mb-4">
                  Account Secured
                </h2>
                <p className="text-text-muted text-[11px] tracking-[0.2em] uppercase font-bold leading-relaxed mb-6">
                  Your identity has been verified and password updated.<br />
                  Redirecting to login portal...
                </p>
                <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="text-center mb-10">
                  <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-cyan-500/20">
                    <ShieldCheck className="w-7 h-7 text-cyan-500" />
                  </div>
                  <h1 className="font-serif text-2xl text-text-primary tracking-widest uppercase font-bold">Authentication</h1>
                  <p className="text-text-muted text-[10px] mt-3 tracking-[0.25em] uppercase font-bold leading-relaxed">
                    Enter the 6-digit code sent to<br />
                    <span className="text-cyan-500">{email}</span>
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6 flex items-start gap-3"
                  >
                    <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-400 text-[10px] uppercase tracking-widest font-bold leading-relaxed">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* OTP Code */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 font-bold">Security Code</label>
                    <div className="relative">
                      <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        required
                        maxLength={6}
                        placeholder="000000"
                        className="glass-input pl-11 w-full tracking-[1em] text-center font-mono text-lg"
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 font-bold">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        placeholder="••••••••"
                        className="glass-input pl-11 pr-11 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 font-bold">Confirm Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                        placeholder="••••••••"
                        className="glass-input pl-11 pr-11 w-full"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                      >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
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
                      <>Verify & Set Password <ArrowRight className="w-4 h-4" /></>
                    )}
                  </motion.button>
                </form>

                <p className="text-center text-text-muted text-[10px] mt-8 uppercase tracking-widest font-bold">
                  Didn't get the code?{' '}
                  <Link to="/forgot-password" className="text-cyan-500 hover:text-cyan-400 font-bold transition-colors">
                    Resend Code
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

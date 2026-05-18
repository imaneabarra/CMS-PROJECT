import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Register = () => {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect away immediately
  React.useEffect(() => {
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : '/shop', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Security tokens do not match.');
      return;
    }

    if (password.length < 8) {
      toast.error('Security token must be at least 8 characters.');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password, confirmPassword);
      toast.success('Account created! Welcome to CMS GLOBAL.', {
        style: { background: '#0f1629', color: '#e2e8f0', border: '1px solid rgba(6,182,212,0.3)' },
        icon: '✦',
      });
      navigate('/shop', { replace: true });
    } catch (error) {
      toast.error(error.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-aether-800 transition-colors duration-500">
      {/* Background */}
      <div className="absolute inset-0 hero-glow opacity-30" />
      <div className="absolute inset-0 hero-lines opacity-20" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        {/* Logo */}


        <div className="bg-aether-700 border border-glass-border rounded-2xl p-10 md:p-12 shadow-2xl mt-20">
          <div className="flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="bg-white/5 border border-white/10 p-1.5 rounded-lg flex items-center justify-center shadow-inner">
                <img src="/cms-global-logo.png" alt="CMS GLOBAL Icon" className="h-6 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-transform group-hover:scale-105" />
              </div>
              <span className="font-serif italic text-xl text-cyan-500 tracking-[0.1em] font-semibold">CMS GLOBAL</span>
            </Link>
          </div>
          <div className="text-center mb-10">
            <h1 className="font-serif text-3xl text-text-primary tracking-widest uppercase font-bold">Join Us</h1>
            <p className="text-text-muted text-[10px] mt-3 tracking-[0.3em] uppercase font-bold">Become a premier member</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 font-bold">Full Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                  className="glass-input pl-11 w-full"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 font-bold">Email Domain</label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Password */}
              <div className="md:col-span-2">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 font-bold">Security Token</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="glass-input pl-11 pr-11 w-full text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>

                {/* Creative Strength Meter */}
                {password && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-2"
                  >
                    <div className="flex justify-between items-center px-1">
                      <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-text-muted">Security Level</span>
                      <span className={`text-[9px] uppercase tracking-[0.2em] font-bold ${
                        password.length < 6 ? 'text-red-500' : 
                        password.length < 10 ? 'text-orange-400' : 
                        /[!@#$%^&*]/.test(password) ? 'text-cyan-500' : 'text-yellow-400'
                      }`}>
                        {password.length < 6 ? 'Vulnerable' : 
                         password.length < 10 ? 'Standard' : 
                         /[!@#$%^&*]/.test(password) ? 'Encrypted' : 'Secured'}
                      </span>
                    </div>
                    <div className="flex gap-1.5 h-1">
                      {[1, 2, 3, 4].map((step) => {
                        const strength = password.length < 6 ? 1 : password.length < 9 ? 2 : password.length < 12 ? 3 : 4;
                        const isActive = step <= strength;
                        return (
                          <motion.div
                            key={step}
                            initial={false}
                            animate={{ 
                              flex: isActive ? 1.5 : 1,
                              backgroundColor: !isActive ? 'rgba(255,255,255,0.05)' : 
                                strength === 1 ? '#ef4444' : 
                                strength === 2 ? '#fb923c' : 
                                strength === 3 ? '#facc15' : '#22d3ee'
                            }}
                            className="rounded-full transition-all duration-500"
                            style={{ 
                              boxShadow: isActive ? `0 0 10px ${
                                strength === 1 ? 'rgba(239,68,68,0.3)' : 
                                strength === 2 ? 'rgba(251,146,60,0.3)' : 
                                strength === 3 ? 'rgba(250,204,21,0.3)' : 'rgba(34,211,238,0.3)'
                              }` : 'none'
                            }}
                          />
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="md:col-span-2">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 font-bold">Confirm Token</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="glass-input pl-11 w-full text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-white font-bold tracking-[0.3em] uppercase text-[10px] shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Establish Account <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-text-muted text-[10px] mt-10 uppercase tracking-widest font-bold">
            Already a member?{' '}
            <Link to="/login" className="text-cyan-500 hover:text-cyan-400 font-bold transition-colors">
              Authorize Session
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;

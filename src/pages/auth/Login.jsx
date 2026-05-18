import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/shop';

  // If user is already logged in, redirect them away
  React.useEffect(() => {
    if (user) {
      navigate(user.role === 'ADMIN' ? '/admin/dashboard' : from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loggedInUser = await login(email, password);
      toast.success('Welcome back!', {
        style: { background: '#0f1629', color: '#e2e8f0', border: '1px solid rgba(6,182,212,0.3)' },
        icon: '✦',
      });
      if (loggedInUser.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      toast.error('Invalid credentials. Please try again.');
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
            <h1 className="font-serif text-3xl text-text-primary tracking-widest uppercase font-bold">Welcome</h1>
            <p className="text-text-muted text-[10px] mt-3 tracking-[0.3em] uppercase font-bold">Authorize your credentials</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[10px] tracking-[0.2em] uppercase text-text-muted font-bold">Security Token</label>
                <Link to="/forgot-password" size="sm" className="text-[10px] text-cyan-500 hover:text-cyan-400 uppercase tracking-widest font-bold transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
                <>Enter the Realm <ArrowRight className="w-4 h-4" /></>
              )}
            </motion.button>
          </form>

          <p className="text-center text-text-muted text-[10px] mt-10 uppercase tracking-widest font-bold">
            New to CMS GLOBAL?{' '}
            <Link to="/register" className="text-cyan-500 hover:text-cyan-400 font-bold transition-colors">
              Join the Collective
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

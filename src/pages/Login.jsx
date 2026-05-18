import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); console.log('Login:', form); };

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }} className="glass-card p-10 md:p-12 shadow-2xl">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.4em] uppercase text-cyan-500 font-bold mb-3 block">Member Portal</span>
            <h1 className="font-serif text-3xl md:text-4xl text-text-primary tracking-widest uppercase font-bold">Welcome Back</h1>
            <p className="mt-3 text-[10px] text-text-muted uppercase tracking-[0.2em] font-bold">Access your GLACIER premier account</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input label="Email Address" type="email" name="email" placeholder="name@example.com" icon={Mail} value={form.email} onChange={handleChange} required />
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[10px] tracking-[0.2em] uppercase text-text-muted font-bold">Security Token</label>
                <Link to="#" className="text-[10px] text-cyan-500 hover:text-cyan-400 transition-colors uppercase font-bold tracking-widest">Forgot Access?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} required className="glass-input pl-11" />
              </div>
            </div>
            <Button type="submit" variant="primary" className="w-full py-4 text-[11px] tracking-[0.3em] font-bold uppercase shadow-xl shadow-cyan-500/20">Authorize Session</Button>
          </form>
          <div className="flex items-center gap-6 my-8">
            <div className="flex-1 h-px bg-glass-border" />
            <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold opacity-60">or</span>
            <div className="flex-1 h-px bg-glass-border" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3.5 rounded-xl border border-glass-border bg-aether-700/50 hover:bg-aether-600 transition-all text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              <span className="text-red-500">G</span> Google Access
            </button>
            <button className="flex items-center justify-center gap-3 py-3.5 rounded-xl border border-glass-border bg-aether-700/50 hover:bg-aether-600 transition-all text-[10px] font-bold uppercase tracking-widest text-text-secondary">
              <span className="text-text-primary">🍎</span> Apple ID
            </button>
          </div>
          <p className="mt-10 text-center text-[10px] text-text-muted uppercase tracking-widest font-bold">
            New to the Realm? <Link to="/register" className="text-cyan-500 hover:text-cyan-400 transition-colors">Join the Collective</Link>
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:block space-y-8">
          <div className="glass-card p-8 space-y-5">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg shadow-cyan-500/5">
              <User className="w-6 h-6 text-cyan-500" />
            </div>
            <h3 className="font-serif text-2xl text-text-primary uppercase tracking-widest font-bold">Exclusive Domain</h3>
            <p className="text-[11px] text-text-secondary leading-relaxed font-bold uppercase tracking-widest opacity-80">Authorize your credentials to explore our limited-run archival releases and bespoke concierge services.</p>
          </div>
          <div className="glass-card overflow-hidden border border-glass-border shadow-2xl group">
            <div className="relative aspect-video">
              <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=340&fit=crop&q=80" alt="Eternal Permafrost" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-aether-900 via-aether-900/40 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-[9px] tracking-[0.4em] uppercase text-cyan-500 font-bold mb-2 block">Featured Collection</span>
                <h4 className="font-serif text-xl text-white uppercase tracking-[0.2em] font-bold">Eternal Permafrost</h4>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;

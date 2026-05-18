import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [agreed, setAgreed] = useState(false);
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => { e.preventDefault(); console.log('Register:', form); };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center relative">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img src="https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&h=1080&fit=crop&q=60" alt="" className="w-full h-full object-cover opacity-10" />
        <div className="absolute inset-0 bg-aether-800/80" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 w-full max-w-lg glass-card p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="font-serif text-2xl md:text-3xl text-white tracking-wide">Join the Frozen Realm</h1>
          <p className="mt-2 text-xs text-slate-500 tracking-wide">Create an account to start your collection.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" type="text" name="name" placeholder="John Doe" icon={User} value={form.name} onChange={handleChange} required />
          <Input label="Email Address" type="email" name="email" placeholder="name@example.com" icon={Mail} value={form.email} onChange={handleChange} required />

          <div className="grid grid-cols-2 gap-4">
            <Input label="Password" type="password" name="password" placeholder="••••••••" icon={Lock} value={form.password} onChange={handleChange} required />
            <Input label="Confirm" type="password" name="confirm" placeholder="••••••••" icon={Lock} value={form.confirm} onChange={handleChange} required />
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} className="mt-0.5 w-4 h-4 rounded border-glass-border bg-aether-700 text-cyan-500 focus:ring-cyan-500/40 focus:ring-offset-0" />
            <span className="text-[11px] text-slate-400 leading-relaxed">
              I agree to the <Link to="#" className="text-cyan-400 hover:text-cyan-300">Terms of Service</Link> and <Link to="#" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link>
            </span>
          </label>

          <Button type="submit" variant="primary" className="w-full" disabled={!agreed}>Create Account</Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-glass-border" />
          <span className="text-[10px] text-slate-600 uppercase tracking-wider">or continue with</span>
          <div className="flex-1 h-px bg-glass-border" />
        </div>

        {/* Social */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-glass-border bg-aether-700/30 hover:bg-aether-600/40 text-sm text-slate-300 transition-all">
            <span className="text-red-400 font-bold">G</span> Google
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-glass-border bg-aether-700/30 hover:bg-aether-600/40 text-sm text-slate-300 transition-all">
            <span>🍎</span> Apple
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-slate-500">
          Already have an account? <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors underline">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;

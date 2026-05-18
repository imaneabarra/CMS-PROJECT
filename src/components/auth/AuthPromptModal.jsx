import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, LogIn, UserPlus, ArrowRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const AuthPromptModal = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Glass Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-aether-900/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md glass-card overflow-hidden border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)]"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-text-muted hover:text-cyan-500 transition-colors z-10 p-2 rounded-full hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-10 text-center space-y-8">
              {/* Animated Icon */}
              <div className="relative inline-block">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-20 h-20 bg-cyan-500/10 rounded-3xl flex items-center justify-center border border-cyan-500/20"
                >
                  <Heart className="w-10 h-10 text-cyan-500 fill-cyan-500/20" />
                </motion.div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-aether-800 border border-glass-border rounded-xl flex items-center justify-center shadow-2xl">
                  <span className="text-cyan-500 text-lg">✦</span>
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4">
                <h2 className="text-2xl font-serif text-text-primary italic">Save your favorites 💖</h2>
                <p className="text-text-muted text-[13px] uppercase tracking-[0.2em] leading-relaxed font-medium opacity-80">
                  Login to save your favorite products and access them anytime.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 pt-4">
                <Link 
                  to="/login" 
                  state={{ from: location }}
                  className="w-full py-5 rounded-2xl bg-cyan-500 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all shadow-[0_20px_40px_rgba(6,182,212,0.2)] flex items-center justify-center gap-3 active:scale-95"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
                
                <Link 
                  to="/register"
                  className="w-full py-5 rounded-2xl bg-white/5 border border-glass-border text-text-primary text-[11px] font-black uppercase tracking-[0.4em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-95"
                >
                  <UserPlus className="w-4 h-4" /> Create Account
                </Link>

                <button 
                  onClick={onClose}
                  className="pt-2 text-[10px] text-text-muted uppercase tracking-[0.3em] font-bold hover:text-cyan-500 transition-colors flex items-center justify-center gap-2 group"
                >
                  Continue Browsing <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthPromptModal;

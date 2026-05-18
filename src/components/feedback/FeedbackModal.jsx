import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Heart, Send, MessageSquare, Star, Smile, Meh, Frown, Sparkles } from 'lucide-react';
import api from '../../services/api';

const RatingScale = ({ value, onChange, labelMin = "Poor", labelMax = "Excellent" }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center px-1">
        {Array.from({ length: 11 }).map((_, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.2, y: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(i)}
            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[12px] md:text-[14px] font-medium transition-all duration-300 border ${
              value === i 
                ? 'bg-cyan-500 border-cyan-400 text-white shadow-lg shadow-cyan-500/40' 
                : 'bg-aether-700/50 border-glass-border text-text-muted hover:border-cyan-500/50 hover:text-cyan-400'
            }`}
          >
            {i}
          </motion.button>
        ))}
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-[0.2em] text-text-muted font-bold px-1 opacity-60">
        <span>{labelMin}</span>
        <span>{labelMax}</span>
      </div>
    </div>
  );
};

const FeedbackModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: Ratings, 2: Comment, 3: Success
  const [experience, setExperience] = useState(null);
  const [satisfaction, setSatisfaction] = useState(null);
  const [reaction, setReaction] = useState(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reactions = [
    { icon: Frown, label: "Disappointed", value: "sad", color: "text-red-400" },
    { icon: Meh, label: "Neutral", value: "neutral", color: "text-amber-400" },
    { icon: Smile, label: "Delighted", value: "happy", color: "text-cyan-400" },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const calculatedRating = Math.max(1, Math.ceil(((experience + satisfaction) / 2) / 2));
      const finalMessage = comment.trim() || `Reaction: ${reaction}`;

      await api.post('/feedback', {
        rating: calculatedRating,
        message: finalMessage,
      });
      
      setStep(3);
    } catch (error) {
      console.error('Feedback submission failed:', error);
      alert('Failed to submit feedback. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = experience !== null && satisfaction !== null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-aether-900/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl glass-card overflow-hidden border-cyan-500/20 shadow-2xl shadow-cyan-500/10"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-text-muted hover:text-text-primary transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-12">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <header className="text-center space-y-3">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-2"
                      >
                        <Sparkles className="w-6 h-6 text-cyan-500" />
                      </motion.div>
                      <h2 className="text-2xl md:text-3xl font-serif text-text-primary">
                        We value your opinion <span className="italic">✨</span>
                      </h2>
                      <p className="text-text-muted uppercase tracking-[0.2em] text-[11px] font-bold">
                        Help us craft the perfect experience for you
                      </p>
                    </header>

                    <div className="space-y-12">
                      <section className="space-y-6">
                        <label className="block text-[13px] uppercase tracking-[0.2em] font-bold text-text-secondary text-center">
                          How was your shopping experience?
                        </label>
                        <RatingScale value={experience} onChange={setExperience} />
                      </section>

                      <section className="space-y-6">
                        <label className="block text-[13px] uppercase tracking-[0.2em] font-bold text-text-secondary text-center">
                          How satisfied are you with our platform?
                        </label>
                        <RatingScale value={satisfaction} onChange={setSatisfaction} />
                      </section>

                      <section className="space-y-6">
                        <label className="block text-[13px] uppercase tracking-[0.2em] font-bold text-text-secondary text-center">
                          Overall Vibe
                        </label>
                        <div className="flex justify-center gap-8">
                          {reactions.map((r) => (
                            <motion.button
                              key={r.value}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setReaction(r.value)}
                              className={`flex flex-col items-center gap-3 transition-all duration-300 ${
                                reaction === r.value ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                              }`}
                            >
                              <div className={`p-4 rounded-2xl border ${
                                reaction === r.value 
                                  ? `bg-cyan-500/10 border-cyan-500/40 shadow-lg shadow-cyan-500/10` 
                                  : 'bg-aether-700/50 border-glass-border'
                              }`}>
                                <r.icon className={`w-8 h-8 ${reaction === r.value ? r.color : 'text-text-primary'}`} />
                              </div>
                              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">{r.label}</span>
                            </motion.button>
                          ))}
                        </div>
                      </section>
                    </div>

                    <div className="pt-4">
                      <button
                        disabled={!isStep1Valid}
                        onClick={() => setStep(2)}
                        className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-[12px] uppercase tracking-[0.3em] font-bold transition-all duration-500 ${
                          isStep1Valid 
                            ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-white shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02]' 
                            : 'bg-aether-700 text-text-muted cursor-not-allowed border border-glass-border'
                        }`}
                      >
                        Next Step <Send className="w-4 h-4" />
                      </button>
                      <div className="flex justify-center mt-6 gap-2">
                        <div className="w-2 h-2 rounded-full bg-cyan-500" />
                        <div className="w-2 h-2 rounded-full bg-cyan-500/20" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-10"
                  >
                    <header className="text-center space-y-3">
                      <div className="inline-flex p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 mb-2">
                        <MessageSquare className="w-6 h-6 text-cyan-500" />
                      </div>
                      <h2 className="text-2xl md:text-3xl font-serif text-text-primary">
                        Tell us more <span className="italic">✨</span>
                      </h2>
                      <p className="text-text-muted uppercase tracking-[0.2em] text-[11px] font-bold">
                        Your feedback helps us improve
                      </p>
                    </header>

                    <div className="space-y-6">
                      <div className="relative">
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Tell us about your experience..."
                          className="w-full h-48 glass-input resize-none p-6 pt-8 leading-relaxed focus:ring-cyan-500/30"
                        />
                        <div className="absolute top-0 right-6 -translate-y-1/2 px-4 py-1 bg-aether-800 border border-glass-border rounded-full text-[10px] uppercase tracking-widest font-bold text-cyan-500/70 shadow-xl">
                          Optional
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <button
                        disabled={isSubmitting}
                        onClick={handleSubmit}
                        className="w-full py-5 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-2xl flex items-center justify-center gap-3 text-[12px] uppercase tracking-[0.3em] font-bold shadow-xl shadow-cyan-500/20 hover:shadow-cyan-500/40 hover:scale-[1.02] transition-all duration-500 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="w-5 h-5" />
                          </motion.div>
                        ) : (
                          <>Submit Feedback <Check className="w-4 h-4" /></>
                        )}
                      </button>
                      <button
                        onClick={() => setStep(1)}
                        className="w-full py-4 text-[10px] uppercase tracking-[0.25em] font-bold text-text-muted hover:text-cyan-500 transition-colors"
                      >
                        Go Back
                      </button>
                    </div>

                    <div className="flex justify-center mt-6 gap-2">
                      <div className="w-2 h-2 rounded-full bg-cyan-500/20" />
                      <div className="w-2 h-2 rounded-full bg-cyan-500" />
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-8"
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.2 }}
                      className="w-24 h-24 bg-cyan-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-cyan-500/40 relative"
                    >
                      <Check className="w-12 h-12 text-white stroke-[3]" />
                      <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 rounded-3xl border-2 border-cyan-400"
                      />
                    </motion.div>

                    <div className="space-y-4">
                      <h2 className="text-3xl md:text-4xl font-serif text-text-primary">
                        Thank you <span className="italic text-cyan-500">💖</span>
                      </h2>
                      <p className="text-text-secondary uppercase tracking-[0.2em] text-[12px] font-bold max-w-xs mx-auto leading-relaxed">
                        Your feedback has been received. We appreciate your time and loyalty.
                      </p>
                    </div>

                    <div className="pt-6">
                      <button
                        onClick={onClose}
                        className="px-12 py-5 bg-aether-700 hover:bg-aether-600 border border-glass-border rounded-2xl text-[11px] uppercase tracking-[0.3em] font-bold text-text-primary transition-all duration-300 hover:scale-105"
                      >
                        Close Portal
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, Phone, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import demoService from '../../services/demoService';
import { toast } from 'react-hot-toast';

const DemoRequestModal = ({ isOpen, onClose, product }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    phone: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  if (!isOpen && !success) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Combine date and time
      const scheduled_date = `${formData.date} ${formData.time}`;
      
      await demoService.requestDemo({
        product_id: product.id,
        scheduled_date,
        phone: formData.phone,
        notes: formData.notes
      });

      setSuccess(true);
      toast.success('Technical Demo Requested');
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        toast.error('Failed to schedule demo. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setFormData({ date: '', time: '', phone: '', notes: '' });
    setErrors({});
    onClose();
  };

  return (
    <AnimatePresence>
      {(isOpen || success) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-aether-950/80 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg bg-aether-800 border border-glass-border rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {success ? (
              <div className="p-12 text-center space-y-8">
                <div className="w-20 h-20 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-cyan-500" />
                </div>
                <div className="space-y-4">
                  <h2 className="font-serif text-3xl text-text-primary uppercase tracking-tight font-bold">Request Received</h2>
                  <p className="text-[12px] text-text-secondary leading-relaxed uppercase tracking-[0.15em] font-medium opacity-70">
                    Your technical demo request for <span className="text-cyan-500">{product.name}</span> has been successfully logged. 
                    An enterprise specialist will contact you shortly to confirm the deployment schedule.
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-5 rounded-2xl bg-cyan-500 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all shadow-xl"
                >
                  Return to Archive
                </button>
              </div>
            ) : (
              <>
                <div className="px-10 py-8 border-b border-glass-border flex items-center justify-between bg-aether-900/30">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div>
                      <h2 className="text-[13px] font-black text-text-primary uppercase tracking-[0.2em]">Schedule Demo</h2>
                      <p className="text-[9px] text-text-muted uppercase font-bold tracking-widest mt-0.5">Asset: {product.name}</p>
                    </div>
                  </div>
                  <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
                    <X className="w-5 h-5 text-text-muted" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-10 space-y-8">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                        <Calendar className="w-3 h-3" /> Target Date
                      </label>
                      <input
                        required
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-aether-900/50 border border-glass-border rounded-xl p-4 text-[12px] text-text-primary uppercase tracking-widest focus:ring-1 focus:ring-cyan-500/30 transition-all outline-none"
                      />
                      {errors.scheduled_date && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.scheduled_date[0]}</p>}
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                        <Clock className="w-3 h-3" /> Target Time
                      </label>
                      <input
                        required
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="w-full bg-aether-900/50 border border-glass-border rounded-xl p-4 text-[12px] text-text-primary uppercase tracking-widest focus:ring-1 focus:ring-cyan-500/30 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                      <Phone className="w-3 h-3" /> Contact Frequency (Phone)
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="+212 600 000 000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-aether-900/50 border border-glass-border rounded-xl p-4 text-[12px] text-text-primary uppercase tracking-widest focus:ring-1 focus:ring-cyan-500/30 transition-all outline-none"
                    />
                    {errors.phone && <p className="text-[9px] text-red-500 font-bold uppercase">{errors.phone[0]}</p>}
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] flex items-center gap-2">
                      <MessageSquare className="w-3 h-3" /> Technical Brief / Questions
                    </label>
                    <textarea
                      rows={3}
                      placeholder="DESCRIBE YOUR SPECIFIC REQUIREMENTS..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-aether-900/50 border border-glass-border rounded-xl p-4 text-[12px] text-text-primary uppercase tracking-widest focus:ring-1 focus:ring-cyan-500/30 transition-all outline-none resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-5 rounded-2xl bg-aether-700 border border-glass-border text-[11px] text-text-muted font-bold uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-5 rounded-2xl bg-cyan-500 text-white text-[11px] font-black uppercase tracking-[0.4em] hover:bg-cyan-400 transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Processing...
                        </>
                      ) : 'Confirm Schedule'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DemoRequestModal;

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Phone, FileText, Settings, ShieldCheck, Zap, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "How do I track my hardware delivery?",
    answer: "Once your shipment is processed, you will receive a tracking link via email. Our logistics partners specialize in sensitive electronics transport with full insurance and real-time status updates."
  },
  {
    question: "What is your hardware warranty policy?",
    answer: "All enterprise-grade hardware comes with a standard 3-year manufacturer warranty. We also offer extended support contracts and Advance Replacement (RMA) services for critical infrastructure."
  },
  {
    question: "Do you offer international project deployment?",
    answer: "Yes, CMS GLOBAL operates internationally. We can coordinate with local certified installers or send our own engineering teams for large-scale security and networking projects globally."
  },
  {
    question: "How can I request a technical site survey?",
    answer: "Professional site surveys for CCTV, Access Control, or Wi-Fi planning can be scheduled through your dedicated account manager or by submitting a request through our technical desk."
  }
];

const Support = () => {
  return (
    <div className="min-h-screen pt-32 pb-16 max-w-5xl mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
        <p className="text-[10px] tracking-[0.3em] uppercase text-cyan-500 mb-4 font-bold">Technical Support</p>
        <h1 className="font-serif text-4xl md:text-5xl text-text-primary tracking-wide uppercase font-bold">CMS GLOBAL Support Center</h1>
        <p className="text-text-muted text-sm mt-6 max-w-lg mx-auto leading-relaxed font-bold uppercase tracking-widest text-[11px] opacity-80">
          Our engineering support team is available 24/7 to provide technical assistance, project guidance, and hardware maintenance.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-10 text-center hover:bg-aether-800 transition-all border-glass-border shadow-xl group">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:bg-cyan-500/10 transition-colors">
            <MessageSquare className="w-6 h-6 text-cyan-500" />
          </div>
          <h3 className="text-lg font-serif text-text-primary mb-3 uppercase tracking-widest font-bold">Live Technical Desk</h3>
          <p className="text-xs text-text-secondary mb-8 leading-relaxed font-bold uppercase tracking-widest text-[10px] opacity-70">Chat instantly with our security specialists for immediate configuration assistance.</p>
          <button className="text-[10px] font-bold tracking-[0.3em] text-cyan-500 uppercase hover:text-cyan-400 transition-colors font-black">Open Support Ticket</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-10 text-center hover:bg-aether-800 transition-all border-glass-border shadow-xl group">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:bg-cyan-500/10 transition-colors">
            <Phone className="w-6 h-6 text-cyan-500" />
          </div>
          <h3 className="text-lg font-serif text-text-primary mb-3 uppercase tracking-widest font-bold">Global Hotline</h3>
          <p className="text-xs text-text-secondary mb-8 leading-relaxed font-bold uppercase tracking-widest text-[10px] opacity-70">Call our enterprise support center for inquiries requiring priority engineering response.</p>
          <button className="text-[10px] font-bold tracking-[0.3em] text-cyan-500 uppercase hover:text-cyan-400 transition-colors font-black">+212 522 00 00 00</button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-10 text-center hover:bg-aether-800 transition-all border-glass-border shadow-xl group">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:bg-cyan-500/10 transition-colors">
            <Mail className="w-6 h-6 text-cyan-500" />
          </div>
          <h3 className="text-lg font-serif text-text-primary mb-3 uppercase tracking-widest font-bold">Inquiry Portal</h3>
          <p className="text-xs text-text-secondary mb-8 leading-relaxed font-bold uppercase tracking-widest text-[10px] opacity-70">Send us a detailed technical request and we will reply with a solution within 12 hours.</p>
          <Link to="/contact" className="text-[10px] font-bold tracking-[0.3em] text-cyan-500 uppercase hover:text-cyan-400 transition-colors font-black">Contact Engineering</Link>
        </motion.div>
      </div>

      <div className="glass-card p-10 md:p-16 border-glass-border shadow-2xl">
        <h2 className="text-2xl font-serif text-text-primary mb-12 flex items-center gap-4 uppercase tracking-widest font-bold">
          <FileText className="w-6 h-6 text-cyan-500" /> Technical FAQ
        </h2>
        
        <div className="space-y-10">
          {faqs.map((faq, i) => (
            <div key={i} className="border-b border-glass-border pb-10 last:border-0 last:pb-0">
              <h4 className="text-sm font-bold text-text-primary mb-4 uppercase tracking-wider">{faq.question}</h4>
              <p className="text-xs text-text-secondary leading-relaxed font-bold uppercase tracking-widest opacity-80">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Support;

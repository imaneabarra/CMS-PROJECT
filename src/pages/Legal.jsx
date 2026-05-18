import React from 'react';
import { motion } from 'framer-motion';
import { Shield, FileText, Truck, ChevronLeft } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Legal = () => {
  const location = useLocation();
  const path = location.pathname.substring(1);
  
  const content = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Data Security & Compliance',
      icon: Shield,
      text: 'At CMS GLOBAL, your data is handled with the highest standards of security. We implement enterprise-grade encryption and strict access controls to ensure your project details and personal information are protected according to international data protection regulations.'
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Professional Service Agreement',
      icon: FileText,
      text: 'By utilizing the CMS GLOBAL platform and services, you agree to our standard business terms. We provide professional IT and Security solutions governed by strict SLAs and performance guarantees for our clients.'
    },
    shipping: {
      title: 'Logistics & Deployment',
      subtitle: 'Global Hardware Distribution',
      icon: Truck,
      text: 'We utilize specialized logistics for all hardware deployments. Equipment is fully insured and handled by trained technicians to ensure that all IT and Security hardware arrives in optimal condition for immediate installation.'
    }
  };

  const active = content[path] || content.privacy;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-4xl mx-auto">
      <Link to="/" className="inline-flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-[0.3em] mb-12 hover:gap-4 transition-all">
        <ChevronLeft className="w-4 h-4" /> Return to Dashboard
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-10 md:p-20 space-y-12"
      >
        <header className="space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <active.icon className="w-8 h-8 text-cyan-500" />
          </div>
          <p className="text-cyan-500 text-[10px] tracking-[0.5em] uppercase font-bold">{active.subtitle}</p>
          <h1 className="font-serif text-4xl md:text-5xl text-text-primary italic uppercase tracking-widest">{active.title}</h1>
        </header>

        <div className="space-y-8 text-text-secondary leading-relaxed uppercase tracking-[0.15em] text-[13px] font-medium opacity-80">
          <p>{active.text}</p>
          <p>This document serves as a professional reference for {active.title}. In a production environment, this section would contain detailed legal frameworks and compliance documentation governing the relationship between CMS GLOBAL and its enterprise/residential clients.</p>
          
          <div className="pt-10 border-t border-glass-border">
            <p className="text-[10px] text-text-muted">Last Updated: May 2024</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Legal;

import React, { useState } from 'react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      toast.success("Request submitted successfully! Our engineering team will contact you soon.");
      setFormData({ name: '', email: '', message: '' });
      setLoading(false);
    }, 1200);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container mx-auto px-4 py-32">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.4em] uppercase text-cyan-500 font-bold mb-4 block">Strategic Desk</span>
          <h1 className="text-4xl md:text-6xl font-serif text-text-primary mb-6 uppercase tracking-widest font-bold">Inquiries</h1>
          <p className="text-sm md:text-lg text-text-secondary max-w-2xl mx-auto font-bold uppercase tracking-[0.2em] opacity-80 leading-relaxed">Our technical consultants are available for solution design, project planning, and systems integration assistance.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div className="glass-card p-10 border-glass-border shadow-2xl">
              <h3 className="text-xl font-serif text-text-primary mb-10 uppercase tracking-widest font-bold">Network</h3>
              
              <div className="space-y-10">
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-center justify-center shadow-inner">
                    <Mail className="w-6 h-6 text-cyan-500 shrink-0" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Electronic Mail</p>
                    <a href="mailto:contact@cmsglobal.ma" className="text-sm font-bold text-text-primary hover:text-cyan-500 transition-colors uppercase tracking-widest">contact@cmsglobal.com</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-center justify-center shadow-inner">
                    <Phone className="w-6 h-6 text-cyan-500 shrink-0" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Direct Hotline</p>
                    <a href="tel:+212522000000" className="text-sm font-bold text-text-primary hover:text-cyan-500 transition-colors uppercase tracking-widest">+212 522 00 00 00</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-cyan-500/5 border border-cyan-500/20 rounded-xl flex items-center justify-center shadow-inner">
                    <MapPin className="w-6 h-6 text-cyan-500 shrink-0" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Operational HQ</p>
                    <p className="text-sm font-bold text-text-primary uppercase tracking-widest leading-relaxed">Technopark, Route de Nouaceur<br />Casablanca, Morocco</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-10 border-glass-border space-y-8 shadow-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <Input 
                  label="Full Name / Company" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="E.G. GLOBAL CORP"
                  required 
                />
                <Input 
                  label="Business Email" 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="PRO@COMPANY.COM"
                  required 
                />
              </div>
              
              <div className="flex flex-col">
                <label className="mb-2 text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Project Scope / Technical Request</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6" 
                  required
                  className="bg-aether-800 border border-glass-border rounded-xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-text-primary transition-all placeholder:text-text-muted/40 font-bold uppercase tracking-widest text-xs resize-none shadow-inner"
                  placeholder="DESCRIBE YOUR INFRASTRUCTURE REQUIREMENTS OR SECURITY NEEDS..."
                ></textarea>
              </div>
              
              <Button type="submit" variant="primary" className="w-full py-5 text-[11px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-4" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Technical Request'}
                {!loading && <Send className="w-4 h-4" />}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

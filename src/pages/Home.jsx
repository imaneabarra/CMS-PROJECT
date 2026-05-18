import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Globe, Cpu, Zap, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import ProductCard from '../components/ui/ProductCard';
import DomainCard from '../components/ui/DomainCard';
import domains from '../data/domains';
import FeedbackModal from '../components/feedback/FeedbackModal';


/* ─── Fade-in wrapper ─── */
const FadeIn = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.8, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          const all = data.data || [];
          setFeaturedProducts(all.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="overflow-hidden bg-aether-800 transition-colors duration-500">
      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative min-h-screen flex items-center justify-center">
        {/* Background layers */}
        <div className="absolute inset-0 bg-aether-800 transition-colors duration-700" />
        <div className="absolute inset-0 hero-lines opacity-20" />
        <div className="absolute inset-0 hero-glow opacity-30" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1600')] bg-cover bg-center opacity-10 grayscale" />

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto pt-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: "circOut" }}
          >
            <span className="text-[11px] tracking-[0.5em] uppercase text-cyan-500 font-bold mb-6 block">
              CMS GLOBAL — IT & SECURITY INFRASTRUCTURE
            </span>
            <h1 className="font-serif text-[22px] md:text-[28px] text-text-primary leading-[1.2] tracking-[0.05em] uppercase font-medium mb-8">
              ENGINEERING A{' '}
              <span className="italic text-cyan-500 relative inline-block">
                SECURE
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-cyan-500/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0, 50 5 T 100 5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
              </span>{' '}
              FUTURE
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-8 text-text-secondary max-w-2xl mx-auto text-[14px] md:text-[15px] leading-[1.6] font-medium uppercase tracking-[0.2em] opacity-70"
          >
            Professional-grade electronic security, video surveillance, and enterprise IT infrastructure. 
            Providing cutting-edge technology solutions for corporate and residential safety.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8"
          >
            <Link to="/shop">
              <Button variant="primary" className="px-14 py-6 text-[11px] tracking-[0.4em] uppercase font-bold shadow-2xl shadow-cyan-500/20 active:scale-95 transition-all">
                Explore Inventory
              </Button>
            </Link>
            <Link to="/categories">
              <Button variant="outline" className="px-14 py-6 text-[11px] tracking-[0.4em] uppercase font-bold border-glass-border hover:bg-text-primary hover:text-aether-900 transition-all">
                The Solutions
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 scroll-indicator">
          <span className="text-[10px] tracking-[0.5em] uppercase text-text-muted font-bold opacity-60">Explore</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-cyan-500/50 to-transparent" />
        </div>
      </section>

      {/* ═══════════════ DOMAINS SECTION ═══════════════ */}
      <section className="py-32 px-4 max-w-7xl mx-auto">
        <FadeIn className="text-center mb-24">
          <span className="text-[11px] tracking-[0.4em] uppercase text-cyan-500 font-bold mb-5 block">Professional Expertise</span>
          <h2 className="text-[20px] md:text-[24px] tracking-[0.1em] uppercase font-medium text-text-primary">
            Business Domains
          </h2>
          <div className="w-24 h-[1px] bg-cyan-500/20 mx-auto mt-10" />
        </FadeIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {domains.map((domain, i) => (
            <DomainCard key={domain.id} domain={domain} index={i} />
          ))}
        </div>
      </section>

      {/* ═══════════════ FEATURED PRODUCTS ═══════════════ */}
      <section className="py-32 bg-aether-700 transition-colors duration-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
            <FadeIn className="max-w-2xl">
              <span className="text-[11px] tracking-[0.4em] uppercase text-cyan-500 font-bold mb-5 block">Enterprise Solutions</span>
              <h2 className="text-[20px] md:text-[24px] tracking-[0.1em] uppercase font-medium text-text-primary">
                Featured Systems
              </h2>
              <p className="mt-6 text-text-secondary text-[14px] font-medium leading-relaxed uppercase tracking-[0.2em] opacity-70">
                High-performance hardware from industry leaders, representing the absolute peak of reliability and contemporary security engineering.
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <Link to="/shop" className="group flex items-center gap-4 text-cyan-500 text-[11px] tracking-[0.4em] uppercase font-bold hover:text-cyan-400 transition-all">
                Complete Inventory <ArrowRight className="w-4 h-4 group-hover:translate-x-3 transition-transform" />
              </Link>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ COLLECTIONS PREVIEW ═══════════════ */}
      <section className="py-40 px-4 bg-aether-800 transition-colors duration-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <FadeIn>
              <div className="relative aspect-square rounded-[3rem] overflow-hidden group border border-glass-border shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=1000&h=1000&fit=crop&q=80" 
                  alt="Network Infrastructure" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] grayscale group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-aether-900/80 via-transparent to-transparent" />
                <div className="absolute bottom-12 left-12">
                  <span className="px-5 py-2 bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/20 rounded-full text-[10px] text-cyan-500 tracking-[0.4em] uppercase font-bold shadow-2xl">
                    Enterprise Grade
                  </span>
                  <h3 className="text-[20px] md:text-[24px] font-serif text-text-primary mt-6 uppercase tracking-[0.05em] font-medium leading-tight">Advanced Network<br/>Infrastructure</h3>
                </div>
              </div>
            </FadeIn>

            <div className="space-y-20">
              <FadeIn delay={0.2}>
                <div className="flex flex-col md:flex-row gap-12 items-start group">
                  <div className="w-24 h-24 rounded-3xl bg-cyan-500/5 flex items-center justify-center flex-shrink-0 border border-cyan-500/20 shadow-2xl transition-all group-hover:bg-cyan-500/10 group-hover:scale-110">
                    <Zap className="w-10 h-10 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-[18px] md:text-[20px] font-serif text-text-primary mb-4 uppercase tracking-[0.2em] font-semibold">Scalable Reliability</h3>
                    <p className="text-text-secondary font-medium uppercase tracking-[0.15em] text-[13px] leading-relaxed opacity-60">
                      Deploy systems that are engineered for 24/7 operation, ensuring your security and IT infrastructure remains stable under any load.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.4}>
                <div className="flex flex-col md:flex-row gap-12 items-start group">
                  <div className="w-24 h-24 rounded-3xl bg-cyan-500/5 flex items-center justify-center flex-shrink-0 border border-cyan-500/20 shadow-2xl transition-all group-hover:bg-cyan-500/10 group-hover:scale-110">
                    <ShieldCheck className="w-10 h-10 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-text-primary mb-5 uppercase tracking-[0.3em] font-bold">Certified Engineering</h3>
                    <p className="text-text-secondary font-bold uppercase tracking-[0.2em] text-[11px] leading-relaxed opacity-70">
                      Every installation and product undergoes rigorous validation by our certified engineers to meet CMS GLOBAL excellence standards.
                    </p>
                  </div>
                </div>
              </FadeIn>

              <FadeIn delay={0.6}>
                <div className="flex flex-col md:flex-row gap-12 items-start group">
                  <div className="w-24 h-24 rounded-3xl bg-cyan-500/5 flex items-center justify-center flex-shrink-0 border border-cyan-500/20 shadow-2xl transition-all group-hover:bg-cyan-500/10 group-hover:scale-110">
                    <Activity className="w-10 h-10 text-cyan-500" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-text-primary mb-5 uppercase tracking-[0.3em] font-bold">Strategic Deployment</h3>
                    <p className="text-text-secondary font-bold uppercase tracking-[0.2em] text-[11px] leading-relaxed opacity-70">
                      End-to-end implementation services, maintaining the integrity and performance of your systems from initial design to final deployment.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CALL TO ACTION ═══════════════ */}
      <section className="py-48 relative overflow-hidden">
        <div className="absolute inset-0 bg-aether-700 transition-colors duration-700" />
        <div className="absolute inset-0 hero-lines opacity-10" />
        
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <FadeIn>
            <h2 className="text-[24px] md:text-[32px] font-serif text-text-primary leading-[1.2] mb-12 uppercase tracking-[0.05em] font-medium">
              Empower Your <span className="italic text-cyan-500">Business</span> Infrastructure
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-10">
              <Link to="/register">
                <Button variant="primary" className="px-16 py-6 text-[11px] tracking-[0.4em] uppercase font-bold shadow-2xl shadow-cyan-500/30 active:scale-95 transition-all">
                  Join the Network
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="px-16 py-6 text-[11px] tracking-[0.4em] uppercase font-bold border-glass-border hover:bg-text-primary hover:text-aether-900 transition-all">
                  Speak with Experts
                </Button>
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════════════ FEEDBACK TRIGGER ═══════════════ */}
      <section className="py-20 pb-32 text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsFeedbackOpen(true)}
          className="group relative inline-flex items-center gap-3 text-[11px] tracking-[0.4em] uppercase font-bold text-text-muted hover:text-cyan-500 transition-colors py-4 px-8 border border-glass-border hover:border-cyan-500/30 rounded-full"
        >
          <span className="relative z-10">Want to give feedback?</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 rounded-full transition-colors" />
        </motion.button>
      </section>

      {/* ═══════════════ FEEDBACK MODAL ═══════════════ */}
      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
        userRole="CLIENT"
      />
    </div>
  );
};

export default Home;

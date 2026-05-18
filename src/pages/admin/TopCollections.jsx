import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, TrendingUp, Camera, Shield, Wifi, Monitor, Printer, Home, Laptop, Lock, MousePointer2, HardDrive, Smartphone, Briefcase, Bell, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const categoryIcons = {
  'Video Surveillance': Camera,
  'CCTV Cameras': Camera,
  'Access Control': Shield,
  'Networking': Wifi,
  'PC Portables': Laptop,
  'PC Bureau': Monitor,
  'Printers & Scanners': Printer,
  'Smart Home / Domotics': Home,
  'Security Systems': Lock,
  'Accessories & Peripherals': MousePointer2,
  'Storage Devices': HardDrive,
  'Monitors': Monitor,
  'Smart Devices': Smartphone,
  'Office Equipment': Briefcase,
  'Alarm Systems': Bell,
};

const categoryImages = {
  'Video Surveillance': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
  'CCTV Cameras': 'https://images.unsplash.com/photo-1551817812-790176866160?w=800',
  'Access Control': 'https://images.unsplash.com/photo-1555864326-5cf22ef123cf?w=800',
  'Networking': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
  'PC Portables': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
  'PC Bureau': 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800',
  'Printers & Scanners': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
  'Smart Home / Domotics': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
  'Security Systems': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800',
  'Accessories & Peripherals': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
  'Storage Devices': 'https://images.unsplash.com/photo-1597872200349-016042e54a65?w=800',
  'Monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
  'Smart Devices': 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800',
  'Office Equipment': 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800',
  'Alarm Systems': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
};

const TopCollections = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);
        
        setProducts(prodRes.data.data || prodRes.data || []);
        setCategories(catRes.data.data || catRes.data || []);
      } catch (err) {
        console.error('Failed to fetch collections data:', err);
        toast.error("Failed to load real-time category intelligence");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Top Sellers: Sorted by some metric (currently just slice for demo, but real data)
  const topSellers = products.slice(0, 6);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          to="/admin/dashboard"
          className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted hover:text-cyan-500 transition-colors w-fit"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Intelligence
        </Link>
        <div>
          <h1 className="text-[28px] md:text-[32px] font-serif text-text-primary tracking-tight font-semibold uppercase italic">Hardware Sectors</h1>
          <p className="text-[13px] text-text-muted mt-2 max-w-2xl leading-relaxed font-medium opacity-70">
            Real-time performance overview of CMS GLOBAL's technical divisions. Monitor artifact distribution and sector valuations.
          </p>
        </div>
      </div>

      {/* Category Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card h-60 animate-pulse bg-aether-700/50 border-glass-border flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-cyan-500 animate-spin opacity-20" />
            </div>
          ))
        ) : (
          categories.map((cat, i) => {
            const Icon = categoryIcons[cat.name] || Shield;
            const imgSrc = categoryImages[cat.name] || 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800';
            const catProducts = products.filter(p => {
              const pCat = typeof p.category === 'object' ? p.category?.name : p.category;
              return pCat === cat.name;
            });
            const totalValue = catProducts.reduce((sum, p) => sum + Number(p.price), 0);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card overflow-hidden group border-glass-border hover:border-cyan-500/30 transition-all shadow-xl"
              >
                <div className="h-48 relative overflow-hidden">
                  <img
                    src={imgSrc}
                    alt={cat.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-aether-900 via-aether-900/40 to-transparent opacity-70" />
                  <div className="absolute bottom-4 left-6">
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-400 mb-1 block flex items-center gap-1">
                      <Icon className="w-3 h-3 inline mr-1" />CMS GLOBAL Division
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-widest uppercase font-serif">{cat.name}</h3>
                  </div>
                </div>
                <div className="p-6 flex justify-between items-center bg-aether-800/50">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold opacity-60">Inventory Assets</p>
                    <p className="text-lg font-bold text-text-primary mt-1">{catProducts.length} Hardware Units</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-all">
                    <TrendingUp className="w-5 h-5 text-cyan-500" />
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Top Sellers Section */}
      <div className="pt-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-[1px] flex-1 bg-glass-border opacity-30" />
          <h3 className="text-[11px] font-bold text-text-primary uppercase tracking-[0.4em] px-4">Synchronized Hardware Registry</h3>
          <div className="h-[1px] flex-1 bg-glass-border opacity-30" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topSellers.map((product, i) => {
            const catName = typeof product.category === 'object' ? product.category?.name : product.category;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="glass-card p-5 flex gap-5 items-center hover:bg-aether-700/50 transition-all border-glass-border group relative overflow-hidden"
              >
                <div className="w-20 h-20 rounded-xl bg-aether-800 border border-glass-border overflow-hidden p-2 flex-shrink-0 relative z-10 shadow-inner">
                  <img
                    src={product.image_url || product.image || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&h=100&fit=crop'}
                    alt={product.name}
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute top-1 right-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </div>
                </div>
                <div className="min-w-0 flex-1 relative z-10">
                  <span className="text-[8px] font-bold text-cyan-500 uppercase tracking-widest block mb-1">{catName || 'General Sector'}</span>
                  <h4 className="text-[13px] font-bold text-text-primary uppercase tracking-tight truncate group-hover:text-cyan-400 transition-colors">{product.name}</h4>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm font-bold text-text-secondary font-serif">${Number(product.price).toLocaleString()}</p>
                    <span className="text-[9px] font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">Verified Asset</span>
                  </div>
                </div>
                <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl group-hover:bg-cyan-500/10 transition-all" />
              </motion.div>
            );
          })}
          {topSellers.length === 0 && !loading && (
            <div className="col-span-3 py-20 text-center text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-40">
              No hardware assets recorded in master database
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopCollections;

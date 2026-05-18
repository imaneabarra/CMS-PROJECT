import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const categoryDescriptions = {
  'video-surveillance': 'Professional IP cameras, NVRs, and recording solutions for comprehensive monitoring.',
  'cctv-cameras': 'High-definition analog and IP cameras for every security requirement.',
  'access-control': 'Advanced biometric, facial recognition, and RFID access management systems.',
  'networking': 'Enterprise-grade switches, routers, and wireless infrastructure for reliable connectivity.',
  'pc-portables': 'High-performance business laptops and mobile workstations for professionals.',
  'pc-bureau': 'Robust desktop computers and towers engineered for productivity and stability.',
  'printers-scanners': 'Reliable printing and document scanning solutions for modern offices.',
  'smart-home-domotics': 'Intelligent home automation, climate control, and interconnected devices.',
  'security-systems': 'Integrated security solutions for residential and commercial protection.',
  'accessories-peripherals': 'Essential computer accessories, ergonomic mice, and professional keyboards.',
  'storage-devices': 'High-capacity SSDs, HDDs, and networked storage solutions.',
  'monitors': 'Ultra-high-definition displays and professional monitors for critical viewing.',
  'smart-devices': 'Smart assistants, wearables, and intelligent connected hardware.',
  'office-equipment': 'Professional shredders, labelers, and essential office productivity tools.',
  'alarm-systems': 'Wireless and wired alarm kits with remote mobile monitoring.',
};

const categoryImages = {
  'video-surveillance': 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80',
  'cctv-cameras': 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&q=80',
  'access-control': 'https://images.unsplash.com/photo-1555864326-5cf22ef123cf?w=800',
  'networking': 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800',
  'pc-portables': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800',
  'pc-bureau': 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=800',
  'printers-scanners': 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800',
  'smart-home-domotics': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
  'security-systems': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
  'accessories-peripherals': 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800',
  'storage-devices': 'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&q=80',
  'monitors': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800',
  'smart-devices': 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=800',
  'office-equipment': 'https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800',
  'alarm-systems': 'https://images.unsplash.com/photo-1558002038-1055907df827?w=800',
};

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        setCategories(data.data || data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch categories', err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-7xl mx-auto px-4 transition-colors duration-500">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-24">
        <span className="text-[11px] tracking-[0.5em] uppercase text-cyan-500 font-bold mb-6 block">CMS GLOBAL Solutions</span>
        <h1 className="font-serif text-5xl md:text-7xl text-text-primary mb-8 uppercase tracking-tighter font-bold leading-tight">Business Domains</h1>
        <p className="text-text-secondary text-xs md:text-sm mt-8 max-w-3xl mx-auto leading-relaxed font-bold uppercase tracking-[0.3em] opacity-80">
          Explore our professional portfolio of IT and Security products. Each domain is structured to provide high-performance solutions for your enterprise needs.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-10 h-10 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.1, duration: 0.8 }}
              className="group relative rounded-[2.5rem] overflow-hidden aspect-[4/5] bg-aether-700 border border-glass-border shadow-2xl hover:border-cyan-500/30 transition-all duration-700"
            >
              <img
                src={categoryImages[cat.slug] || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800'}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-[2000ms] grayscale group-hover:grayscale-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <span className="text-[10px] tracking-[0.4em] uppercase text-cyan-500 mb-4 font-black">CMS GLOBAL Domain</span>
                <h2 className="text-3xl font-serif text-white mb-6 group-hover:text-cyan-400 transition-colors uppercase tracking-widest font-bold leading-tight">{cat.name}</h2>
                <p className="text-[11px] text-white/70 max-w-xs mb-8 opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700 leading-relaxed font-bold uppercase tracking-[0.2em]">
                  {categoryDescriptions[cat.slug] || 'Comprehensive professional solutions for your business.'}
                </p>
                <Link
                  to={`/categories/${cat.slug}`}
                  className="inline-flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-white w-max hover:text-cyan-400 transition-all active:scale-95 group/link"
                >
                  Enter Archive <ArrowRight className="w-5 h-5 group-hover/link:translate-x-3 transition-transform" />
                </Link>
              </div>

              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;

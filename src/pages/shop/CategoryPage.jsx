import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutGrid, List, Loader2 } from 'lucide-react';
import ProductCard from '../../components/ui/ProductCard';
import api from '../../services/api';

const categoryMeta = {
  'video-surveillance': { name: 'Video Surveillance', description: 'Professional IP cameras, NVRs, DVRs, and CCTV systems for enterprise-level monitoring.' },
  'cctv-cameras': { name: 'CCTV Cameras', description: 'High-definition analog and IP cameras for every security requirement.' },
  'access-control': { name: 'Access Control', description: 'Biometric readers, RFID systems, and electromagnetic locks for secure perimeter management.' },
  'networking': { name: 'Networking', description: 'Managed switches, enterprise routers, Wi-Fi access points, and structured cabling.' },
  'pc-portables': { name: 'PC Portables', description: 'Business laptops, desktop PCs, workstations, and professional monitors.' },
  'pc-bureau': { name: 'PC Bureau', description: 'Reliable desktop tower systems for business and enterprise productivity.' },
  'printers-scanners': { name: 'Printers & Scanners', description: 'Laser printers, inkjet systems, and high-speed document scanners.' },
  'smart-home-domotics': { name: 'Smart Home / Domotics', description: 'Video intercoms, alarm systems, UPS solutions, and smart home automation.' },
  'security-systems': { name: 'Security Systems', description: 'Integrated security solutions for residential and commercial protection.' },
  'accessories-peripherals': { name: 'Accessories & Peripherals', description: 'Essential computer accessories, ergonomic mice, and professional keyboards.' },
  'storage-devices': { name: 'Storage Devices', description: 'High-capacity SSDs, HDDs, and networked storage solutions.' },
  'monitors': { name: 'Monitors', description: 'Ultra-high-definition displays and professional monitors for critical viewing.' },
  'smart-devices': { name: 'Smart Devices', description: 'Smart assistants, wearables, and intelligent connected hardware.' },
  'office-equipment': { name: 'Office Equipment', description: 'Professional shredders, labelers, and essential office productivity tools.' },
  'alarm-systems': { name: 'Alarm Systems', description: 'Wireless and wired alarm kits with remote mobile monitoring.' },
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [viewMode, setViewMode] = useState('grid');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setAllProducts(response.data.data || []);
      } catch (error) {
        console.error('Failed to fetch category products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categoryData = categoryMeta[slug] || { name: slug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), description: 'Explore our curated technical selection.' };

  const products = useMemo(() => {
    return allProducts.filter(p => {
      const catSlug = typeof p.category === 'object' ? p.category?.slug : null;
      const catName = typeof p.category === 'object' ? p.category?.name : p.category;
      return catSlug === slug || catName === categoryData.name;
    });
  }, [slug, allProducts, categoryData.name]);

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 max-w-7xl mx-auto transition-colors duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-4 text-[10px] tracking-[0.4em] uppercase text-text-muted mb-12 font-bold">
        <Link to="/" className="hover:text-cyan-500 transition-colors">Home</Link>
        <span className="opacity-20">/</span>
        <Link to="/categories" className="hover:text-cyan-500 transition-colors">Sectors</Link>
        <span className="opacity-20">/</span>
        <span className="text-text-primary font-black">{categoryData.name}</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-end mb-20 gap-12 border-b border-glass-border pb-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl">
          <span className="text-[11px] tracking-[0.5em] uppercase text-cyan-500 font-bold mb-6 block">CMS GLOBAL Division</span>
          <h1 className="font-serif text-5xl md:text-7xl text-text-primary mb-8 uppercase tracking-tighter font-bold leading-tight">
            {categoryData.name}
          </h1>
          <p className="text-text-secondary text-xs md:text-sm font-bold leading-relaxed uppercase tracking-[0.3em] opacity-80">
            {categoryData.description}
          </p>
        </motion.div>

        <div className="flex items-center gap-10">
          <div className="text-right">
            <p className="text-[10px] tracking-[0.4em] text-text-muted uppercase mb-2 font-bold opacity-60">Assets in Sector</p>
            <p className="text-5xl font-serif text-text-primary font-bold tracking-tighter">{products.length}</p>
          </div>
          <div className="flex gap-4 p-1.5 bg-aether-700/50 rounded-2xl border border-glass-border shadow-xl">
            <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all active:scale-95 ${viewMode === 'grid' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-text-muted hover:text-text-primary'}`}>
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all active:scale-95 ${viewMode === 'list' ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20' : 'text-text-muted hover:text-text-primary'}`}>
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
        </div>
      ) : products.length > 0 ? (
        <div className={viewMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
          : "flex flex-col gap-10"
        }>
          {products.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      ) : (
        <div className="py-40 text-center border border-glass-border rounded-[3rem] bg-aether-700/30 backdrop-blur-md">
          <p className="text-text-muted text-[11px] font-bold uppercase tracking-[0.5em] mb-10 opacity-60">No technical assets found in this sector registry.</p>
          <Link to="/shop">
            <button className="px-12 py-5 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-white transition-all shadow-xl active:scale-95">
              Browse Master Archive
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;

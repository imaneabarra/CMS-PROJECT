import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Heart, ShoppingBag, ChevronDown, Loader2 } from 'lucide-react';
import { useSearch } from '../../context/SearchContext';
import ProductCard from '../../components/ui/ProductCard';
import api from '../../services/api';

const sorts = ['Featured', 'Price: Low–High', 'Price: High–Low', 'Newest'];

const Shop = () => {
  const { searchQuery, setSearchQuery } = useSearch();
  const [products, setProducts] = useState([]);
  const [dbCategories, setDbCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat]     = useState('All');
  const [sort, setSort]   = useState('Featured');
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products'),
          api.get('/categories')
        ]);

        setProducts(prodRes.data.data || []);
        setDbCategories(catRes.data.data || catRes.data);
      } catch (error) {
        console.error('Failed to fetch shop data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ['All', ...dbCategories.map(c => c.name)];

  const activeSearch = searchQuery || localSearch;

  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let list = [...products];
    if (cat !== 'All') {
      list = list.filter(p => {
        const pCatName = typeof p.category === 'object' ? p.category?.name : p.category;
        return pCatName === cat;
      });
    }
    if (activeSearch) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        p.description?.toLowerCase().includes(activeSearch.toLowerCase())
      );
    }
    if (sort === 'Price: Low–High') list.sort((a, b) => Number(a.price) - Number(b.price));
    if (sort === 'Price: High–Low') list.sort((a, b) => Number(b.price) - Number(a.price));
    return list;
  }, [cat, sort, activeSearch, products]);

  const handleLocalSearch = (e) => {
    setLocalSearch(e.target.value);
    if (searchQuery) setSearchQuery('');
  };

  const clearAll = () => { setLocalSearch(''); setSearchQuery(''); setCat('All'); };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 max-w-7xl mx-auto transition-colors duration-500">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="pb-12 border-b border-glass-border">
        <p className="text-[11px] tracking-[0.4em] uppercase text-cyan-500 mb-5 font-bold">The CMS GLOBAL Archive</p>
        <h1 className="font-serif text-[24px] md:text-[28px] text-text-primary tracking-[0.05em] uppercase font-medium leading-tight italic">Master Hardware Catalog</h1>
        <p className="text-text-muted text-[11px] mt-6 uppercase tracking-[0.2em] font-medium opacity-60">Consulting {filtered.length} technical assets</p>
      </motion.div>

      {/* Navigation Controls */}
      <div className="sticky top-20 z-30 py-8 bg-aether-800/90 backdrop-blur-2xl border-b border-glass-border mb-12">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-cyan-500 transition-colors" />
            <input 
              value={activeSearch} 
              onChange={handleLocalSearch} 
              placeholder="Search by name, category, or specs..." 
              className="glass-input pl-14 pr-12 w-full py-4 text-[13px] font-medium uppercase tracking-[0.15em] bg-aether-700/50" 
            />
            {activeSearch && (
              <button onClick={clearAll} className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-red-500 transition-colors p-1">
                <span className="text-[11px] uppercase font-bold tracking-tight">Clear</span>
              </button>
            )}
          </div>
          <div className="relative min-w-[240px]">
            <select 
              value={sort} 
              onChange={e => setSort(e.target.value)} 
              className="glass-input px-6 pr-12 py-4 appearance-none cursor-pointer w-full font-medium text-[12px] uppercase tracking-[0.2em] bg-aether-700/50"
            >
              {sorts.map(s => <option key={s} value={s} className="bg-aether-700 text-text-primary">{s}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
          </div>
        </div>
      </div>

      {activeSearch && (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="mb-12 p-6 rounded-3xl bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-secondary">
            Displaying hardware matching <strong className="text-cyan-500 font-black">"{activeSearch}"</strong> — {filtered.length} results
          </span>
          <button onClick={clearAll} className="text-cyan-500 text-[10px] font-black uppercase tracking-[0.4em] hover:text-cyan-400 transition-colors">Reset</button>
        </motion.div>
      )}

      {/* Domain Selection */}
      <div className="flex gap-4 flex-wrap mb-16">
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)}
            className={`px-6 py-3.5 rounded-xl text-[12px] font-medium uppercase tracking-[0.2em] transition-all border shadow-lg active:scale-95
              ${cat === c 
                ? 'bg-cyan-500 text-white border-cyan-500 shadow-cyan-500/20' 
                : 'bg-aether-700 text-text-muted border-glass-border hover:text-text-primary hover:border-text-muted'}`}>
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-6" />
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-muted animate-pulse">Synchronizing Hardware Database...</p>
        </div>
      ) : (
        <>
          {/* Artifact Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-40 bg-aether-700/30 rounded-[3rem] border border-glass-border mt-16">
              <p className="text-text-muted text-[11px] font-bold uppercase tracking-[0.5em] mb-8 opacity-60">No hardware found in the current sector.</p>
              <button onClick={clearAll} className="px-10 py-4 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-white transition-all">Reset Archive Filter</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Shop;

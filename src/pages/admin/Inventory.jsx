import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Pencil, Trash2, X, AlertTriangle, Upload, Image as ImageIcon, Loader2, RefreshCcw } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { toast } from 'react-hot-toast';
import api from '../../services/api';
import ProductImage from '../../components/ui/ProductImage';

const categoryColors = {
  'video-surveillance': 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-blue-500/5',
  'cctv-cameras': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-indigo-500/5',
  'access-control': 'bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-purple-500/5',
  'networking': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-cyan-500/5',
  'pc-portables': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5',
  'pc-bureau': 'bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-teal-500/5',
  'printers-scanners': 'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-amber-500/5',
  'smart-home-domotics': 'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5',
  'security-systems': 'bg-red-500/10 text-red-400 border-red-500/20 shadow-red-500/5',
  'accessories-peripherals': 'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-orange-500/5',
  'storage-devices': 'bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-violet-500/5',
  'monitors': 'bg-lime-500/10 text-lime-400 border-lime-500/20 shadow-lime-500/5',
  'smart-devices': 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 shadow-fuchsia-500/5',
  'office-equipment': 'bg-slate-500/10 text-slate-400 border-slate-500/20 shadow-slate-500/5',
  'alarm-systems': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-yellow-500/5',
};

const emptyForm = { 
  name: '', 
  collection: '', 
  category: '', 
  price: '', 
  stock: '', 
  badge: '', 
  description: '',
  image: null 
};

const Inventory = () => {
  const { theme } = useTheme();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(null); // null | 'add' | 'edit'
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Fetch data
  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    console.log("[Inventory] Fetching latest products and categories...");
    
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);

      console.log("[Inventory] API Response received:", { products: prodRes.data.data?.length, categories: catRes.data.data?.length });
      
      setProducts(prodRes.data.data || []);
      setCategories(catRes.data.data || catRes.data);
    } catch (err) {
      console.error('[Inventory] Fetch error:', err);
      toast.error("Failed to load inventory");
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Robust filtering
  const filtered = products.filter(p => {
    const searchLower = search.toLowerCase();
    const nameMatch = p.name?.toLowerCase().includes(searchLower);
    const catName = typeof p.category === 'object' ? p.category?.name : p.category;
    const catMatch = catName?.toLowerCase().includes(searchLower);
    const collectionMatch = p.collection?.toLowerCase().includes(searchLower);
    return nameMatch || catMatch || collectionMatch;
  });

  const openAdd = () => { 
    setForm(emptyForm); 
    setPreviewUrl(null); 
    setImageFile(null);
    setModal('add'); 
  };

  const openEdit = (p) => {
    setForm({ 
      name: p.name || '', 
      collection: p.collection || '', 
      category: typeof p.category === 'object' ? p.category.slug : (p.category || ''), 
      price: p.price || '', 
      stock: p.stock || 0, 
      badge: p.badge || '', 
      description: p.description || '',
      image: p.image_url || p.image || null
    });
    setPreviewUrl(p.image_url || p.image || null);
    setImageFile(null);
    setEditId(p.id);
    setModal('edit');
  };

  const closeModal = () => { 
    setModal(null); 
    setEditId(null); 
    setPreviewUrl(null); 
    setImageFile(null);
    setSaving(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    if (!form.name || !form.category || !form.price || !form.description) {
      toast.error("Please fill in all required fields (Name, Category, Price, Description)");
      return;
    }

    setSaving(true);
    console.log("[Inventory] Attempting to save product:", form);

    try {
      const categoryObj = categories.find(c => c.slug === form.category || c.name.toLowerCase() === form.category.toLowerCase());
      if (!categoryObj) {
        toast.error('Invalid category selection');
        setSaving(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('category_id', categoryObj.id);
      formData.append('price', form.price);
      formData.append('stock', form.stock || 0);
      formData.append('description', form.description);
      formData.append('collection', form.collection || '');
      formData.append('badge', form.badge || '');
      
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (modal === 'edit') {
        formData.append('_method', 'PUT');
      }

      const url = modal === 'add' ? '/products' : `/products/${editId}`;
      console.log("[Inventory] Sending request to:", url, "Method: POST");

      const response = await api.post(url, formData);

      console.log("[Inventory] Save success:", response.data);
      toast.success(modal === 'add' ? "New hardware registered" : "Record updated");
      
      await fetchData(false);
      closeModal();
    } catch (err) {
      console.error('[Inventory] Save failed:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || err.response?.data?.error || "Connection error";
      toast.error(`Save Failed: ${errorMsg}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => { 
    try {
      await api.delete(`/products/${id}`);
      toast.success("Artifact eliminated");
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('[Inventory] Delete failed:', err);
      toast.error("Elimination failed");
    }
    setDeleteConfirm(null); 
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-serif text-text-primary uppercase tracking-tight font-semibold">Product Inventory</h1>
          <p className="text-[12px] text-text-muted mt-1.5 uppercase tracking-[0.1em] font-medium opacity-70">CMS GLOBAL Master Database Management</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchData()} 
            disabled={loading}
            className="p-2.5 rounded-xl border border-glass-border text-text-muted hover:text-cyan-500 hover:bg-aether-800 transition-all"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vault..." className="bg-aether-700 border border-glass-border rounded-xl pl-9 pr-4 py-2 text-xs text-text-secondary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-cyan-500/30 w-48 sm:w-64" />
          </div>
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500 text-white rounded-xl text-[13px] font-medium hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 uppercase tracking-[0.2em]">
            <Plus className="w-4 h-4" /> New Artifact
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-aether-700 border border-glass-border rounded-2xl overflow-hidden shadow-sm min-h-[400px] relative">
        {loading && (
          <div className="absolute inset-0 bg-aether-900/40 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500">Accessing Database...</p>
            </div>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-glass-border bg-aether-800/30">
                {['Image', 'Product details', 'Category', 'Stock Status', 'Price', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-[12px] tracking-[0.15em] uppercase text-text-muted font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-glass-border">
              <AnimatePresence mode='popLayout'>
                {filtered.map(p => {
                  const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                  const catSlug = typeof p.category === 'object' ? p.category?.slug : p.category;
                  return (
                    <motion.tr 
                      key={p.id} 
                      layout
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="hover:bg-aether-800/30 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-aether-800 border border-glass-border p-1">
                          <ProductImage src={p.image_url || p.image} alt={p.name} className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all duration-500" />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-[14px] text-text-primary font-semibold tracking-tight uppercase">{p.name}</p>
                        <p className="text-[12px] text-text-muted mt-1 uppercase tracking-widest font-medium opacity-60">{p.collection || 'General Archive'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-widest ${categoryColors[catSlug] || 'bg-slate-500/15 text-slate-400 border-slate-500/20'}`}>
                          {catName || 'Uncategorized'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1.5">
                          <span className={`text-[12px] font-semibold uppercase tracking-wider ${p.stock <= 5 ? 'text-amber-500' : 'text-text-secondary'}`}>
                            {p.stock} units
                          </span>
                          <div className="w-20 h-1 bg-aether-600 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${p.stock <= 5 ? 'bg-amber-500' : 'bg-cyan-500'}`} style={{ width: `${Math.min(p.stock * 5, 100)}%` }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-cyan-500 font-bold font-serif">${Number(p.price).toLocaleString()}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => openEdit(p)} className="p-2 rounded-lg text-text-muted hover:text-cyan-500 hover:bg-cyan-500/10 transition-all border border-transparent hover:border-cyan-500/20">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeleteConfirm(p.id)} className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        
        {filtered.length === 0 && !loading && (
          <div className="py-20 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-text-muted opacity-40">No matching artifacts found</p>
          </div>
        )}

        <div className="px-6 py-4 border-t border-glass-border text-[10px] tracking-widest uppercase text-text-muted font-bold flex justify-between items-center">
          <span>Inventory Audit: {filtered.length} products</span>
          <span className="opacity-40 font-mono">DB_SYNC_ACTIVE</span>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="w-full max-w-4xl bg-aether-700 border border-glass-border rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
              {/* Left Side: Image */}
              <div className="w-full md:w-2/5 bg-aether-800 p-8 border-b md:border-b-0 md:border-r border-glass-border flex flex-col items-center justify-center space-y-6">
                <div className="relative group w-full aspect-square max-w-[280px]">
                  {previewUrl ? (
                    <ProductImage src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-2xl border border-glass-border shadow-2xl" />
                  ) : (
                    <div className="w-full h-full bg-aether-900/50 border-2 border-dashed border-glass-border rounded-2xl flex flex-col items-center justify-center text-text-muted gap-3">
                      <ImageIcon className="w-12 h-12" />
                      <p className="text-[10px] font-bold uppercase tracking-widest">No image selected</p>
                    </div>
                  )}
                  <button 
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl text-white gap-2"
                  >
                    <Upload className="w-8 h-8" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                </div>
                <p className="text-[10px] text-text-muted text-center uppercase tracking-widest font-bold opacity-60">High-Resolution Hardware Photography</p>
              </div>

              {/* Right Side: Form */}
              <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[20px] font-serif text-text-primary tracking-tight uppercase font-semibold">{modal === 'add' ? 'Register New Hardware' : 'Update Record'}</h3>
                  <button onClick={closeModal} className="p-2 rounded-full text-text-muted hover:text-text-primary hover:bg-aether-800 transition-all"><X className="w-5 h-5" /></button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 block font-bold">Hardware Designation</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="glass-input" placeholder="e.g. Hikvision 4K IP Camera" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 block font-bold">Model Reference</label>
                    <input type="text" value={form.collection} onChange={e => setForm(f => ({ ...f, collection: e.target.value }))}
                      className="glass-input" placeholder="e.g. DS-2CD2183G0-I" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 block font-bold">Category Sector</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                      className="glass-input appearance-none">
                      <option value="" disabled className="bg-aether-700">Select Sector</option>
                      {categories.map(c => <option key={c.id} value={c.slug} className="bg-aether-700 uppercase tracking-tighter">{c.name}</option>)}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 block font-bold">Valuation ($)</label>
                    <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="glass-input" placeholder="0.00" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 block font-bold">Available Stock</label>
                    <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                      className="glass-input" placeholder="0" />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="text-[10px] tracking-[0.2em] uppercase text-text-muted mb-2 block font-bold">Technical Specifications</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={4}
                      className="glass-input resize-none" placeholder="Enter detailed specs..." />
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button disabled={saving} onClick={closeModal} className="flex-1 py-3.5 rounded-xl border border-glass-border text-[13px] font-medium uppercase tracking-[0.2em] text-text-muted hover:text-text-primary hover:border-text-muted transition-all disabled:opacity-50">Discard</button>
                  <button disabled={saving} onClick={handleSave} className="flex-1 py-3.5 rounded-xl bg-cyan-500 text-white text-[13px] font-medium uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-3 disabled:opacity-70">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    {modal === 'add' ? 'Confirm Addition' : 'Synchronize Record'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="w-full max-w-sm bg-aether-700 border border-glass-border rounded-2xl p-8 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <h3 className="text-lg font-serif text-text-primary uppercase tracking-widest font-bold">Confirm Deletion?</h3>
                <p className="text-xs text-text-muted mt-2 font-bold uppercase tracking-wider">This hardware record will be permanently eliminated.</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-3 rounded-xl border border-glass-border text-[10px] font-bold uppercase tracking-widest text-text-muted hover:text-text-primary hover:border-text-muted transition-all">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-3 rounded-xl bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-red-400 transition-all shadow-lg shadow-red-500/20">Eliminate</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Inventory;

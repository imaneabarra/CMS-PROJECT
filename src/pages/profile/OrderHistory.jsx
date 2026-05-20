import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, ArrowRight, ExternalLink } from 'lucide-react';
import { getProductImageUrl } from '../../utils/imageHelper';

const mockOrders = [
  {
    id: 'TRX-9482',
    date: 'Dec 12, 2024',
    status: 'Delivered',
    total: 1200,
    items: [
      { name: 'Dell Latitude 5430', qty: 1, image: getProductImageUrl('products/Dell Latitude 5430.webp') }
    ]
  },
  {
    id: 'TRX-8233',
    date: 'Nov 05, 2024',
    status: 'Processing',
    total: 120,
    items: [
      { name: 'Hikvision 4K Dome Camera', qty: 1, image: getProductImageUrl('products/Hikvision 4K Dome Camera.jpg') }
    ]
  }
];

const statusColors = {
  'Delivered': 'text-green-500 bg-green-500/10 border-green-500/20',
  'Processing': 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  'Shipped': 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20'
};

const OrderHistory = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 max-w-5xl mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-[10px] tracking-[0.3em] uppercase text-cyan-500 mb-2 font-bold">Secure Archive</p>
          <h1 className="font-serif text-3xl md:text-5xl text-text-primary tracking-wide uppercase font-bold">Acquisition History</h1>
        </motion.div>
        
        <Link to="/profile" className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-text-primary transition-colors pb-2">
          &larr; Return to Profile
        </Link>
      </div>

      <div className="space-y-8">
        {mockOrders.map((order, i) => (
          <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card overflow-hidden border-glass-border shadow-xl">
            <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between md:items-center gap-6 bg-aether-800 border-b border-glass-border">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-inner">
                  <Package className="w-6 h-6 text-cyan-500" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary tracking-widest uppercase">Order Ref: #{order.id}</h3>
                  <p className="text-[10px] text-text-muted mt-1 font-bold uppercase tracking-widest">Authenticated on {order.date}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-[9px] text-text-muted uppercase tracking-[0.3em] mb-1 font-bold">Total Acquisition</p>
                  <p className="text-lg font-serif font-bold text-cyan-500">${order.total.toLocaleString()}</p>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] border shadow-sm ${statusColors[order.status]}`}>
                  {order.status}
                </div>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="space-y-6">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-glass-border bg-aether-700 p-2">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-text-primary font-bold uppercase tracking-wider truncate">{item.name}</p>
                      <p className="text-[10px] text-text-muted mt-1 font-bold uppercase tracking-widest">Quantity: {item.qty}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 pt-8 border-t border-glass-border flex flex-col sm:flex-row justify-end gap-4">
                <button className="px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-text-primary border border-glass-border hover:border-text-muted transition-all flex items-center justify-center gap-2">
                  <ExternalLink className="w-4 h-4" /> Download Certificate
                </button>
                <button className="px-6 py-3 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] text-white bg-cyan-500 hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20">
                  Track Delivery <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;

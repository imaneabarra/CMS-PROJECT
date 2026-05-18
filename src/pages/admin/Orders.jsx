import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toast } from 'react-hot-toast';
import api from '../../services/api';

const statusConfig = {
  pending:    { label: 'Pending',    class: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' },
  processing: { label: 'Processing', class: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20' },
  shipped:    { label: 'Shipped',    class: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20' },
  delivered:  { label: 'Delivered',  class: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20' },
  cancelled:  { label: 'Cancelled',  class: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20' },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      const rawOrders = response.data.data || response.data;
      
      const formattedOrders = rawOrders.map(o => ({
        id: o.id,
        customer: o.user?.name || 'Unknown',
        product: o.order_items && o.order_items.length > 0 
          ? o.order_items[0].product?.name + (o.order_items.length > 1 ? ` (+${o.order_items.length - 1})` : '')
          : 'Technical Hardware Bundle',
        amount: `$${Number(o.total_price).toLocaleString()}`,
        status: (o.status || 'pending').toLowerCase(),
        date: new Date(o.created_at).toLocaleDateString(),
        raw: o
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to synchronize with order database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status: status.toUpperCase() });
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
      toast.success('Order status updated successfully');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status on server');
    }
  };

  const handleGenerateInvoice = (order) => {
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      const rawAmount = parseFloat(order.amount.replace(/[^0-9.]/g, ''));
      const subtotal = rawAmount * 0.9;
      const tax = rawAmount * 0.08;
      const shipping = rawAmount * 0.02;

      // Corporate Branding Header
      doc.setFillColor(15, 22, 42); 
      doc.rect(0, 0, 210, 40, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(24);
      doc.text('CMS GLOBAL', 20, 25);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(6, 182, 212);
      doc.text('OFFICIAL PROJECT INVOICE & HARDWARE AUDIT', 20, 32);

      // Invoice Meta
      doc.setTextColor(15, 22, 42);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('INVOICE DETAILS', 140, 55);
      doc.setFont('helvetica', 'normal');
      doc.text(`Reference: CMS-${order.id}`, 140, 62);
      doc.text(`Date: ${order.date}`, 140, 67);
      doc.text(`Status: ${order.status.toUpperCase()}`, 140, 72);

      // Customer Info
      doc.setFont('helvetica', 'bold');
      doc.text('CLIENT INFORMATION', 20, 55);
      doc.setFont('helvetica', 'normal');
      doc.text(order.customer, 20, 62);
      doc.text(`Email: ${order.customer.toLowerCase().replace(' ', '.')}@company.com`, 20, 67);
      doc.text('Technopark, Route de Nouaceur, Casablanca', 20, 72);

      // Order Table
      autoTable(doc, {
        startY: 85,
        head: [['Hardware / Solution Description', 'Qty', 'Unit Price', 'Total']],
        body: [
          [order.product, '1', order.amount, order.amount]
        ],
        theme: 'striped',
        headStyles: { fillColor: [15, 22, 42], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
        bodyStyles: { fontSize: 9, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 100 },
          1: { halign: 'center' },
          2: { halign: 'right' },
          3: { halign: 'right' }
        }
      });

      // Summary
      const finalY = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text('Hardware Subtotal', 140, finalY);
      doc.text(`$${subtotal.toLocaleString()}`, 190, finalY, { align: 'right' });
      
      doc.text('Logistics & Deployment', 140, finalY + 7);
      doc.text(`$${shipping.toLocaleString()}`, 190, finalY + 7, { align: 'right' });
      
      doc.text('Compliance & Tax', 140, finalY + 14);
      doc.text(`$${tax.toLocaleString()}`, 190, finalY + 14, { align: 'right' });

      doc.setDrawColor(226, 232, 240);
      doc.line(140, finalY + 18, 190, finalY + 18);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(6, 182, 212);
      doc.text('NET INVESTMENT', 140, finalY + 25);
      doc.text(`$${rawAmount.toLocaleString()}`, 190, finalY + 25, { align: 'right' });

      // Footer
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(10);
      doc.setTextColor(15, 22, 42);
      doc.text('Thank you for choosing CMS GLOBAL for your technical infrastructure.', 105, 270, { align: 'center' });
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text('CONFIDENTIAL TECHNICAL DOCUMENT — CMS GLOBAL — FOR AUTHORIZED PERSONNEL ONLY', 105, 285, { align: 'center' });

      doc.save(`CMS_INVOICE_${order.id}.pdf`);
      toast.success(`Digital invoice CMS-${order.id} generated`);
    } catch (error) {
      console.error('Invoice failed:', error);
      toast.error('Failed to generate invoice');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
        <div>
          <h1 className="text-[20px] md:text-[24px] font-serif text-text-primary uppercase tracking-tight font-semibold">Order Management</h1>
          <p className="text-[12px] text-text-muted mt-1.5 uppercase tracking-[0.1em] font-medium opacity-70">Track technical hardware acquisitions and project status.</p>
        </div>
      </div>

      {/* Filter tabs */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-muted">Synchronizing Orders...</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3">
            {['all', 'pending', 'shipped', 'delivered'].map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-bold tracking-[0.2em] uppercase transition-all border shadow-sm
                  ${filter === tab
                    ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20'
                    : 'bg-aether-700 text-text-muted border-glass-border hover:text-text-primary hover:border-text-muted'}`}
              >
                {tab === 'all' ? 'All Orders' : tab}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="bg-aether-700 border border-glass-border rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-glass-border bg-aether-800/30">
                    {['Order ID', 'Customer', 'Product', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                      <th key={h} className="text-left px-6 py-4 text-[10px] tracking-[0.2em] uppercase text-text-muted font-bold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-glass-border">
                  {filtered.map((order) => (
                    <motion.tr key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-aether-800/20 transition-colors group">
                      <td className="px-6 py-5">
                        <span className="text-xs font-mono text-cyan-500 font-bold">#CMS-{order.id}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-text-primary font-bold uppercase tracking-wide">{order.customer}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[11px] text-text-muted font-bold uppercase tracking-widest">{order.product}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-text-primary font-serif font-bold">{order.amount}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex px-3 py-1 rounded-full border text-[9px] font-bold uppercase tracking-[0.15em] shadow-sm ${statusConfig[order.status]?.class || statusConfig.pending.class}`}>
                          {statusConfig[order.status]?.label || order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60">{order.date}</span>
                      </td>
                      <td className="px-6 py-5 flex items-center gap-4">
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className="bg-aether-800 border border-glass-border rounded-lg px-3 py-1.5 text-[10px] text-text-secondary focus:outline-none focus:ring-1 focus:ring-cyan-500/30 font-bold uppercase tracking-widest cursor-pointer hover:border-text-muted transition-all"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <button
                          onClick={() => handleGenerateInvoice(order)}
                          className="px-3 py-1.5 rounded-lg border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 text-[9px] font-bold uppercase tracking-widest hover:bg-cyan-500 hover:text-white transition-all shadow-sm shadow-cyan-500/10"
                        >
                          Invoice
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {filtered.length === 0 && (
              <div className="py-20 text-center text-text-muted text-[10px] font-bold uppercase tracking-[0.3em] opacity-40">
                No acquisitions found in current filter
              </div>
            )}

            <div className="px-6 py-4 border-t border-glass-border text-[10px] font-bold tracking-widest uppercase text-text-muted">
              Operational synchronization: {filtered.length} active orders tracked
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;

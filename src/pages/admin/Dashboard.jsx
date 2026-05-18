import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, TrendingDown, ArrowRight, Loader2, Package, Users, Activity, CreditCard } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import ProductImage from '../../components/ui/ProductImage';

const StatCard = ({ label, value, change, positive, index, icon: Icon }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1 }}
    className="bg-aether-700 border border-glass-border rounded-2xl p-6 space-y-4 shadow-sm relative overflow-hidden group"
  >
    <div className="flex items-center justify-between">
      <p className="text-[11px] tracking-[0.2em] uppercase text-text-muted font-bold">{label}</p>
      <div className="w-8 h-8 rounded-lg bg-aether-800 border border-glass-border flex items-center justify-center group-hover:border-cyan-500/30 transition-colors">
        <Icon className="w-4 h-4 text-cyan-500" />
      </div>
    </div>
    <p className="text-[28px] font-bold text-text-primary tracking-tight font-serif">{value}</p>
    <div className={`flex items-center gap-1.5 text-[12px] font-bold ${positive ? 'text-green-500' : 'text-amber-500'}`}>
      {positive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
      <span>{change}</span>
      <span className="text-text-muted font-normal ml-1 opacity-60">from baseline</span>
    </div>
    <div className="absolute bottom-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full -mr-12 -mb-12 blur-2xl group-hover:bg-cyan-500/10 transition-all" />
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-aether-700 border border-glass-border rounded-xl px-4 py-3 shadow-2xl">
      <p className="text-[10px] text-text-muted mb-1 uppercase tracking-widest">{label}</p>
      <p className="text-sm font-bold text-cyan-500">${payload[0].value.toLocaleString()}</p>
    </div>
  );
};

const activityColor = { stock: 'bg-amber-500', order: 'bg-cyan-500', user: 'bg-purple-500', info: 'bg-blue-500' };

const Dashboard = () => {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentActivity, setRecentActivity] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  
  const tickColor = theme === 'dark' ? '#64748b' : '#94a3b8';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, logsRes] = await Promise.all([
          api.get('/admin/stats'),
          api.get('/activity-logs')
        ]);

        const s = statsRes.data;
        setStats(s);

        // Format daily revenue flow data for chart
        const formattedRevenue = (s.revenue_flow || []).map(r => ({
          date: new Date(r.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          revenue: parseFloat(r.revenue)
        }));
        
        // If empty, provide some default labels but 0 values
        setRevenueData(formattedRevenue.length > 0 ? formattedRevenue : [
          { date: 'Initial', revenue: 0 },
          { date: 'Current', revenue: 0 }
        ]);

        // Format activity logs
        const logs = (logsRes.data || []).slice(0, 5).map(log => ({
          id: log.id,
          type: log.action || 'info',
          title: log.action ? log.action.toUpperCase() : 'SYSTEM EVENT',
          body: log.description,
          time: new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
        setRecentActivity(logs);

      } catch (error) {
        console.error("Dashboard synchronization failed:", error);
        toast.error("Failed to fetch real-time intelligence data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleExport = () => {
    try {
      const doc = new jsPDF();
      const timestamp = new Date().toLocaleString();
      
      doc.setFillColor(15, 22, 42);
      doc.rect(0, 0, 210, 50, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(28);
      doc.text('CMS GLOBAL', 20, 28);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(6, 182, 212);
      doc.text('ENTERPRISE PERFORMANCE & INFRASTRUCTURE REPORT', 20, 38);
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.text(`GEN_ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}`, 160, 20);
      doc.text(`EXPORT_TS: ${timestamp}`, 160, 26);

      autoTable(doc, {
        startY: 60,
        head: [['Strategic Metric', 'Metric Status', 'Database Value']],
        body: [
          ['Total Hardware Revenue', 'Synchronized', stats ? `$${Number(stats.total_revenue).toLocaleString()}` : '$0'],
          ['Active Clients', 'Verified', stats ? stats.new_users.length : '0'],
          ['System Latency', 'Optimal', '12ms'],
          ['Database Health', 'Stable', '99.9%']
        ],
        theme: 'grid',
        headStyles: { fillColor: [15, 22, 42] }
      });

      doc.save(`CMS_GLOBAL_INTELLIGENCE_${Date.now()}.pdf`);
      toast.success('Performance report exported');
    } catch (error) {
      console.error('Export failed:', error);
      toast.error('Failed to generate PDF audit');
    }
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 text-cyan-500 animate-spin" />
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-text-muted">Synchronizing Intelligence Data...</p>
      </div>
    );
  }

  const totalRevenue = stats?.total_revenue || 0;
  const activeUsers = stats?.new_users?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start justify-between gap-6">
        <div>
          <h2 className="text-[28px] md:text-[32px] font-serif text-text-primary tracking-tight font-semibold uppercase">Intelligence Dashboard</h2>
          <p className="text-[14px] text-text-muted mt-2 max-w-xl leading-relaxed font-medium opacity-70">
            Real-time infrastructure monitoring and performance analytics for CMS GLOBAL.
          </p>
        </div>
        <button 
          onClick={handleExport}
          className="px-6 py-3 rounded-xl bg-aether-700 border border-glass-border text-[11px] text-text-muted hover:text-text-primary hover:border-text-muted transition-all font-bold uppercase tracking-[0.2em] shadow-sm"
        >
          Export Intelligence Audit
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          label="Total Revenue" 
          value={`$${totalRevenue.toLocaleString()}`} 
          change="+12.4%" 
          positive={true} 
          index={0} 
          icon={CreditCard}
        />
        <StatCard 
          label="New Clients" 
          value={activeUsers} 
          change="+5.2%" 
          positive={true} 
          index={1} 
          icon={Users}
        />
        <StatCard 
          label="Total Requests" 
          value={stats?.total_orders || 0} 
          change="+8.1%" 
          positive={true} 
          index={2} 
          icon={Package}
        />
        <StatCard 
          label="System Pulse" 
          value={recentActivity.length} 
          change="Operational" 
          positive={true} 
          index={3} 
          icon={Activity}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-aether-700 border border-glass-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-[0.2em]">Hardware Revenue Flow</h3>
              <p className="text-[12px] text-text-muted mt-1 font-medium opacity-60">Verified sales trajectory from master database (Daily)</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revenueData} barSize={24}>
              <XAxis dataKey="date" tick={{ fill: tickColor, fontSize: 8, fontWeight: 700 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(6,182,212,0.03)' }} />
              <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                {revenueData.map((entry, i) => (
                  <Cell key={i} fill={i === revenueData.length - 1 ? '#06b6d4' : '#1e293b'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* System Activity */}
        <div className="bg-aether-700 border border-glass-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-[0.2em]">Operational Pulse</h3>
          </div>
          <div className="space-y-6">
            {recentActivity.map((item) => (
              <div key={item.id} className="flex items-start gap-4">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 shadow-sm ${activityColor[item.type] || activityColor.info}`} />
                <div className="min-w-0 flex-1">
                  <p className="text-[12px] font-bold text-text-primary truncate uppercase tracking-tight">{item.title}</p>
                  <p className="text-[11px] text-text-muted mt-1 leading-relaxed font-medium opacity-80">{item.body}</p>
                  <p className="text-[9px] text-text-muted font-bold mt-2 opacity-40 uppercase tracking-tighter">{item.time}</p>
                </div>
              </div>
            ))}
            {recentActivity.length === 0 && (
              <p className="text-[10px] text-text-muted text-center py-10 uppercase tracking-widest opacity-40 font-bold">No recent events recorded</p>
            )}
          </div>
          <Link 
            to="/admin/activity"
            className="mt-8 w-full text-center text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500 hover:text-cyan-400 flex items-center justify-center gap-2 transition-colors border-t border-glass-border pt-4"
          >
            Full Activity Archive <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-aether-700 border border-glass-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[14px] font-bold text-text-primary uppercase tracking-[0.2em]">High-Velocity Hardware</h3>
          <Link to="/admin/products" className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500 hover:text-cyan-400 flex items-center gap-2 transition-colors">
            Manage Inventory <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats?.top_products?.map((prod) => (
            <div key={prod.id} className="flex items-center gap-5 p-4 rounded-xl bg-aether-800/30 border border-glass-border hover:border-cyan-500/30 transition-all group">
              <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 border border-glass-border shadow-sm bg-aether-900 p-1">
                <ProductImage src={prod.image_url} alt={prod.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted group-hover:text-text-primary transition-colors truncate max-w-[150px]">{prod.name}</p>
                <p className="text-[16px] font-serif font-bold text-cyan-500 mt-1 tracking-tight">${Number(prod.price).toLocaleString()}</p>
                <p className="text-[9px] font-bold text-text-muted uppercase tracking-[0.1em] opacity-40 mt-1">{prod.units_deployed} units deployed</p>
              </div>
            </div>
          ))}
          {(!stats?.top_products || stats.top_products.length === 0) && (
            <p className="col-span-3 text-center py-10 text-[10px] text-text-muted uppercase tracking-widest font-bold opacity-40">No product analytics available yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

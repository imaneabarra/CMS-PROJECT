import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Users, TrendingUp, AlertCircle, 
  ArrowLeft, Calendar, Filter, X, Info, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const activityIcons = {
  order:  <Package className="w-4 h-4 text-cyan-400" />,
  user:   <Users className="w-4 h-4 text-purple-400" />,
  payout: <TrendingUp className="w-4 h-4 text-green-400" />,
  stock:  <AlertCircle className="w-4 h-4 text-amber-400" />,
};

const activityColors = {
  order:  'bg-cyan-500/10 border-cyan-500/20',
  user:   'bg-purple-500/10 border-purple-500/20',
  payout: 'bg-green-500/10 border-green-500/20',
  stock:  'bg-amber-500/10 border-amber-500/20',
};

const DetailsModal = ({ item, onClose }) => {
  if (!item) return null;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-aether-900/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-aether-700 border border-glass-border rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative p-8">
          <button onClick={onClose} className="absolute top-6 right-6 text-text-muted hover:text-text-primary transition-colors">
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4 mb-8">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${activityColors[item.type]}`}>
              {activityIcons[item.type]}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-500 mb-1">{item.type} EVENT</p>
              <h2 className="text-xl font-medium text-text-primary uppercase tracking-tight">{item.title}</h2>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted mb-2">Description</h4>
              <p className="text-sm text-text-secondary leading-relaxed font-light">{item.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-glass-border/50">
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted mb-1">Timestamp</h4>
                <p className="text-sm text-text-primary font-light">{new Date(item.timestamp).toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted mb-1">Relative Time</h4>
                <p className="text-sm text-text-primary font-light">{item.time}</p>
              </div>
            </div>
            
            <div className="pt-6 border-t border-glass-border/50">
              <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted mb-3">Contextual Intelligence</h4>
              <div className="bg-aether-800/50 rounded-2xl p-5 border border-glass-border/30 space-y-3">
                {Object.entries(item.relatedData).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-[12px]">
                    <span className="text-text-muted uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-text-primary font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-4">
            <button className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-cyan-500 text-white text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-cyan-400 transition-all shadow-xl shadow-cyan-500/20 active:scale-[0.98]">
              View Full Transaction <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Activity = () => {
  const [filterType, setFilterType] = useState('all');
  const [filterDate, setFilterDate] = useState('');
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/activity-logs');
        const rawLogs = response.data.data || response.data;
        const formatted = rawLogs.map(log => ({
          id: log.id,
          type: log.action || 'info',
          title: log.action ? log.action.toUpperCase() + ' EVENT' : 'System Event',
          body: log.description,
          description: log.description,
          timestamp: log.created_at,
          time: new Date(log.created_at).toLocaleString(),
          relatedData: {
            user: log.user ? log.user.name : 'System',
            email: log.user ? log.user.email : 'N/A'
          }
        }));
        setActivities(formatted);
      } catch (error) {
        console.error('Failed to load activity logs', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter(item => {
      const matchesType = filterType === 'all' || item.type === filterType;
      const itemDate = item.timestamp ? item.timestamp.split('T')[0] : '';
      const matchesDate = !filterDate || itemDate === filterDate;
      return matchesType && matchesDate;
    });
  }, [filterType, filterDate, activities]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link 
            to="/admin/dashboard" 
            className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-cyan-500 transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Intelligence
          </Link>
          <h1 className="text-[28px] md:text-[32px] font-light tracking-tight text-text-primary">System Activity Log</h1>
          <p className="text-[14px] text-text-muted mt-2 font-light max-w-2xl leading-relaxed">
            A comprehensive timeline of all events across the CMS GLOBAL ecosystem. Monitor transactions, user interactions, and operational alerts.
          </p>
        </div>
        
        <div className="flex items-center gap-3 relative">
          <div className="flex bg-aether-700 border border-glass-border rounded-xl p-1 shadow-inner">
            <input 
              type="date" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent text-[11px] uppercase tracking-widest text-text-primary px-3 focus:outline-none py-1.5"
            />
            <div className="w-px bg-glass-border mx-1" />
            <select 
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-transparent text-[11px] uppercase tracking-widest text-text-primary px-3 focus:outline-none py-1.5 cursor-pointer"
            >
              <option value="all" className="bg-aether-700">All Events</option>
              <option value="order" className="bg-aether-700">Orders</option>
              <option value="user" className="bg-aether-700">Users</option>
              <option value="stock" className="bg-aether-700">Stock</option>
              <option value="payout" className="bg-aether-700">Payouts</option>
            </select>
          </div>
          
          <button 
            onClick={() => { setFilterType('all'); setFilterDate(''); }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-glass-border text-[11px] font-bold uppercase tracking-[0.15em] text-text-muted hover:text-text-primary hover:bg-aether-700 transition-all"
          >
            <X className="w-3.5 h-3.5" /> Reset
          </button>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/30 via-glass-border to-transparent" />

        <div className="space-y-8 min-h-[400px]">
          {loading ? (
            <div className="py-32 text-center text-text-muted">Loading intelligence logs...</div>
          ) : filteredActivities.length > 0 ? (
            filteredActivities.map((item, index) => (
              <motion.div
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative pl-16"
              >
                <div className={`absolute left-[20px] top-4 w-2.5 h-2.5 rounded-full border-2 border-aether-800 z-10 ${
                  item.type === 'order' ? 'bg-cyan-500' : 
                  item.type === 'user' ? 'bg-purple-500' : 
                  item.type === 'payout' ? 'bg-green-500' : 'bg-amber-500'
                } shadow-[0_0_10px_rgba(6,182,212,0.4)]`} />

                <div className="bg-aether-700 border border-glass-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${activityColors[item.type]}`}>
                        {activityIcons[item.type]}
                      </div>
                      <div>
                        <h3 className="text-[15px] font-medium text-text-primary uppercase tracking-wide group-hover:text-cyan-500 transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-[13px] text-text-muted mt-1 font-light leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-right">
                      <div className="hidden md:block">
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-text-muted opacity-60">Timestamp</p>
                        <div className="flex items-center gap-2 text-[12px] text-text-muted mt-1 font-light">
                          <Calendar className="w-3 h-3" /> {item.time}
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedActivity(item)}
                        className="px-5 py-2.5 rounded-xl bg-aether-600 border border-glass-border text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-text-primary hover:bg-aether-800 transition-all flex items-center gap-2"
                      >
                        <Info className="w-3.5 h-3.5" /> Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-32 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-aether-700 border border-glass-border mb-6">
                <Filter className="w-6 h-6 text-text-muted" />
              </div>
              <h3 className="text-lg font-light text-text-primary uppercase tracking-widest">No Intelligence Found</h3>
              <p className="text-text-muted mt-2 text-sm font-light">Adjust your filters to explore historical archives.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {selectedActivity && (
          <DetailsModal 
            item={selectedActivity} 
            onClose={() => setSelectedActivity(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Activity;

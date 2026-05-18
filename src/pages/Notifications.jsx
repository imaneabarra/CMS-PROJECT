import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, CheckCircle2, AlertCircle, Package, 
  Users, TrendingUp, Filter, Trash2, MailOpen 
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const notifIcons = {
  order:  <Package className="w-5 h-5 text-cyan-400" />,
  user:   <Users className="w-5 h-5 text-purple-400" />,
  payout: <TrendingUp className="w-5 h-5 text-green-400" />,
  stock:  <AlertCircle className="w-5 h-5 text-amber-400" />,
  system: <Bell className="w-5 h-5 text-blue-400" />,
};

const Notifications = () => {
  const { 
    notifications, 
    markAllRead, 
    markAsRead, 
    removeNotification, 
    clearAllNotifications 
  } = useNotifications();

  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[10px] tracking-[0.3em] uppercase font-bold mb-4"
          >
            <Bell className="w-3.5 h-3.5" />
            Communication Hub
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-serif text-text-primary uppercase tracking-widest font-bold"
          >
            Notifications
          </motion.h1>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <button 
            onClick={markAllRead}
            className="px-6 py-3 rounded-xl border border-glass-border text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted hover:text-text-primary hover:border-text-muted transition-all flex items-center gap-3"
          >
            <MailOpen className="w-4 h-4" /> Mark all read
          </button>
          <button 
            onClick={clearAllNotifications}
            className="px-6 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/20 transition-all flex items-center gap-3"
          >
            <Trash2 className="w-4 h-4" /> Clear All
          </button>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
        {['all', 'unread', 'order', 'user', 'stock', 'payout'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap transition-all border
              ${filter === f 
                ? 'bg-cyan-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/20' 
                : 'bg-aether-700 text-text-muted border-glass-border hover:border-text-muted hover:text-text-primary'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((n, i) => (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.05 }}
                className={`group relative glass-card p-6 md:p-8 border-glass-border hover:border-cyan-500/30 transition-all shadow-xl
                  ${!n.read ? 'bg-cyan-500/5 ring-1 ring-cyan-500/20' : 'bg-aether-700'}`}
              >
                <div className="flex gap-6 items-start">
                  <div className="w-14 h-14 rounded-2xl bg-aether-800 border border-glass-border flex items-center justify-center shadow-inner group-hover:border-cyan-500/30 transition-colors">
                    {notifIcons[n.type] || <CheckCircle2 className="w-6 h-6 text-text-muted" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <h3 className={`text-lg md:text-xl font-serif tracking-wide transition-colors
                        ${!n.read ? 'text-text-primary' : 'text-text-secondary group-hover:text-text-primary'}`}>
                        {n.title}
                      </h3>
                      <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-60">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed font-medium uppercase tracking-tight opacity-80">
                      {n.body}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {!n.read && (
                      <button 
                        onClick={() => markAsRead(n.id)}
                        className="p-2 text-cyan-500 hover:bg-cyan-500/10 rounded-lg transition-all"
                        title="Mark as read"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    )}
                    <button 
                      onClick={() => removeNotification(n.id)}
                      className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {!n.read && (
                  <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500 rounded-l-2xl shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
                )}
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 text-center"
            >
              <div className="w-20 h-20 bg-aether-700 border border-glass-border rounded-3xl flex items-center justify-center mx-auto mb-8 opacity-20">
                <Bell className="w-10 h-10 text-text-muted" />
              </div>
              <h2 className="text-xl font-serif text-text-primary uppercase tracking-widest mb-4">No notifications yet</h2>
              <p className="text-text-muted text-[11px] font-bold uppercase tracking-[0.3em] opacity-50">
                When you have updates regarding your orders or account, they will appear here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Notifications;

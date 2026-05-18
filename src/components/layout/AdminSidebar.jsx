import React, { useState, useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Settings,
  ChevronLeft, ChevronRight, LogOut, Plus, BarChart3, Users2, Shield, Activity
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const navItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/products', icon: Package, label: 'Inventory' },
  { to: '/admin/orders', icon: ShoppingCart, label: 'Orders' },
  { to: '/admin/users', icon: Users, label: 'Customers' },
  { to: '/admin/activity', icon: Activity, label: 'Analytics' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => { 
    logout(); 
    navigate('/login'); 
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 280 }}
      transition={{ duration: 0.4, ease: 'circOut' }}
      className="relative flex flex-col h-screen bg-aether-700 border-r border-glass-border z-40 flex-shrink-0 transition-colors duration-500"
    >
      {/* Brand Identity */}
      <div className={`flex items-center gap-3 px-6 py-8 border-b border-glass-border ${collapsed ? 'justify-center px-0' : ''}`}>
        <div className="bg-cyan-500/10 border border-cyan-500/20 p-2 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/5">
          <Shield className="w-5 h-5 text-cyan-500" />
        </div>
        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="flex flex-col justify-center"
          >
            <span className="text-[14px] font-bold text-text-primary tracking-[0.1em] uppercase leading-none">CMS GLOBAL</span>
            <span className="text-[8px] text-cyan-500 tracking-[0.2em] uppercase font-bold mt-1 opacity-80">Infrastructure Admin</span>
          </motion.div>
        )}
      </div>

      {/* Navigation Cluster */}
      <nav className="flex-1 py-8 space-y-2 px-4 overflow-y-auto custom-scrollbar">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
              ${isActive
                ? 'bg-cyan-500/10 text-cyan-500 border border-cyan-500/10 shadow-sm'
                : 'text-text-muted hover:text-text-primary hover:bg-aether-800'
              } ${collapsed ? 'justify-center px-0' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-cyan-500' : 'opacity-70'}`} />
                {!collapsed && (
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{label}</span>
                )}
                {isActive && !collapsed && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                  />
                )}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-aether-900 border border-glass-border rounded-lg text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-[100] shadow-2xl">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Quick Action - Manage Inventory */}
      {!collapsed && (
        <div className="px-4 pb-6">
          <button
            onClick={() => navigate('/admin/products')}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-aether-800 border border-glass-border text-cyan-500 text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-cyan-500 hover:text-white transition-all shadow-xl active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Manage Inventory
          </button>
        </div>
      )}

      {/* Security Context / User Profile */}
      <div className={`border-t border-glass-border p-4 bg-aether-800/30 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed ? (
          <div className="flex items-center gap-4 p-2 rounded-2xl bg-aether-700/50 border border-glass-border">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-500 flex-shrink-0 shadow-inner">
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-text-primary font-bold uppercase tracking-widest truncate">{user?.name || 'Administrator'}</p>
              <p className="text-[9px] text-text-muted font-bold truncate uppercase tracking-tighter opacity-60">Verified Admin</p>
            </div>
            <button onClick={handleLogout} className="text-text-muted hover:text-red-500 transition-all p-2 hover:bg-red-500/5 rounded-xl">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button onClick={handleLogout} className="text-text-muted hover:text-red-500 transition-all p-3 hover:bg-red-500/5 rounded-xl">
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Interaction Trigger */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-4 top-24 w-8 h-8 rounded-xl bg-aether-700 border border-glass-border flex items-center justify-center text-text-muted hover:text-cyan-500 hover:border-cyan-500/40 transition-all z-50 shadow-2xl"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </motion.aside>
  );
};

export default AdminSidebar;

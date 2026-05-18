import React, { useState, useRef, useEffect, useContext } from 'react';
import { Search, Bell, Sun, Moon, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useNotifications } from '../../context/NotificationContext';
import { AuthContext } from '../../context/AuthContext';
import { ShoppingBag, User as UserIcon, Receipt, Package } from 'lucide-react';
import { Link } from 'react-router-dom';

const typeColor = { order: 'text-cyan-500', user: 'text-green-500', stock: 'text-amber-500', payout: 'text-blue-500' };

const AdminTopbar = ({ pageTitle }) => {
  const { theme, toggleTheme } = useTheme();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const [apiProducts, setApiProducts] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(r => r.json())
      .then(d => setApiProducts(d.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setSearchOpen(false);
      return;
    }

    const filteredProducts = apiProducts
      .filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      .map(p => ({ ...p, type: 'product', icon: <ShoppingBag className="w-3.5 h-3.5" />, link: `/admin/products` }));

    setSearchResults([...filteredProducts].slice(0, 8));
    setSearchOpen(true);
  };

  return (
    <header className="h-20 flex items-center justify-between px-8 border-b border-glass-border bg-aether-700 transition-colors duration-500 flex-shrink-0">
      {/* Page Context */}
      <div>
        <h1 className="text-sm font-bold text-text-primary tracking-[0.3em] uppercase">{pageTitle || 'System Overview'}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Universal Search */}
        <div className="relative hidden lg:block w-72" ref={searchRef}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => searchQuery.trim() && setSearchOpen(true)}
            className="bg-aether-800 border border-glass-border rounded-xl pl-11 pr-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-cyan-500/30 w-full shadow-inner"
          />

          <AnimatePresence>
            {searchOpen && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute left-0 right-0 top-full mt-3 bg-aether-700 border border-glass-border rounded-2xl shadow-2xl overflow-hidden z-[60]"
              >
                <div className="py-2 divide-y divide-glass-border">
                  {searchResults.map((res, i) => (
                    <Link
                      key={i}
                      to={res.link}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-4 px-5 py-3 hover:bg-aether-600 transition-colors group"
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-aether-800 border border-glass-border text-text-muted group-hover:text-cyan-500 transition-colors`}>
                        {res.icon}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[10px] font-bold text-text-primary uppercase tracking-widest truncate">{res.name}</p>
                        <p className="text-[8px] text-text-muted font-bold uppercase tracking-tighter truncate opacity-60">
                          {res.type} {res.subtext ? `• ${res.subtext}` : ''}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                {searchResults.length === 0 && (
                  <div className="px-5 py-8 text-center text-[9px] text-text-muted uppercase tracking-widest font-bold opacity-60">
                    No records found
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Action Tray */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-3 rounded-xl text-text-muted hover:text-cyan-500 hover:bg-aether-800 border border-transparent hover:border-glass-border transition-all"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setNotifOpen(!notifOpen); if (!notifOpen) markAllRead(); }}
              className="relative p-3 rounded-xl text-text-muted hover:text-cyan-500 hover:bg-aether-800 border border-transparent hover:border-glass-border transition-all"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              )}
            </button>

            <AnimatePresence>
              {notifOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.98 }}
                  className="absolute right-0 top-full mt-4 w-96 bg-aether-700 border border-glass-border rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-5 py-4 border-b border-glass-border flex items-center justify-between bg-aether-800/50">
                    <span className="text-[10px] font-bold text-text-primary tracking-[0.2em] uppercase">System Feed</span>
                    <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-widest cursor-pointer hover:text-cyan-400" onClick={markAllRead}>Acknowledge All</span>
                  </div>
                  <div className="divide-y divide-glass-border max-h-96 overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                      <div className="px-5 py-12 text-center text-text-muted text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">System state stable</div>
                    ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`px-5 py-4 hover:bg-aether-600 transition-colors ${!n.read ? 'bg-cyan-500/5' : ''}`}>
                          <div className="flex justify-between items-start mb-1">
                            <p className={`text-[11px] font-bold uppercase tracking-wider ${typeColor[n.type] || 'text-text-secondary'}`}>{n.title}</p>
                            <p className="text-[8px] text-text-muted font-bold opacity-50 uppercase">{n.time}</p>
                          </div>
                          <p className="text-[10px] text-text-muted leading-relaxed font-medium uppercase tracking-tight">{n.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile */}
          <div className="relative ml-2" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 p-2 rounded-xl hover:bg-aether-800 border border-transparent hover:border-glass-border transition-all"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-700 flex items-center justify-center text-[11px] font-bold text-white shadow-xl">
                {user?.name?.charAt(0)?.toUpperCase() || 'A'}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[10px] font-bold text-text-primary uppercase tracking-widest">Admin</p>
                <ChevronDown className="w-3 h-3 text-text-muted mt-0.5" />
              </div>
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.98 }}
                  className="absolute right-0 top-full mt-4 w-56 bg-aether-700 border border-glass-border rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-glass-border bg-aether-800/30">
                    <p className="text-[10px] font-bold text-text-primary uppercase tracking-widest truncate">{user?.name || 'CMS GLOBAL Admin'}</p>
                    <p className="text-[8px] text-text-muted font-bold uppercase tracking-tighter truncate opacity-60">{user?.email || 'admin@cmsglobal.com'}</p>
                  </div>
                  <button onClick={() => { logout(); navigate('/login'); }} className="w-full text-left px-5 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-red-500 hover:bg-red-500/5 transition-all">
                    Secure Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;

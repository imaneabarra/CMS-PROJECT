import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Bell, User, Menu, X, ShoppingCart, LogOut,
  Sun, Moon, Package, Users, TrendingUp, AlertCircle, CheckCircle2, Heart
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { useFavorites } from '../../context/FavoriteContext';
import { useNotifications } from '../../context/NotificationContext';
import { useTheme } from '../../context/ThemeContext';
import { useSearch } from '../../context/SearchContext';
import { toast } from 'react-hot-toast';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Shop', path: '/shop' },
  { name: 'Categories', path: '/categories' },
  { name: 'Collections', path: '/collections' },
  { name: 'Support', path: '/support' },
];

const notifIcons = {
  order:   <Package className="w-3.5 h-3.5 text-cyan-400" />,
  user:    <Users className="w-3.5 h-3.5 text-purple-400" />,
  payout:  <TrendingUp className="w-3.5 h-3.5 text-green-400" />,
  stock:   <AlertCircle className="w-3.5 h-3.5 text-amber-400" />,
  product: <Package className="w-3.5 h-3.5 text-blue-400" />,
};

const Navbar = () => {
  const [scrolled, setScrolled]         = useState(false);
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [notifOpen, setNotifOpen]       = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const location  = useLocation();
  const navigate  = useNavigate();
  const notifRef  = useRef(null);

  const { cartCount, clearCart }                   = useCart();
  const { user, logout }                           = useAuth();
  const { favorites }                              = useFavorites();
  const { notifications, unreadCount, markAllRead, markAsRead, clearAllNotifications, removeNotification } = useNotifications();
  const { theme, toggleTheme }                     = useTheme();
  const { searchQuery, setSearchQuery }            = useSearch();
  const [apiProducts, setApiProducts]              = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/products`)
      .then(res => res.json())
      .then(data => setApiProducts(data.data || []))
      .catch(err => console.error('Failed to load products for search', err));
  }, []);

  const handleLogout = () => {
    logout();
    clearCart();
    toast.success('You have been signed out successfully', {
      style: { background: '#0f1629', color: '#e2e8f0', border: '1px solid rgba(6,182,212,0.3)' },
      icon: '👋',
    });
  };

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const handleSearchKey = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/shop`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-aether-700/80 backdrop-blur-2xl border-b border-glass-border shadow-2xl shadow-aether-900/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link to="/" className="flex flex-shrink-0 items-center gap-3 group">
            <div className="bg-white/5 border border-white/10 p-1.5 rounded-lg flex items-center justify-center shadow-inner">
              <img 
                src="/cms-global-logo.png" 
                alt="CMS GLOBAL Icon" 
                className="h-6 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.2)] transition-transform group-hover:scale-105" 
              />
            </div>
            <span className="font-serif italic text-xl md:text-2xl text-cyan-500 tracking-[0.1em] font-semibold transition-all group-hover:tracking-[0.15em]">
              CMS GLOBAL
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-12 ml-16">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-[11px] font-medium uppercase tracking-[0.25em] transition-all relative py-2 ${
                  location.pathname === link.path ? 'text-cyan-500' : 'text-text-muted hover:text-text-primary'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute -bottom-1 left-0 right-0 h-[1px] bg-cyan-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden md:flex items-center gap-10 ml-auto pl-12 border-l border-glass-border/30">
            {/* Search bar */}
            <div className={`relative transition-all duration-700 ${searchFocused || searchQuery ? 'w-96' : 'w-64'}`}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted/60" />
              <input
                type="text"
                placeholder="Search Collection..."
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKey}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                className="bg-aether-800/50 border border-glass-border rounded-full pl-11 pr-5 py-2.5 text-[12px] font-light uppercase tracking-[0.15em] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/20 w-full transition-all shadow-inner"
              />

              {/* Search Results Dropdown */}
              <AnimatePresence>
                {searchQuery.trim().length > 0 && searchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    className="absolute top-full mt-4 w-[28rem] right-0 bg-aether-700 border border-glass-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden z-[60]"
                  >
                    <div className="max-h-[30rem] overflow-y-auto divide-y divide-glass-border custom-scrollbar">
                      {apiProducts
                        .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
                        .slice(0, 6)
                        .map(p => {
                          const catName = typeof p.category === 'object' ? p.category?.name : p.category;
                          return (
                          <Link
                            key={p.id}
                            to={`/product/${p.id}`}
                            onClick={() => { setSearchQuery(''); setSearchFocused(false); }}
                            className="flex items-center gap-5 p-5 hover:bg-aether-600 transition-all group"
                          >
                            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-aether-800 border border-glass-border shadow-sm p-2">
                              <img src={p.image_url || p.image} alt={p.name} className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13px] font-semibold text-text-primary truncate uppercase tracking-tight">{p.name}</p>
                              <p className="text-[11px] text-text-muted uppercase tracking-[0.1em] font-medium mt-1">{catName}</p>
                            </div>
                            <span className="text-[14px] font-serif font-semibold text-cyan-500 tracking-tight">${Number(p.price).toLocaleString()}</span>
                          </Link>
                        )})}
                      {apiProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
                        <div className="p-12 text-center">
                          <p className="text-[10px] uppercase tracking-[0.3em] text-text-muted font-bold opacity-60">No artifacts found in the realm</p>
                        </div>
                      )}
                      <Link
                        to="/shop"
                        onClick={() => setSearchFocused(false)}
                        className="block p-4 text-center text-[9px] font-bold uppercase tracking-[0.4em] text-cyan-500 bg-cyan-500/5 hover:bg-cyan-500/10 transition-all border-t border-glass-border"
                      >
                        Explore Complete Archive
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="text-text-muted hover:text-cyan-500 transition-all p-2.5 rounded-xl hover:bg-aether-600 border border-transparent hover:border-glass-border shadow-sm"
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Wishlist */}
            <Link to="/favorites" className="relative text-text-muted hover:text-cyan-500 transition-all p-2.5 rounded-xl hover:bg-aether-600 border border-transparent hover:border-glass-border shadow-sm">
              <Heart className="w-4 h-4" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-[8px] font-bold text-white rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative text-text-muted hover:text-cyan-500 transition-all p-2.5 rounded-xl hover:bg-aether-600 border border-transparent hover:border-glass-border shadow-sm">
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 text-[8px] font-bold text-white rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { 
                  if (!user) {
                    toast.error('Please login to access your notifications', {
                      id: 'auth-notif-toast',
                      style: { background: '#0f172a', color: '#f8fafc', border: '1px solid rgba(6,182,212,0.2)' }
                    });
                  }
                  setNotifOpen(o => !o); 
                  if (!notifOpen && user) markAllRead(); 
                }}
                className="relative text-text-muted hover:text-cyan-500 transition-all p-2.5 rounded-xl hover:bg-aether-600 border border-transparent hover:border-glass-border shadow-sm"
              >
                <Bell className="w-4 h-4" />
                {user && unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-aether-700 shadow-lg" />
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 15, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-4 w-80 bg-aether-700 border border-glass-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden z-50"
                  >
                    <div className="flex items-center justify-between px-5 py-4 border-b border-glass-border bg-aether-800/50">
                      <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase text-text-primary">Journal</h3>
                      {user && (
                        <button onClick={clearAllNotifications} className="text-[11px] text-cyan-500 hover:text-cyan-400 tracking-[0.1em] uppercase font-bold">
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-glass-border custom-scrollbar">
                      {!user ? (
                        <div className="p-10 text-center flex flex-col items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-cyan-500/5 border border-cyan-500/10 flex items-center justify-center mb-2">
                            <Bell className="w-5 h-5 text-cyan-500/40" />
                          </div>
                          <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold leading-relaxed max-w-[180px] mx-auto">
                            Your notifications will appear here after login
                          </p>
                          <Link 
                            to="/login" 
                            onClick={() => setNotifOpen(false)}
                            className="mt-2 px-6 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-[9px] uppercase tracking-[0.3em] font-bold hover:bg-cyan-500 hover:text-white transition-all duration-300"
                          >
                            Authorize Access
                          </Link>
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="px-5 py-10 text-center text-text-muted text-[10px] font-bold uppercase tracking-[0.3em] opacity-60">No new alerts</div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`px-5 py-4 flex gap-4 items-start transition-all hover:bg-aether-600 relative group/item ${!n.read ? 'bg-cyan-500/5' : ''}`}
                          >
                            <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl bg-aether-800 border border-glass-border flex items-center justify-center shadow-inner">
                              {notifIcons[n.type] || <CheckCircle2 className="w-4 h-4 text-text-muted" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-[13px] font-semibold truncate uppercase tracking-tight ${!n.read ? 'text-text-primary' : 'text-text-secondary'}`}>{n.title}</p>
                              <p className="text-[12px] text-text-muted mt-1 leading-relaxed font-medium uppercase tracking-tight">{n.body}</p>
                              <p className="text-[11px] text-text-muted font-bold mt-2 opacity-50 uppercase tracking-tighter">{n.time}</p>
                            </div>
                            <div className="flex flex-col gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                              {!n.read && (
                                <button onClick={() => markAsRead(n.id)} className="text-cyan-500 hover:text-cyan-400" title="Mark as Read">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button onClick={() => removeNotification(n.id)} className="text-text-muted hover:text-red-500" title="Remove">
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            {!n.read && (
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 flex-shrink-0 mt-2 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                            )}
                          </div>
                        ))
                      )}
                    </div>
                    {user && (
                      <Link to="/notifications" onClick={() => setNotifOpen(false)} className="block py-4 text-center text-[9px] font-bold uppercase tracking-[0.3em] text-cyan-500 hover:text-cyan-400 bg-aether-800/30 border-t border-glass-border transition-all">
                        See All Notifications
                      </Link>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* User / Auth */}
            {user ? (
              <div className="flex items-center gap-4 ml-2 border-l border-glass-border pl-6">
                <Link
                  to={user?.role === 'ADMIN' ? '/admin/dashboard' : '/profile'}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 text-cyan-500 flex items-center justify-center border border-cyan-500/30 text-sm font-bold shadow-xl transition-all group-hover:border-cyan-500 group-hover:shadow-cyan-500/20">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </Link>
                <button onClick={handleLogout} className="text-text-muted hover:text-red-500 transition-all" title="Secure Exit">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-text-muted hover:text-cyan-500 transition-all p-2.5 bg-aether-700 rounded-xl ml-2 hover:bg-aether-600 border border-glass-border shadow-sm"
              >
                <User className="w-4 h-4" />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-text-secondary hover:text-text-primary p-2.5 bg-aether-700 rounded-xl border border-glass-border"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="md:hidden bg-aether-700/98 backdrop-blur-3xl border-t border-glass-border shadow-2xl"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block text-xs font-bold tracking-[0.2em] uppercase py-2 ${
                    location.pathname === link.path
                      ? 'text-cyan-500'
                      : 'text-text-muted hover:text-text-primary'
                  } transition-colors`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile Search */}
              <div className="relative pt-2">
                <Search className="absolute left-3 top-1/2 mt-1 -translate-y-1/2 w-3.5 h-3.5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search collection..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={(e) => { if (e.key === 'Enter') { navigate('/shop'); setMobileOpen(false); } }}
                  className="glass-input pl-10 text-sm"
                />
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-glass-border mt-4">
                <div className="flex gap-3 items-center">
                  <Link to="/favorites" className="relative text-text-muted hover:text-text-primary transition-colors p-2">
                    <Heart className="w-5 h-5" />
                    {favorites.length > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-cyan-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                        {favorites.length}
                      </span>
                    )}
                  </Link>
                  <Link to="/cart" className="relative text-text-muted hover:text-text-primary transition-colors p-2">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 bg-cyan-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                  <button onClick={toggleTheme} className="text-text-muted hover:text-text-primary transition-colors p-2">
                    {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>

                {user ? (
                  <div className="flex items-center gap-3">
                    <Link to="/profile" className="text-sm font-bold text-text-secondary uppercase tracking-widest">{user.name}</Link>
                    <button onClick={handleLogout} className="text-text-muted hover:text-red-500">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link to="/login" className="text-text-muted hover:text-text-primary transition-colors p-2">
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

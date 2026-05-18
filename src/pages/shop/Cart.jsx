import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Lock, ShoppingCart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/ui/Button';
import ProductImage from '../../components/ui/ProductImage';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  // Redirect or show lock if not authenticated
  // Removed full page guard to allow guest cart viewing

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center px-4 bg-aether-800 transition-colors duration-500">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-aether-700 rounded-full flex items-center justify-center mb-10 mx-auto border border-glass-border shadow-xl">
            <ShoppingCart className="w-10 h-10 text-text-muted" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-text-primary mb-6 uppercase tracking-widest font-bold">Your Selection is Empty</h2>
          <p className="text-text-secondary mb-12 max-w-md mx-auto leading-relaxed font-bold uppercase tracking-widest text-[11px] opacity-80">
            Discover our premium collection and begin curating your timeless pieces.
          </p>
          <Link to="/shop">
            <Button variant="primary" className="px-12 py-5 tracking-[0.3em] uppercase text-xs font-bold shadow-2xl shadow-cyan-500/30">Start Exploring</Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your selection is empty', {
        icon: '🛒',
        style: {
          background: '#0F172A',
          color: '#f8fafc',
          border: '1px solid rgba(34, 211, 238, 0.2)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.15em'
        }
      });
      return;
    }

    if (!user) {
      toast.error('Identity Verification Required: Please login to continue.', {
        icon: '🔒',
        style: {
          background: '#0F172A',
          color: '#f8fafc',
          border: '1px solid rgba(244, 63, 94, 0.2)',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.15em'
        }
      });
      navigate('/login');
      return;
    }

    setIsCheckingOut(true);
    navigate('/checkout');
  };

  const tax = cartTotal * 0.12; // Luxury tax
  const total = cartTotal + tax;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-cyan-500 font-bold mb-2 block">Acquisition</span>
        <h1 className="text-4xl md:text-5xl font-serif text-text-primary tracking-wide uppercase">Your Selection</h1>
        <p className="text-text-muted text-sm mt-3 font-bold uppercase tracking-widest">{cartItems.length} curated pieces awaiting finalization</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="popLayout">
            {cartItems.map((item) => (
              <motion.div 
                key={item.id} 
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="glass-card p-6 flex flex-col sm:flex-row gap-8 items-center border-glass-border hover:border-cyan-500/20 transition-all group overflow-hidden"
              >
                <div className="w-32 h-32 bg-aether-700 rounded-xl p-3 flex-shrink-0 relative overflow-hidden border border-glass-border">
                  <ProductImage 
                    src={item.image_url || item.image_path || item.image || item.images?.[0]} 
                    alt={item.name} 
                    className="w-full h-full object-contain mix-blend-normal group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-aether-900/10 to-transparent" />
                </div>
                
                <div className="flex-1 flex flex-col w-full">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-cyan-500 font-bold mb-1 block">
                        {typeof item.category === 'object' ? item.category?.name : item.category}
                      </span>
                      <Link to={`/product/${item.id}`} className="hover:text-cyan-500 transition-colors">
                        <h3 className="text-xl font-serif text-text-primary leading-tight uppercase tracking-wide">{item.name}</h3>
                      </Link>
                    </div>
                    <span className="text-xl font-serif text-cyan-500 font-bold">
                      ${(Number(item.price) * item.qty).toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-4 bg-aether-700 border border-glass-border rounded-xl p-1.5 shadow-sm">
                      <button 
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        disabled={item.qty <= 1}
                        className="p-1.5 hover:text-cyan-500 disabled:opacity-30 transition-colors text-text-muted"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-text-primary tracking-widest">{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="p-1.5 hover:text-cyan-500 transition-colors text-text-muted"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-text-muted hover:text-red-500 transition-colors flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
                    >
                      <Trash2 className="w-4 h-4" /> Remove Piece
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <div className="flex justify-between items-center pt-8 border-t border-glass-border">
            <Link to="/shop" className="text-text-muted text-xs font-bold uppercase tracking-widest hover:text-text-primary transition-colors flex items-center gap-2">
              <ArrowRight className="w-4 h-4 rotate-180" /> Continue Exploring
            </Link>
            <button onClick={clearCart} className="text-red-500/60 hover:text-red-500 text-[10px] font-bold uppercase tracking-[0.2em] transition-colors">
              Clear Entire Selection
            </button>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-8 sticky top-24 border-cyan-500/20 shadow-xl"
          >
            <h2 className="text-xl font-serif text-text-primary mb-8 border-b border-glass-border pb-4 tracking-widest uppercase font-bold">Acquisition Summary</h2>
            
            <div className="space-y-5 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-bold uppercase tracking-widest text-[10px]">Subtotal</span>
                <span className="text-text-primary font-bold">${cartTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-bold uppercase tracking-widest text-[10px]">Insurance & Tax (12%)</span>
                <span className="text-text-primary font-bold">${tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted font-bold uppercase tracking-widest text-[10px]">Global Express</span>
                <span className="text-green-500 font-bold tracking-[0.2em] uppercase text-[9px]">Complimentary</span>
              </div>
              
              <div className="border-t border-glass-border pt-6 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.3em] block mb-1">Total Acquisition</span>
                  <span className="text-3xl font-serif text-text-primary font-bold">${total.toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-cyan-500/60 uppercase tracking-widest mb-1 font-bold">Authenticated via</p>
                  <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-widest">CMS GLOBAL SECURE</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="primary" 
              className="w-full text-xs font-bold py-5 tracking-[0.3em] uppercase group shadow-lg shadow-cyan-500/20"
              onClick={handleCheckout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? (
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  Authenticating...
                </motion.span>
              ) : (
                <>
                  Proceed to Checkout <ArrowRight className="w-4 h-4 inline ml-2 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </Button>

            <p className="text-[9px] text-text-muted text-center mt-6 leading-relaxed font-bold uppercase tracking-widest opacity-60">
              Price inclusive of white-glove concierge delivery and lifetime authenticity certification.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;

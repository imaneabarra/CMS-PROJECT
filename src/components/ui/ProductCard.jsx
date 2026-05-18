import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, Star } from 'lucide-react';
import { useProtectedCartAction } from '../../hooks/useProtectedCartAction';
import { useFavorites } from '../../context/FavoriteContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';

import AuthPromptModal from '../auth/AuthPromptModal';
import ProductImage from './ProductImage';

const badgeColors = {
  NEW:       'bg-cyan-500/90',
  LIMITED:   'bg-purple-500/90',
  EXCLUSIVE: 'bg-amber-500/90',
};

const ProductCard = ({ product, index = 0 }) => {
  const { protectedAddToCart } = useProtectedCartAction();
  const { toggleFavorite, isFavorited } = useFavorites();
  const { user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false);

  // Support both shapes: product.image_url (API), product.image_path, product.image, and product.images[] (Mock)
  const imgSrc = product.image_url || product.image_path || product.image || product.images?.[0];

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    toggleFavorite(product);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="glass-card group cursor-pointer flex-shrink-0 w-[260px] md:w-auto"
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-[4/5] bg-aether-800">
        <Link to={`/product/${product.id}`}>
          <ProductImage
            src={imgSrc}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
        </Link>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-aether-900/40 backdrop-blur-md border border-glass-border hover:scale-110 transition-all group/heart shadow-xl"
        >
          <Heart className={`w-4 h-4 transition-colors ${isFavorited(product.id) ? 'fill-cyan-500 text-cyan-500' : 'text-white group-hover/heart:text-cyan-400'}`} />
        </button>

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-4 left-4 ${badgeColors[product.badge] || 'bg-slate-500'} text-[9px] tracking-[0.2em] uppercase font-bold text-white px-2.5 py-1 rounded-sm shadow-xl z-10`}>
            {product.badge}
          </span>
        )}

        {/* Quick add overlay */}
        <div className="absolute inset-0 bg-aether-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => protectedAddToCart(product)}
            className="bg-cyan-500 text-white p-3.5 rounded-full shadow-2xl hover:bg-cyan-400 transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 space-y-3">
        <div className="flex justify-between items-start">
          <Link to={`/product/${product.id}`} className="flex-1 min-w-0 pr-4">
            <h3 className="text-sm font-bold text-text-primary tracking-wide hover:text-cyan-500 transition-colors uppercase truncate">
              {product.name}
            </h3>
          </Link>
          <span className="text-cyan-500 font-bold text-sm tracking-tight flex-shrink-0">
            ${product.price ? Number(product.price).toLocaleString() : '0'}
          </span>
        </div>

        {/* Rating Display */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-3 h-3 ${i < Math.floor(product.reviews_avg_rating || 0) ? 'fill-cyan-500 text-cyan-500' : 'text-text-muted/30'}`} />
          ))}
          <span className="text-[9px] text-text-muted font-bold ml-1 tracking-tighter uppercase opacity-60">
            ({product.reviews_count || 0})
          </span>
        </div>

        <p className="text-[10px] text-text-muted leading-relaxed line-clamp-2 uppercase tracking-widest font-bold opacity-80">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-2 border-t border-glass-border">
          <span className="text-[9px] font-bold text-text-muted uppercase tracking-[0.2em]">
            {typeof product.category === 'object' ? product.category?.name : product.category}
          </span>
          {product.originalPrice && (
            <span className="text-text-muted text-[10px] line-through opacity-40">
              ${product.originalPrice.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      {/* Auth Prompt Modal */}
      <AuthPromptModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </motion.div>
  );
};

export default ProductCard;

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFavorites } from '../../context/FavoriteContext';
import ProductCard from '../../components/ui/ProductCard';

const Favorites = () => {
  const { favorites, loading } = useFavorites();

  return (
    <div className="min-h-screen pt-32 pb-20 bg-aether-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-cyan-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-serif italic text-white tracking-tight">Your Favorites</h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-slate-400 max-w-2xl uppercase tracking-[0.1em] text-xs font-medium"
          >
            A curated collection of your most desired artifacts.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-2 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
            <p className="mt-4 text-slate-500 text-[10px] uppercase tracking-[0.3em] font-bold">Synchronizing Vault...</p>
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-aether-800/50 border border-glass-border rounded-3xl p-16 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-slate-600" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-4 uppercase tracking-wider">Your Vault is Empty</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
              Explore our collections and save the artifacts that resonate with your style.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-3 px-8 py-4 bg-cyan-500 text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20 group"
            >
              Start Exploring
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {favorites.map((favorite) => (
              <motion.div
                key={favorite.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <ProductCard product={favorite.product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;

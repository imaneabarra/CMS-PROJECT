import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Calendar, Shield, Globe, Cpu, Monitor, Wifi, Star, Heart, Loader2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { useNotifications } from '../../context/NotificationContext';
import { toast } from 'react-hot-toast';
import { useFavorites } from '../../context/FavoriteContext';
import AuthPromptModal from '../../components/auth/AuthPromptModal';
import api from '../../services/api';
import reviewService from '../../services/reviewService';
import DemoRequestModal from '../../components/product/DemoRequestModal';
import ProductImage from '../../components/ui/ProductImage';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleFavorite, isFavorited } = useFavorites();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const { addNotification } = useNotifications();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImg, setSelectedImg] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, avgRes, reviewsRes] = await Promise.all([
          api.get(`/products/${id}`),
          reviewService.getAverageRating(id),
          reviewService.getProductReviews(id)
        ]);

        setProduct(prodRes.data.data || prodRes.data);
        setAverageRating(avgRes.data.average_rating);
        setTotalReviews(avgRes.data.total_reviews);
        setReviews(reviewsRes.data);

        // Fetch user review if logged in
        if (user) {
          const userReviewRes = await reviewService.getUserReview(id);
          if (userReviewRes.data) {
            setUserRating(userReviewRes.data.rating);
            setUserComment(userReviewRes.data.comment || '');
          }
        }
      } catch (error) {
        console.error('Failed to fetch product data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, user]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-32">
      <Loader2 className="w-10 h-10 text-cyan-500 animate-spin" />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center pt-32 transition-colors duration-500">
      <div className="text-center space-y-8">
        <p className="text-text-muted text-[11px] font-bold uppercase tracking-[0.5em] opacity-60">Technical artifact not found in system archives.</p>
        <Link to="/shop">
          <button className="px-12 py-5 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-2xl text-[10px] font-black uppercase tracking-[0.4em] hover:bg-cyan-500 hover:text-white transition-all">
            Return to Master Catalog
          </button>
        </Link>
      </div>
    </div>
  );

  const catName = typeof product.category === 'object' ? product.category?.name : product.category;
  const images = product.image_url ? [product.image_url] : (product.image ? [product.image] : ['https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800']);

  const handleAddToCart = () => {
    addToCart(product, 1);
    toast.success(`${product.name} synchronized to your cart`, {
      style: {
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        color: '#f8fafc',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '16px',
        fontSize: '10px',
        fontWeight: 'bold',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        padding: '16px 24px'
      },
    });
  };

  const handleRating = (rating) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    setUserRating(rating);
  };

  const handleSubmitReview = async () => {
    if (userRating === 0) {
      toast.error('Please select a rating before submitting');
      return;
    }

    setIsRatingLoading(true);
    try {
      await reviewService.submitReview({
        product_id: id,
        rating: userRating,
        comment: userComment
      });
      
      // Refresh data
      const [avgRes, reviewsRes] = await Promise.all([
        reviewService.getAverageRating(id),
        reviewService.getProductReviews(id)
      ]);
      
      setAverageRating(avgRes.data.average_rating);
      setTotalReviews(avgRes.data.total_reviews);
      setReviews(reviewsRes.data);

      toast.success('REVIEW SYNCHRONIZED TO CORE FEED', {
        style: {
          background: 'rgba(15, 23, 42, 0.9)', color: '#f8fafc', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '16px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '0.2em',
          textTransform: 'uppercase', padding: '16px 24px'
        },
      });
    } catch (error) {
      console.error('Submit review error:', error);
      toast.error('FAILED TO TRANSMIT REVIEW');
    } finally {
      setIsRatingLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-24 px-4 max-w-7xl mx-auto transition-colors duration-500">
      {/* Breadcrumb */}
      <div className="flex items-center gap-4 py-12 text-[10px] font-bold uppercase tracking-[0.4em] text-text-muted">
        <Link to="/" className="hover:text-cyan-500 transition-colors">Home</Link>
        <span className="opacity-20">/</span>
        <Link to="/shop" className="hover:text-cyan-500 transition-colors">Archive</Link>
        <span className="opacity-20">/</span>
        <span className="text-text-primary font-black">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32">
        {/* Product Image */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-10">
          <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-aether-700 border border-glass-border shadow-2xl group">
            <ProductImage key={selectedImg}
              src={images[selectedImg]} alt={product.name}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms] opacity-90 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
            <button
              onClick={() => { if (!user) setIsAuthModalOpen(true); else toggleFavorite(product); }}
              className="absolute top-8 right-8 z-20 p-4 rounded-3xl bg-aether-900/60 backdrop-blur-2xl border border-white/10 hover:scale-110 transition-all shadow-2xl group/heart"
            >
              <Heart className={`w-6 h-6 transition-colors ${isFavorited(product.id) ? 'fill-cyan-500 text-cyan-500' : 'text-white group-hover/heart:text-cyan-400'}`} />
            </button>
          </div>
          {images.length > 1 && (
            <div className="flex gap-6">
              {images.map((img, i) => (
                <button key={i} onClick={() => setSelectedImg(i)}
                  className={`w-28 h-28 rounded-3xl overflow-hidden border-2 transition-all shadow-2xl active:scale-95
                    ${i === selectedImg ? 'border-cyan-500 scale-105 shadow-cyan-500/20' : 'border-glass-border opacity-40 hover:opacity-100 hover:border-cyan-500/30'}`}>
                  <ProductImage src={img} alt="" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-12">
          <div>
            <span className="inline-block px-5 py-2 bg-cyan-500/10 backdrop-blur-xl border border-cyan-500/20 rounded-full text-[10px] text-cyan-500 tracking-[0.5em] uppercase font-black shadow-2xl mb-10">
              CMS GLOBAL Certified Hardware
            </span>
            <p className="text-[11px] tracking-[0.6em] uppercase text-cyan-500 mb-6 font-bold opacity-60">{catName}</p>
            <h1 className="font-serif text-[28px] md:text-[32px] text-text-primary leading-[1.2] uppercase tracking-tight font-semibold">{product.name}</h1>
            <p className="mt-8 text-text-secondary text-[14px] md:text-[15px] font-medium leading-relaxed uppercase tracking-[0.15em] opacity-70 max-w-xl">{product.description}</p>
          </div>

          {/* Price */}
          <div className="flex items-center gap-10">
            <span className="text-[28px] md:text-[32px] font-serif text-text-primary font-semibold tracking-tight">${Number(product.price).toLocaleString()}</span>
          </div>

          {/* Rating */}
          <div className="flex flex-col gap-6 py-10 border-y border-glass-border">
            <span className="text-[10px] tracking-[0.5em] uppercase text-text-muted font-black opacity-60">Hardware Validation Score</span>
            <div className="flex items-center gap-8">
              <div className="flex gap-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button key={star} whileHover={{ scale: 1.3, rotate: 15 }} whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                    disabled={isRatingLoading}
                    onClick={() => handleRating(star)} className="transition-all duration-300 disabled:opacity-50">
                    <Star className={`w-7 h-7 transition-all duration-300 ${
                      (hoverRating || userRating) >= star ? 'fill-cyan-500 text-cyan-500 filter drop-shadow-[0_0_12px_rgba(6,182,212,0.6)]' : 'text-text-muted/20'
                    }`} />
                  </motion.button>
                ))}
              </div>
              <div className="flex flex-col">
                <span className="text-[12px] font-black text-text-primary uppercase tracking-[0.2em]">
                  {totalReviews > 0 ? `AVG: ${averageRating} / 5` : 'Awaiting Audit'}
                </span>
                {totalReviews > 0 && (
                  <span className="text-[10px] text-text-muted uppercase tracking-widest font-bold mt-1">
                    Based on {totalReviews} validation{totalReviews > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Comment Input */}
            <div className="space-y-4 mt-4">
              <span className="text-[10px] tracking-[0.3em] uppercase text-text-muted font-bold opacity-60 italic">Field Report (Optional)</span>
              <textarea
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
                placeholder="DESCRIBE ASSET PERFORMANCE..."
                rows={3}
                className="w-full bg-aether-900/50 border border-glass-border rounded-2xl p-5 text-[12px] text-text-primary uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-cyan-500/30 transition-all placeholder:text-text-muted/30"
              />
              <button
                onClick={handleSubmitReview}
                disabled={isRatingLoading || userRating === 0}
                className="px-8 py-3 bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 rounded-xl text-[9px] font-black uppercase tracking-[0.3em] hover:bg-cyan-500 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {isRatingLoading ? 'Transmitting...' : 'Submit Evaluation'}
              </button>
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
              {product.stock > 0 ? `${product.stock} units ready for deployment` : 'Out of stock - Check Archive'}
            </span>
          </div>

          {/* Actions */}
          <div className="space-y-6 pt-10">
            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="w-full flex items-center justify-center gap-5 py-6 rounded-[2rem] bg-cyan-500 text-white text-[11px] font-black uppercase tracking-[0.5em] hover:bg-cyan-400 transition-all shadow-[0_20px_50px_rgba(6,182,212,0.3)] active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed">
              <ShoppingBag className="w-5 h-5" /> Secure for Project
            </button>
            <button 
              onClick={() => { if (!user) setIsAuthModalOpen(true); else setIsDemoModalOpen(true); }}
              className="w-full flex items-center justify-center gap-5 py-6 rounded-[2rem] bg-aether-700 border border-glass-border text-[11px] text-text-secondary font-black uppercase tracking-[0.5em] hover:bg-text-primary hover:text-aether-900 transition-all shadow-xl active:scale-95"
            >
              <Calendar className="w-5 h-5" /> Schedule Technical Demo
            </button>
          </div>

          {/* Trust Badges */}
          <div className="flex items-center justify-between pt-16 border-t border-glass-border">
            {[['🌍', 'Global Logistics'], ['✦', 'Certified Hardware'], ['◈', 'Technical Support']].map(([icon, label]) => (
              <div key={label} className="flex flex-col items-center gap-4">
                <span className="text-cyan-500 text-2xl drop-shadow-[0_0_10px_rgba(6,182,212,0.3)]">{icon}</span>
                <span className="text-[9px] text-text-muted uppercase font-black tracking-[0.4em] opacity-60">{label}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tech Specs Section */}
      <div className="mt-48 border-t border-glass-border pt-32">
        <div className="max-w-4xl mb-24">
          <span className="text-[11px] tracking-[0.6em] uppercase text-cyan-500 font-bold mb-6 block opacity-60">Project Specifications</span>
          <h2 className="font-serif text-5xl md:text-7xl text-text-primary uppercase tracking-tighter font-bold leading-tight">Engineering Excellence</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="bg-aether-700/50 border border-glass-border p-12 rounded-[3rem] space-y-8 shadow-2xl hover:shadow-cyan-500/5 transition-all duration-700 group">
            <div className="w-20 h-20 rounded-[2rem] bg-cyan-500/5 flex items-center justify-center border border-cyan-500/20 group-hover:bg-cyan-500/10 transition-all">
              <Cpu className="w-8 h-8 text-cyan-500" />
            </div>
            <h3 className="font-serif text-3xl text-text-primary uppercase tracking-widest font-bold">Enterprise Core</h3>
            <p className="text-[11px] text-text-secondary leading-relaxed font-bold uppercase tracking-[0.2em] opacity-70">
              All CMS GLOBAL technical assets are sourced from certified enterprise-grade manufacturers, rigorously tested for 24/7 mission-critical operations.
            </p>
          </div>
          <div className="bg-aether-700/50 border border-glass-border p-12 rounded-[3rem] space-y-8 shadow-2xl hover:shadow-cyan-500/5 transition-all duration-700 group">
            <div className="w-20 h-20 rounded-[2rem] bg-cyan-500/5 flex items-center justify-center border border-cyan-500/20 group-hover:bg-cyan-500/10 transition-all">
              <Shield className="w-8 h-8 text-cyan-500" />
            </div>
            <h3 className="font-serif text-3xl text-text-primary uppercase tracking-widest font-bold">Project Protection</h3>
            <p className="text-[11px] text-text-secondary leading-relaxed font-bold uppercase tracking-[0.2em] opacity-70">
              Every hardware unit is backed by our technical assurance program, including comprehensive warranty and dedicated field support.
            </p>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-48 border-t border-glass-border pt-32">
        <div className="max-w-4xl mb-24">
          <span className="text-[11px] tracking-[0.6em] uppercase text-cyan-500 font-bold mb-6 block opacity-60">Validation Logs</span>
          <h2 className="font-serif text-5xl md:text-7xl text-text-primary uppercase tracking-tighter font-bold leading-tight">Field Intelligence</h2>
        </div>

        {reviews.length === 0 ? (
          <div className="p-20 text-center bg-aether-700/30 rounded-[3rem] border border-glass-border border-dashed">
            <p className="text-[11px] font-bold uppercase tracking-[0.5em] text-text-muted opacity-60">No field reports recorded for this asset.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="p-10 bg-aether-700/50 border border-glass-border rounded-[2.5rem] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-500 text-[10px] font-black uppercase">
                      {review.user?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-widest text-text-primary">{review.user?.name || 'Anonymous Agent'}</p>
                      <p className="text-[9px] font-bold uppercase tracking-tighter text-text-muted opacity-60">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-cyan-500 text-cyan-500' : 'text-text-muted/20'}`} />
                    ))}
                  </div>
                </div>
                {review.comment && (
                  <p className="text-[13px] text-text-secondary leading-relaxed uppercase tracking-wider opacity-80">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <AuthPromptModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <DemoRequestModal 
        isOpen={isDemoModalOpen} 
        onClose={() => setIsDemoModalOpen(false)} 
        product={product}
      />
    </div>
  );
};

export default ProductDetails;

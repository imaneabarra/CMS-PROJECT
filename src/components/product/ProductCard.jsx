import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useFavorites } from '../../context/FavoriteContext';
import Button from '../ui/Button';

import ProductImage from '../ui/ProductImage';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorited } = useFavorites();

  const favorited = isFavorited(product.id);

  return (
    <div className="card group flex flex-col justify-between h-full hover:-translate-y-1 transition-transform duration-300 relative">
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product);
          }}
          className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
            favorited
              ? 'bg-red-500/20 border-red-500/30 text-red-500'
              : 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10'
          }`}
          aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>
      </div>

      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-white p-6 rounded-t-2xl">
        <ProductImage 
          src={product.image_url || product.image} 
          alt={product.title || product.name} 
          className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300" 
        />
      </Link>
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/product/${product.id}`} className="mb-3">
          <h3 className="text-slate-200 font-semibold text-lg line-clamp-2 hover:text-primary transition-colors">{product.title || product.name}</h3>
        </Link>
        <p className="text-slate-400 text-sm mb-4 capitalize">{product.category}</p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-primary">${(product.price || 0).toFixed(2)}</span>
          <Button variant="primary" onClick={() => addToCart(product)} className="!px-3 !py-2 shadow-none" aria-label="Add to cart">
            <ShoppingCart className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

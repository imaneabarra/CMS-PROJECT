import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import favoriteService from '../services/favoriteService';
import { toast } from 'react-hot-toast';

const FavoriteContext = createContext();

export const FavoriteProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      return;
    }
    try {
      setLoading(true);
      const data = await favoriteService.getFavorites();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (product) => {
    if (!user) {
      toast.error('Please login to add to favorites');
      return false;
    }

    const isFavorited = favorites.some(f => f.product_id === product.id);

    try {
      if (isFavorited) {
        await favoriteService.removeFromFavorites(product.id);
        setFavorites(prev => prev.filter(f => f.product_id !== product.id));
        toast.success('Removed from favorites');
      } else {
        await favoriteService.addToFavorites(product.id);
        // We add it locally to avoid an extra API call, but we might need the full product object
        setFavorites(prev => [{ product_id: product.id, product: product }, ...prev]);
        toast.success('Added to favorites');
      }
      return true;
    } catch (error) {
      toast.error('Failed to update favorites');
      return false;
    }
  };

  const isFavorited = (productId) => {
    return favorites.some(f => f.product_id === productId);
  };

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorited, loading, fetchFavorites }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
};

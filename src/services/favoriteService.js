import api from './api';

const favoriteService = {
  getFavorites: async () => {
    const response = await api.get('/favorites');
    return response.data;
  },

  addToFavorites: async (productId) => {
    const response = await api.post('/favorites', { product_id: productId });
    return response.data;
  },

  removeFromFavorites: async (productId) => {
    const response = await api.delete(`/favorites/${productId}`);
    return response.data;
  },

  checkIsFavorited: async (productId) => {
    const response = await api.get(`/favorites/check/${productId}`);
    return response.data;
  }
};

export default favoriteService;

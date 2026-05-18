import api from './api';

const reviewService = {
  /**
   * Get all reviews for a product.
   */
  getProductReviews: async (productId) => {
    const response = await api.get(`/products/${productId}/reviews`);
    return response.data;
  },

  /**
   * Get average rating and total review count for a product.
   */
  getAverageRating: async (productId) => {
    const response = await api.get(`/products/${productId}/reviews/average`);
    return response.data;
  },

  /**
   * Add or update a review.
   */
  submitReview: async (reviewData) => {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  },

  /**
   * Get the current user's review for a product.
   */
  getUserReview: async (productId) => {
    const response = await api.get(`/reviews/product/${productId}`);
    return response.data;
  }
};

export default reviewService;

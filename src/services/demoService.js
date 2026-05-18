import api from './api';

const demoService = {
  /**
   * Submit a new technical demo request.
   */
  requestDemo: async (demoData) => {
    // demoData: { product_id, scheduled_date, phone, notes }
    const response = await api.post('/demo-requests', demoData);
    return response.data;
  },

  /**
   * Get authenticated user's demo requests.
   */
  getMyRequests: async () => {
    const response = await api.get('/demo-requests/my');
    return response.data;
  }
};

export default demoService;

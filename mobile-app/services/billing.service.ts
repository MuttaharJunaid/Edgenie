import api from './api';

export const billingService = {
  getStatus: () =>
    api.get('/api/billing/status/'),

  createCheckout: () =>
    api.post('/api/billing/create-checkout/'),
};

export default billingService;

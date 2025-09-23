// src/features/recommend/api/dashApi.js
import ApiClient from './ApiClient';

class DashApiService extends ApiClient {
  /** POST /api/dash/saymyname  { customerId } */
  sayMyName(customerId) {
    return this.request('/dash/saymyname', {
      method: 'POST',
      body: { customerId },
    });
  }

  /** POST /api/dash/analyze  { customerId, months?, from?, to? ... } */
  analyze(payload) {
    return this.request('/dash/analyze', {
      method: 'POST',
      body: payload,
    });
  }

  /** POST /api/dash/advice  { customerId } */
  advice(customerId) {
    return this.request('/dash/advice', {
      method: 'POST',
      body: { customerId },
    });
  }

  /** GET /api/dash/customer/{customerId}/pay-this-month */
  payThisMonth(customerId) {
    return this.request(`/dash/customer/${encodeURIComponent(customerId)}/pay-this-month`, {
      method: 'GET',
    });
  }
}

const dashApi = new DashApiService();
export default dashApi;

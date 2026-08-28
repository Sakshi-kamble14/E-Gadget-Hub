import api from "./axios";

export const requestApi = {
  create: (payload) => api.post("/requests", payload),
  getAll: () => api.get("/requests"),
  getById: (id) => api.get(`/requests/${id}`),
  getByCustomer: (customerId) => api.get(`/requests/customer/${customerId}`),
  getByCollector: (collectorId) => api.get(`/requests/collector/${collectorId}`),
  assignCollector: (requestId, collectorId) =>
    api.put(`/requests/${requestId}/assign/${collectorId}`),
  updateStatus: (requestId, status) => api.put(`/requests/${requestId}/status`, { status }),
  delete: (id) => api.delete(`/requests/${id}`),
};

export default requestApi;

import api from "./axios";

export const inventoryApi = {
  getAll: () => api.get("/inventory"),
  getById: (id) => api.get(`/inventory/${id}`),
  getByCollector: (collectorId) => api.get(`/inventory/collector/${collectorId}`),
  create: (payload) => api.post("/inventory", payload),
  update: (id, payload) => api.put(`/inventory/${id}`, payload),
  delete: (id) => api.delete(`/inventory/${id}`),
};

export default inventoryApi;

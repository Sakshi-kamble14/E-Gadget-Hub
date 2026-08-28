import api from "./axios";

export const collectionPointApi = {
  getAll: () => api.get("/collection-points"),
  getById: (id) => api.get(`/collection-points/${id}`),
  create: (payload) => api.post("/collection-points", payload),
  update: (id, payload) => api.put(`/collection-points/${id}`, payload),
  delete: (id) => api.delete(`/collection-points/${id}`),
};

export default collectionPointApi;

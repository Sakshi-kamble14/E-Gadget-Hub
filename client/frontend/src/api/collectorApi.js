import api from "./axios";

export const collectorApi = {
  getAll: () => api.get("/collectors"),
  getById: (id) => api.get(`/collectors/${id}`),
  getRequests: (collectorId) => api.get(`/collectors/${collectorId}/requests`),
  updateCollectionPoint: (collectorId, pointId) =>
    api.put(`/collectors/${collectorId}/collection-point/${pointId}`),
};

export default collectorApi;

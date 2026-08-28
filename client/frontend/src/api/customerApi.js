import api from "./axios";

export const customerApi = {
  getById: (id) => api.get(`/customers/${id}`),
  update: (id, payload) => api.put(`/customers/${id}`, payload),
  delete: (id) => api.delete(`/customers/${id}`),
};

export default customerApi;

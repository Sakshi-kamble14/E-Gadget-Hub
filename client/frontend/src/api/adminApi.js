import api from "./axios";

export const adminApi = {
  getDashboard: () => api.get("/admin/dashboard"),
  getCustomers: () => api.get("/admin/customers"),
  getCollectors: () => api.get("/admin/collectors"),
  getRequests: () => api.get("/admin/requests"),
  getInventory: () => api.get("/admin/inventory"),
};

export default adminApi;

import api from "./axios";

export const authApi = {
  customerRegister: (payload) => api.post("/auth/customer/register", payload),
  customerLogin: (payload) => api.post("/auth/customer/login", payload),

  collectorRegister: (payload) => api.post("/auth/collector/register", payload),
  collectorLogin: (payload) => api.post("/auth/collector/login", payload),

  adminRegister: (payload) => api.post("/auth/admin/register", payload),
  adminLogin: (payload) => api.post("/auth/admin/login", payload),
};

export default authApi;

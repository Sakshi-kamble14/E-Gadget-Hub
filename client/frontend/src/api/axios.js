import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token automatically to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("ewaste_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Normalize errors and handle global 401 / 403 behavior
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.friendlyMessage =
        "Network error. Please check your connection or make sure the backend server is running.";
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    if (status === 401) {
      error.friendlyMessage = data?.message || "Your session has expired. Please log in again.";
      localStorage.removeItem("ewaste_token");
      localStorage.removeItem("ewaste_user");
      localStorage.removeItem("ewaste_role");
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      error.friendlyMessage = data?.message || "Access denied. You don't have permission to do this.";
    } else if (status === 404) {
      error.friendlyMessage = data?.message || "The requested resource was not found.";
    } else if (status === 409) {
      error.friendlyMessage = data?.message || "A conflict occurred. This record may already exist.";
    } else if (status === 400) {
      error.friendlyMessage = data?.message || "Invalid request. Please check the submitted data.";
    } else if (status >= 500) {
      error.friendlyMessage = "Something went wrong on the server. Please try again shortly.";
    } else {
      error.friendlyMessage = data?.message || "An unexpected error occurred.";
    }

    return Promise.reject(error);
  }
);

export default api;

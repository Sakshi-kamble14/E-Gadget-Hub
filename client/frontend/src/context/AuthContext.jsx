import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import authApi from "../api/authApi";

export const AuthContext = createContext(null);

const roleLoginFn = {
  CUSTOMER: authApi.customerLogin,
  COLLECTOR: authApi.collectorLogin,
  ADMIN: authApi.adminLogin,
};

const roleRegisterFn = {
  CUSTOMER: authApi.customerRegister,
  COLLECTOR: authApi.collectorRegister,
  ADMIN: authApi.adminRegister,
};

export const roleDashboardPath = {
  CUSTOMER: "/customer/dashboard",
  COLLECTOR: "/collector/dashboard",
  ADMIN: "/admin/dashboard",
};

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("ewaste_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("ewaste_token"));
  const [user, setUser] = useState(readStoredUser);
  const [role, setRole] = useState(() => localStorage.getItem("ewaste_role"));
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    setInitializing(false);
  }, []);

  const persistSession = useCallback((data) => {
    localStorage.setItem("ewaste_token", data.token);
    localStorage.setItem("ewaste_user", JSON.stringify(data.user));
    localStorage.setItem("ewaste_role", data.role);
    setToken(data.token);
    setUser(data.user);
    setRole(data.role);
  }, []);

  const login = useCallback(
    async (selectedRole, credentials) => {
      const fn = roleLoginFn[selectedRole];
      const response = await fn(credentials);
      const { data } = response.data;
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const register = useCallback(
    async (selectedRole, payload) => {
      const fn = roleRegisterFn[selectedRole];
      const response = await fn(payload);
      const { data } = response.data;
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("ewaste_user", JSON.stringify(updatedUser));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("ewaste_token");
    localStorage.removeItem("ewaste_user");
    localStorage.removeItem("ewaste_role");
    setToken(null);
    setUser(null);
    setRole(null);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      role,
      isAuthenticated: Boolean(token),
      initializing,
      login,
      register,
      logout,
      updateUser,
    }),
    [token, user, role, initializing, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;

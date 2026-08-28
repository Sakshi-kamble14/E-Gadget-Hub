import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { roleDashboardPath } from "../context/AuthContext";

export default function RoleRoute({ allowedRoles }) {
  const { role } = useAuth();

  if (!allowedRoles.includes(role)) {
    return <Navigate to={roleDashboardPath[role] || "/login"} replace />;
  }

  return <Outlet />;
}

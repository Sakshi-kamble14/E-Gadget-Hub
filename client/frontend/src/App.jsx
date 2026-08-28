import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { roleDashboardPath } from "./context/AuthContext";

import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./routes/ProtectedRoute";
import RoleRoute from "./routes/RoleRoute";

import LandingPage from "./pages/public/LandingPage";
import NotFoundPage from "./pages/public/NotFoundPage";

import LoginPage from "./pages/auth/LoginPage";
import CustomerRegisterPage from "./pages/auth/CustomerRegisterPage";
import CollectorRegisterPage from "./pages/auth/CollectorRegisterPage";
import AdminRegisterPage from "./pages/auth/AdminRegisterPage";

import CustomerDashboardPage from "./pages/customer/CustomerDashboardPage";
import CustomerRequestsPage from "./pages/customer/CustomerRequestsPage";
import CreateRequestPage from "./pages/customer/CreateRequestPage";
import CustomerCollectionPointsPage from "./pages/customer/CustomerCollectionPointsPage";
import CustomerProfilePage from "./pages/customer/CustomerProfilePage";

import CollectorDashboardPage from "./pages/collector/CollectorDashboardPage";
import CollectorRequestsPage from "./pages/collector/CollectorRequestsPage";
import CollectorInventoryPage from "./pages/collector/CollectorInventoryPage";
import CollectorCollectionPointPage from "./pages/collector/CollectorCollectionPointPage";
import CollectorProfilePage from "./pages/collector/CollectorProfilePage";

import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCustomersPage from "./pages/admin/AdminCustomersPage";
import AdminCollectorsPage from "./pages/admin/AdminCollectorsPage";
import AdminCollectionPointsPage from "./pages/admin/AdminCollectionPointsPage";
import AdminRequestsPage from "./pages/admin/AdminRequestsPage";
import AdminInventoryPage from "./pages/admin/AdminInventoryPage";
import AdminProfilePage from "./pages/admin/AdminProfilePage";

function GuestOnly({ children }) {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={roleDashboardPath[role] || "/"} replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        }
      />
      <Route
        path="/register/customer"
        element={
          <GuestOnly>
            <CustomerRegisterPage />
          </GuestOnly>
        }
      />
      <Route
        path="/register/collector"
        element={
          <GuestOnly>
            <CollectorRegisterPage />
          </GuestOnly>
        }
      />
      <Route
        path="/register/admin"
        element={
          <GuestOnly>
            <AdminRegisterPage />
          </GuestOnly>
        }
      />

      {/* Protected - requires authentication */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          {/* Customer */}
          <Route element={<RoleRoute allowedRoles={["CUSTOMER"]} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
            <Route path="/customer/requests" element={<CustomerRequestsPage />} />
            <Route path="/customer/create-request" element={<CreateRequestPage />} />
            <Route path="/customer/collection-points" element={<CustomerCollectionPointsPage />} />
            <Route path="/customer/profile" element={<CustomerProfilePage />} />
          </Route>

          {/* Collector */}
          <Route element={<RoleRoute allowedRoles={["COLLECTOR"]} />}>
            <Route path="/collector/dashboard" element={<CollectorDashboardPage />} />
            <Route path="/collector/requests" element={<CollectorRequestsPage />} />
            <Route path="/collector/inventory" element={<CollectorInventoryPage />} />
            <Route path="/collector/collection-point" element={<CollectorCollectionPointPage />} />
            <Route path="/collector/profile" element={<CollectorProfilePage />} />
          </Route>

          {/* Admin */}
          <Route element={<RoleRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/customers" element={<AdminCustomersPage />} />
            <Route path="/admin/collectors" element={<AdminCollectorsPage />} />
            <Route path="/admin/collection-points" element={<AdminCollectionPointsPage />} />
            <Route path="/admin/requests" element={<AdminRequestsPage />} />
            <Route path="/admin/inventory" element={<AdminInventoryPage />} />
            <Route path="/admin/profile" element={<AdminProfilePage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

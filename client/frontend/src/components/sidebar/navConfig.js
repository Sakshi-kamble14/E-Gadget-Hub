export const navByRole = {
  CUSTOMER: [
    { to: "/customer/dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
    { to: "/customer/requests", label: "My Requests", icon: "bi-clipboard-data" },
    { to: "/customer/create-request", label: "New Request", icon: "bi-plus-circle" },
    { to: "/customer/collection-points", label: "Collection Points", icon: "bi-geo-alt" },
    { to: "/customer/profile", label: "Profile", icon: "bi-person-circle" },
  ],
  COLLECTOR: [
    { to: "/collector/dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
    { to: "/collector/requests", label: "Requests", icon: "bi-clipboard-data" },
    { to: "/collector/inventory", label: "Inventory", icon: "bi-box-seam" },
    { to: "/collector/collection-point", label: "Collection Point", icon: "bi-geo-alt" },
    { to: "/collector/profile", label: "Profile", icon: "bi-person-circle" },
  ],
  ADMIN: [
    { to: "/admin/dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
    { to: "/admin/requests", label: "Requests", icon: "bi-clipboard-data" },
    { to: "/admin/collection-points", label: "Collection Points", icon: "bi-geo-alt" },
    { to: "/admin/inventory", label: "Inventory", icon: "bi-box-seam" },
    { to: "/admin/customers", label: "Customers", icon: "bi-people" },
    { to: "/admin/collectors", label: "Collectors", icon: "bi-truck" },
    { to: "/admin/profile", label: "Profile", icon: "bi-person-circle" },
  ],
};

export default navByRole;

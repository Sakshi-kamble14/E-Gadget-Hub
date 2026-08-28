export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function initials(name = "") {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function extractErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  return error?.friendlyMessage || error?.response?.data?.message || error?.message || fallback;
}

export function pageTitleForPath(pathname) {
  const map = {
    "/customer/dashboard": "Dashboard",
    "/customer/requests": "My Requests",
    "/customer/create-request": "New Request",
    "/customer/collection-points": "Collection Points",
    "/customer/profile": "My Profile",
    "/collector/dashboard": "Dashboard",
    "/collector/requests": "Assigned Requests",
    "/collector/inventory": "My Inventory",
    "/collector/collection-point": "Collection Point",
    "/collector/profile": "My Profile",
    "/admin/dashboard": "Dashboard",
    "/admin/customers": "Customers",
    "/admin/collectors": "Collectors",
    "/admin/collection-points": "Collection Points",
    "/admin/requests": "E-Waste Requests",
    "/admin/inventory": "Inventory",
    "/admin/profile": "My Profile",
  };
  return map[pathname] || "EcoCycle";
}

import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import RoleBadge from "../badges/RoleBadge";
import { initials, pageTitleForPath } from "../../utils/format";

function nameFor(user, role) {
  if (!user) return "User";
  return user.customerName || user.collectorName || user.adminName || "User";
}

function profilePathFor(role) {
  if (role === "CUSTOMER") return "/customer/profile";
  if (role === "COLLECTOR") return "/collector/profile";
  return "/admin/profile";
}

export default function Topbar({ onMenuClick }) {
  const { user, role, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const displayName = nameFor(user, role);

  return (
    <header className="app-topbar">
      <div className="d-flex align-items-center gap-3">
        <button
          type="button"
          className="btn-icon-eco d-lg-none"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <i className="bi bi-list fs-5" />
        </button>
        <h5 className="mb-0 d-none d-sm-block">{pageTitleForPath(location.pathname)}</h5>
      </div>

      <div className="d-flex align-items-center gap-2 gap-sm-3">
        <button type="button" className="btn-icon-eco position-relative" aria-label="Notifications">
          <i className="bi bi-bell" />
          <span
            className="position-absolute"
            style={{
              top: 6,
              right: 6,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "var(--color-lime)",
            }}
          />
        </button>

        <div className="position-relative" ref={menuRef}>
          <button
            type="button"
            className="d-flex align-items-center gap-2 border-0 bg-transparent"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="true"
            aria-expanded={menuOpen}
          >
            <div className="avatar-eco">{initials(displayName)}</div>
            <div className="d-none d-md-flex flex-column align-items-start lh-1">
              <span className="fw-semibold small">{displayName}</span>
              <RoleBadge role={role} />
            </div>
            <i className="bi bi-chevron-down small text-muted-eco d-none d-md-inline" />
          </button>

          {menuOpen && (
            <div
              className="card-eco position-absolute end-0 mt-2 py-2"
              style={{ minWidth: 190, zIndex: 1050 }}
            >
              <button
                type="button"
                className="dropdown-item-eco d-flex align-items-center gap-2 px-3 py-2 w-100 border-0 bg-transparent text-start"
                onClick={() => {
                  setMenuOpen(false);
                  navigate(profilePathFor(role));
                }}
              >
                <i className="bi bi-person-circle" /> My Profile
              </button>
              <button
                type="button"
                className="dropdown-item-eco d-flex align-items-center gap-2 px-3 py-2 w-100 border-0 bg-transparent text-start text-danger"
                onClick={logout}
              >
                <i className="bi bi-box-arrow-right" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

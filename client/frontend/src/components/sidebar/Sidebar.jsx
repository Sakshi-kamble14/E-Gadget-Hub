import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import navByRole from "./navConfig";

export default function Sidebar({ open, onClose }) {
  const { role, logout } = useAuth();
  const items = navByRole[role] || [];

  return (
    <aside className={`app-sidebar ${open ? "open" : ""}`}>
      <div className="sidebar-brand">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ width: 36, height: 36, borderRadius: 10, background: "var(--color-lime)" }}
        >
          <i className="bi bi-recycle" style={{ color: "#06251a", fontSize: "1.1rem" }} />
        </div>
        <span className="fw-bold text-white fs-5">EcoCycle</span>
        <button
          type="button"
          className="btn-close btn-close-white ms-auto d-lg-none"
          onClick={onClose}
          aria-label="Close menu"
        />
      </div>

      <nav className="sidebar-nav">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-link ${isActive ? "active" : ""}`}
            onClick={onClose}
            end
          >
            <i className={`bi ${item.icon}`} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-link w-100 border-0"
          style={{ background: "rgba(255,255,255,0.06)" }}
          onClick={logout}
        >
          <i className="bi bi-box-arrow-right" />
          Logout
        </button>
      </div>
    </aside>
  );
}

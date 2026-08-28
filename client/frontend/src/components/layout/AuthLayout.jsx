import { Link } from "react-router-dom";

export default function AuthLayout({ children, sideTitle, sideSubtitle }) {
  return (
    <div className="auth-shell">
      <div className="auth-side">
        <div>
          <Link to="/" className="d-flex align-items-center gap-2 text-white mb-5">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: 38, height: 38, borderRadius: 10, background: "var(--color-lime)" }}
            >
              <i className="bi bi-recycle" style={{ color: "#06251a", fontSize: "1.2rem" }} />
            </div>
            <span className="fw-bold fs-4">EcoCycle</span>
          </Link>
          <h2 className="text-white mb-3" style={{ maxWidth: 420 }}>
            {sideTitle || "Smart E-Waste Management for a Cleaner Future"}
          </h2>
          <p className="text-white-50" style={{ maxWidth: 400 }}>
            {sideSubtitle ||
              "Track your requests, manage collection points, and help build a circular economy for electronics."}
          </p>
        </div>
        <div className="d-flex gap-4 text-white-50 small">
          <span><i className="bi bi-shield-check me-2" />Secure & role-based</span>
          <span><i className="bi bi-graph-up-arrow me-2" />Transparent tracking</span>
        </div>
      </div>

      <div className="auth-form-col">
        <div style={{ width: "100%", maxWidth: 440 }}>
          <Link to="/" className="d-flex d-lg-none align-items-center gap-2 mb-4 justify-content-center">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: 34, height: 34, borderRadius: 9, background: "var(--color-primary)" }}
            >
              <i className="bi bi-recycle text-white" />
            </div>
            <span className="fw-bold fs-5">EcoCycle</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}

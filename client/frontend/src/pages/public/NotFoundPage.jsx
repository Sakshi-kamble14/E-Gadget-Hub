import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="d-flex align-items-center justify-content-center eco-bg" style={{ minHeight: "100vh" }}>
      <div className="text-center px-3">
        <div className="feature-icon-eco mx-auto mb-4" style={{ width: 80, height: 80, fontSize: "2rem" }}>
          <i className="bi bi-signpost-split" />
        </div>
        <h1 className="display-5 fw-bold mb-2">404</h1>
        <p className="text-muted-eco mb-4">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-eco-primary px-4 py-2">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

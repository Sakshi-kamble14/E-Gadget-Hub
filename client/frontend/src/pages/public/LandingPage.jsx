import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "bi-truck",
    title: "Easy E-Waste Collection",
    desc: "Schedule a pickup in a few clicks and let a nearby collector handle the rest.",
  },
  {
    icon: "bi-geo-alt",
    title: "Collection Point Management",
    desc: "Browse active collection points and their capacity before you submit a request.",
  },
  {
    icon: "bi-clipboard-data",
    title: "Request Tracking",
    desc: "Follow every request from submission to recycling with a live status timeline.",
  },
  {
    icon: "bi-recycle",
    title: "Responsible Recycling",
    desc: "E-waste is processed and recycled through verified collection partners.",
  },
  {
    icon: "bi-box-seam",
    title: "Inventory Management",
    desc: "Collectors log and track e-waste inventory from pickup through to recycling.",
  },
  {
    icon: "bi-shield-check",
    title: "Transparent Processing",
    desc: "Role-based dashboards keep customers, collectors, and admins fully in sync.",
  },
];

const STEPS = [
  { title: "Register", desc: "Create a free customer account in under a minute." },
  { title: "Submit E-Waste Request", desc: "Pick a nearby collection point and submit your request." },
  { title: "Collector Gets Assigned", desc: "An admin assigns a verified collector to your request." },
  { title: "E-Waste Gets Collected", desc: "The collector picks up your electronics on schedule." },
  { title: "E-Waste Gets Processed/Recycled", desc: "Your e-waste is responsibly recycled and tracked." },
];

export default function LandingPage() {
  return (
    <div>
      {/* Public top nav */}
      <nav className="navbar navbar-expand-lg bg-white border-bottom sticky-top py-3">
        <div className="container">
          <Link to="/" className="navbar-brand d-flex align-items-center gap-2 fw-bold">
            <div
              className="d-flex align-items-center justify-content-center"
              style={{ width: 34, height: 34, borderRadius: 9, background: "var(--color-primary)" }}
            >
              <i className="bi bi-recycle text-white" />
            </div>
            EcoCycle
          </Link>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn-eco-outline">
              Login
            </Link>
            <Link to="/register/customer" className="btn-eco-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="landing-hero py-5">
        <div className="container py-5">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <span className="pill-eco mb-3">
                <i className="bi bi-stars" /> Circular economy platform
              </span>
              <h1 className="display-5 fw-bold mb-3" style={{ lineHeight: 1.15 }}>
                Smart E-Waste Management for a Cleaner Future
              </h1>
              <p className="fs-5 text-muted-eco mb-4" style={{ maxWidth: 560 }}>
                Submit e-waste collection requests, track them in real time, and connect with
                verified collectors and recycling partners — all from one platform built for
                responsible electronics disposal.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/register/customer" className="btn-eco-primary btn-lg px-4">
                  Get Started <i className="bi bi-arrow-right ms-1" />
                </Link>
                <Link to="/login" className="btn-eco-outline btn-lg px-4">
                  Login
                </Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="card-eco p-4">
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div className="feature-icon-eco">
                    <i className="bi bi-recycle" />
                  </div>
                  <div>
                    <div className="fw-bold">Request #1042</div>
                    <div className="text-muted-eco small">Collection Point: Downtown Hub</div>
                  </div>
                </div>
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3 mb-2" style={{ background: "var(--color-bg)" }}>
                  <span className="small fw-semibold">Status</span>
                  <span className="badge-eco badge-success-eco"><i className="bi bi-check-circle" />COMPLETED</span>
                </div>
                <div className="d-flex align-items-center justify-content-between p-3 rounded-3" style={{ background: "var(--color-bg)" }}>
                  <span className="small fw-semibold">Collector</span>
                  <span className="small text-muted-eco">Assigned & verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-5">
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="pill-eco mb-2">Features</span>
            <h2 className="mt-2">Everything you need to manage e-waste</h2>
          </div>
          <div className="row g-4">
            {FEATURES.map((f) => (
              <div className="col-md-6 col-lg-4" key={f.title}>
                <div className="card-eco card-eco-hover p-4 h-100">
                  <div className="feature-icon-eco mb-3">
                    <i className={`bi ${f.icon}`} />
                  </div>
                  <h5>{f.title}</h5>
                  <p className="text-muted-eco mb-0 small">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-5" style={{ background: "var(--color-primary-light)" }}>
        <div className="container py-4">
          <div className="text-center mb-5">
            <span className="pill-eco mb-2">Process</span>
            <h2 className="mt-2">How it works</h2>
          </div>
          <div className="row g-4">
            {STEPS.map((s, i) => (
              <div className="col-12 col-md-6 col-lg" key={s.title}>
                <div className="d-flex align-items-start gap-3">
                  <div className="step-number">{i + 1}</div>
                  <div>
                    <h6 className="mb-1">{s.title}</h6>
                    <p className="small text-muted-eco mb-0">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-5">
        <div className="container py-4">
          <div className="row text-center g-4">
            <div className="col-6 col-lg-3 stat-block-eco">
              <h2><i className="bi bi-geo-alt-fill me-1" />50+</h2>
              <p className="text-muted-eco small mb-0">Collection Points</p>
            </div>
            <div className="col-6 col-lg-3 stat-block-eco">
              <h2>10K+</h2>
              <p className="text-muted-eco small mb-0">Requests Handled</p>
            </div>
            <div className="col-6 col-lg-3 stat-block-eco">
              <h2>25T+</h2>
              <p className="text-muted-eco small mb-0">E-Waste Recycled</p>
            </div>
            <div className="col-6 col-lg-3 stat-block-eco">
              <h2>200+</h2>
              <p className="text-muted-eco small mb-0">Active Collectors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5" style={{ background: "var(--color-primary-darker)" }}>
        <div className="container">
          <div className="row g-4 text-white-50">
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2 text-white fw-bold fs-5 mb-2">
                <i className="bi bi-recycle" /> EcoCycle
              </div>
              <p className="small mb-0">
                A smart platform for responsible e-waste collection, tracking, and recycling.
              </p>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="text-white small text-uppercase">About</h6>
              <p className="small mb-1">Our mission</p>
              <p className="small mb-0">Sustainability</p>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="text-white small text-uppercase">Features</h6>
              <p className="small mb-1">Collection points</p>
              <p className="small mb-0">Tracking</p>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="text-white small text-uppercase">Contact</h6>
              <p className="small mb-0">support@ecocycle.app</p>
            </div>
            <div className="col-6 col-md-2">
              <h6 className="text-white small text-uppercase">Account</h6>
              <Link to="/login" className="d-block small text-white-50 mb-1">Login</Link>
              <Link to="/register/customer" className="d-block small text-white-50">Register</Link>
            </div>
          </div>
          <hr className="border-secondary my-4" />
          <p className="small text-white-50 mb-0 text-center">
            &copy; {new Date().getFullYear()} EcoCycle. Built for a cleaner, circular future.
          </p>
        </div>
      </footer>
    </div>
  );
}

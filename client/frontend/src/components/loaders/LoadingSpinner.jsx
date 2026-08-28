export default function LoadingSpinner({ label = "Loading…", fullHeight = false }) {
  return (
    <div
      className={`d-flex flex-column align-items-center justify-content-center gap-3 text-muted-eco ${
        fullHeight ? "" : "py-5"
      }`}
      style={fullHeight ? { minHeight: "50vh" } : undefined}
    >
      <div className="spinner-eco" role="status" />
      <span className="small fw-semibold">{label}</span>
    </div>
  );
}

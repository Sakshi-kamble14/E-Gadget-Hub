const STEPS = ["PENDING", "ASSIGNED", "COLLECTED", "COMPLETED"];
const ICONS = {
  PENDING: "bi-hourglass-split",
  ASSIGNED: "bi-person-check",
  COLLECTED: "bi-box-seam",
  COMPLETED: "bi-check-circle",
};

export default function StatusTimeline({ status }) {
  if (status === "CANCELLED") {
    return (
      <div className="d-flex align-items-center gap-2 text-danger fw-semibold">
        <i className="bi bi-x-circle-fill fs-5" />
        This request was cancelled.
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(status);

  return (
    <div className="status-timeline">
      {STEPS.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "current" : "";
        return (
          <div key={step} className={`tl-step ${state}`}>
            <span className="tl-line" />
            <div className="tl-dot">
              <i className={`bi ${ICONS[step]}`} />
            </div>
            <div className="tl-label">{step}</div>
          </div>
        );
      })}
    </div>
  );
}

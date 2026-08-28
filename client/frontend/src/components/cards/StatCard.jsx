export default function StatCard({ label, value, icon, tone = "primary", suffix }) {
  const tones = {
    primary: { bg: "var(--color-primary-light)", color: "var(--color-primary-dark)" },
    accent: { bg: "var(--color-accent-light)", color: "var(--color-accent-dark)" },
    lime: { bg: "var(--color-lime-light)", color: "var(--color-lime-dark)" },
    warning: { bg: "var(--color-warning-bg)", color: "var(--color-warning)" },
    info: { bg: "var(--color-info-bg)", color: "var(--color-info)" },
    success: { bg: "var(--color-success-bg)", color: "var(--color-success)" },
    danger: { bg: "var(--color-danger-bg)", color: "var(--color-danger)" },
  };
  const t = tones[tone] || tones.primary;

  return (
    <div className="card-eco card-eco-hover p-3 h-100">
      <div className="d-flex align-items-start justify-content-between mb-3">
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ width: 44, height: 44, borderRadius: 14, background: t.bg, color: t.color, fontSize: "1.15rem" }}
        >
          <i className={`bi ${icon}`} />
        </div>
      </div>
      <div className="fw-bold" style={{ fontSize: "1.6rem", lineHeight: 1.1 }}>
        {value}
        {suffix && <span className="fs-6 text-muted-eco fw-semibold ms-1">{suffix}</span>}
      </div>
      <div className="text-muted-eco small mt-1">{label}</div>
    </div>
  );
}

const REQUEST_STATUS_MAP = {
  PENDING: { cls: "badge-warning-eco", icon: "bi-hourglass-split" },
  ASSIGNED: { cls: "badge-info-eco", icon: "bi-person-check" },
  COLLECTED: { cls: "badge-primary-eco", icon: "bi-box-seam" },
  COMPLETED: { cls: "badge-success-eco", icon: "bi-check-circle" },
  CANCELLED: { cls: "badge-danger-eco", icon: "bi-x-circle" },
};

const INVENTORY_STATUS_MAP = {
  AVAILABLE: { cls: "badge-info-eco", icon: "bi-box" },
  COLLECTED: { cls: "badge-primary-eco", icon: "bi-box-seam" },
  PROCESSED: { cls: "badge-warning-eco", icon: "bi-gear" },
  RECYCLED: { cls: "badge-success-eco", icon: "bi-recycle" },
};

export default function StatusBadge({ status, type = "request" }) {
  const map = type === "inventory" ? INVENTORY_STATUS_MAP : REQUEST_STATUS_MAP;
  const meta = map[status] || { cls: "badge-neutral-eco", icon: "bi-question-circle" };

  return (
    <span className={`badge-eco badge-solid ${meta.cls}`}>
      <i className={`bi ${meta.icon}`} />
      {status || "UNKNOWN"}
    </span>
  );
}

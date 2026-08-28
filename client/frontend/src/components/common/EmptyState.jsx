export default function EmptyState({
  icon = "bi-inbox",
  title = "Nothing here yet",
  message = "There's no data to display right now.",
  action = null,
}) {
  return (
    <div className="empty-state-eco">
      <div className="empty-icon">
        <i className={`bi ${icon}`} />
      </div>
      <h6 className="mb-1 fw-bold">{title}</h6>
      <p className="small mb-3">{message}</p>
      {action}
    </div>
  );
}

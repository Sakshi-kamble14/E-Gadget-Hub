import { useToast } from "../../hooks/useToast";

const ICONS = {
  success: "bi-check-circle-fill",
  error: "bi-exclamation-circle-fill",
  info: "bi-info-circle-fill",
  warning: "bi-exclamation-triangle-fill",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack-eco">
      {toasts.map((t) => (
        <div key={t.id} className={`toast-eco ${t.type}`} role="alert">
          <i className={`bi ${ICONS[t.type] || ICONS.success} mt-1`} />
          <div className="flex-grow-1 small fw-semibold">{t.message}</div>
          <button
            className="btn-icon-eco"
            style={{ width: 26, height: 26, border: "none" }}
            onClick={() => removeToast(t.id)}
            aria-label="Dismiss notification"
          >
            <i className="bi bi-x" />
          </button>
        </div>
      ))}
    </div>
  );
}

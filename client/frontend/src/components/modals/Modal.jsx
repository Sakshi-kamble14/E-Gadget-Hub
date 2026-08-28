import { useEffect } from "react";
import { createPortal } from "react-dom";

export default function Modal({ open, onClose, title, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  const widths = { sm: 400, md: 520, lg: 720 };

  return createPortal(
    <div
      className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center p-3"
      style={{ background: "rgba(15, 30, 22, 0.45)", zIndex: 2050 }}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="card-eco w-100 bg-white"
        style={{ maxWidth: widths[size] || widths.md, maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className="d-flex align-items-center justify-content-between p-3 border-bottom">
          <h5 className="mb-0">{title}</h5>
          <button
            type="button"
            className="btn-icon-eco"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
        <div className="p-3" style={{ overflowY: "auto" }}>
          {children}
        </div>
        {footer && <div className="p-3 border-top d-flex justify-content-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  );
}

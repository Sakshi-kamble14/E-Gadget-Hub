export default function PageHeader({ title, subtitle, breadcrumbs = [], actions = null }) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        {breadcrumbs.length > 0 && (
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-1 small">
              {breadcrumbs.map((b, i) => (
                <li
                  key={i}
                  className={`breadcrumb-item ${i === breadcrumbs.length - 1 ? "active text-muted-eco" : ""}`}
                  aria-current={i === breadcrumbs.length - 1 ? "page" : undefined}
                >
                  {b}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <h3 className="mb-1">{title}</h3>
        {subtitle && <p className="text-muted-eco mb-0">{subtitle}</p>}
      </div>
      {actions && <div className="d-flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

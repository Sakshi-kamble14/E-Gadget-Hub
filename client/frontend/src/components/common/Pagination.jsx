export default function Pagination({ page, totalPages, onChange, totalItems, pageSize }) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pages = [];
  const maxButtons = 5;
  let from = Math.max(1, page - Math.floor(maxButtons / 2));
  let to = Math.min(totalPages, from + maxButtons - 1);
  from = Math.max(1, to - maxButtons + 1);
  for (let i = from; i <= to; i++) pages.push(i);

  return (
    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mt-3">
      <span className="small text-muted-eco">
        Showing {start}–{end} of {totalItems}
      </span>
      <div className="d-flex gap-1">
        <button
          className="btn-icon-eco"
          disabled={page === 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          <i className="bi bi-chevron-left" />
        </button>
        {from > 1 && <span className="px-2 align-self-center text-faint-eco">…</span>}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className="btn-icon-eco"
            style={
              p === page
                ? { background: "var(--color-primary)", color: "#fff", borderColor: "var(--color-primary)" }
                : undefined
            }
            aria-current={p === page ? "page" : undefined}
          >
            {p}
          </button>
        ))}
        {to < totalPages && <span className="px-2 align-self-center text-faint-eco">…</span>}
        <button
          className="btn-icon-eco"
          disabled={page === totalPages}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          <i className="bi bi-chevron-right" />
        </button>
      </div>
    </div>
  );
}

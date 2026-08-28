export function SkeletonRows({ rows = 5, cols = 5 }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r}>
          {Array.from({ length: cols }).map((__, c) => (
            <td key={c}>
              <div className="skeleton-eco" style={{ height: 14, width: c === 0 ? "60%" : "85%" }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function SkeletonCards({ count = 4 }) {
  return (
    <div className="row g-3">
      {Array.from({ length: count }).map((_, i) => (
        <div className="col-sm-6 col-lg-3" key={i}>
          <div className="card-eco p-3">
            <div className="skeleton-eco mb-3" style={{ height: 40, width: 40, borderRadius: 12 }} />
            <div className="skeleton-eco mb-2" style={{ height: 12, width: "50%" }} />
            <div className="skeleton-eco" style={{ height: 22, width: "35%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default SkeletonRows;

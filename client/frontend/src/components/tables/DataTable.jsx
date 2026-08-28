import { SkeletonRows } from "../loaders/Skeletons";
import EmptyState from "../common/EmptyState";

export default function DataTable({
  columns,
  data = [],
  loading = false,
  skeletonRows = 5,
  emptyTitle = "No records found",
  emptyMessage = "There's nothing to show here yet.",
  emptyIcon = "bi-inbox",
  rowKey = (row) => row.id,
}) {
  const showEmpty = !loading && data.length === 0;

  return (
    <div className="table-responsive-eco">
      <table className="table-eco mb-0">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading && <SkeletonRows rows={skeletonRows} cols={columns.length} />}
          {!loading &&
            data.map((row) => (
              <tr key={rowKey(row)}>
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : row[col.key]}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      {showEmpty && (
        <div className="p-2">
          <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />
        </div>
      )}
    </div>
  );
}

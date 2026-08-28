import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/badges/StatusBadge";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/modals/Modal";
import StatusTimeline from "../../components/common/StatusTimeline";
import { usePagination } from "../../hooks/usePagination";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import requestApi from "../../api/requestApi";
import { formatDate, formatDateTime, extractErrorMessage } from "../../utils/format";

export default function CustomerRequestsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const load = () => {
    setLoading(true);
    requestApi
      .getByCustomer(user.customerID)
      .then((res) => setRequests(res.data.data || []))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load your requests.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.customerID]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return requests;
    return requests.filter(
      (r) =>
        String(r.requestID).includes(q) ||
        r.CollectionPoint?.location?.toLowerCase().includes(q) ||
        r.Collector?.collectorName?.toLowerCase().includes(q) ||
        r.status?.toLowerCase().includes(q)
    );
  }, [requests, search]);

  const { pageItems, page, totalPages, setPage, totalItems, pageSize } = usePagination(filtered, 8);

  const columns = [
    { key: "requestID", label: "Request ID", render: (r) => `#${r.requestID}` },
    { key: "cp", label: "Collection Point", render: (r) => r.CollectionPoint?.location || "—" },
    { key: "collector", label: "Collector", render: (r) => r.Collector?.collectorName || "Unassigned" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", label: "Created At", render: (r) => formatDate(r.createdAt) },
    {
      key: "action",
      label: "View Details",
      render: (r) => (
        <button className="btn-eco-ghost px-2 py-1" onClick={() => setSelected(r)}>
          Details <i className="bi bi-eye ms-1" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Requests"
        subtitle="Track and manage all your e-waste collection requests."
        actions={
          <Link to="/customer/create-request" className="btn-eco-primary">
            <i className="bi bi-plus-circle me-1" /> New Request
          </Link>
        }
      />

      <div className="card-eco p-3">
        <div className="mb-3" style={{ maxWidth: 340 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by ID, point, status…" />
        </div>
        <DataTable
          columns={columns}
          data={pageItems}
          loading={loading}
          emptyTitle="No requests found"
          emptyMessage="Try adjusting your search, or submit a new request."
          emptyIcon="bi-clipboard-x"
          rowKey={(r) => r.requestID}
        />
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={setPage}
          totalItems={totalItems}
          pageSize={pageSize}
        />
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? `Request #${selected.requestID}` : ""}
        size="md"
      >
        {selected && (
          <div>
            <div className="mb-4">
              <StatusTimeline status={selected.status} />
            </div>
            <div className="row g-3 small">
              <div className="col-6">
                <div className="text-muted-eco">Collection Point</div>
                <div className="fw-semibold">{selected.CollectionPoint?.location || "—"}</div>
              </div>
              <div className="col-6">
                <div className="text-muted-eco">Status</div>
                <StatusBadge status={selected.status} />
              </div>
              <div className="col-6">
                <div className="text-muted-eco">Collector</div>
                <div className="fw-semibold">{selected.Collector?.collectorName || "Not yet assigned"}</div>
              </div>
              <div className="col-6">
                <div className="text-muted-eco">Collector Email</div>
                <div className="fw-semibold">{selected.Collector?.email || "—"}</div>
              </div>
              <div className="col-6">
                <div className="text-muted-eco">Created</div>
                <div className="fw-semibold">{formatDateTime(selected.createdAt)}</div>
              </div>
              <div className="col-6">
                <div className="text-muted-eco">Last Updated</div>
                <div className="fw-semibold">{formatDateTime(selected.updatedAt)}</div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

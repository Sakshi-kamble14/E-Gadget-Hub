import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import SelectInput from "../../components/forms/SelectInput";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/badges/StatusBadge";
import Pagination from "../../components/common/Pagination";
import StatusUpdateModal from "../../components/modals/StatusUpdateModal";
import { usePagination } from "../../hooks/usePagination";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import requestApi from "../../api/requestApi";
import { formatDate, extractErrorMessage } from "../../utils/format";

const STATUS_FILTERS = ["", "PENDING", "ASSIGNED", "COLLECTED", "COMPLETED", "CANCELLED"];

export default function CollectorRequestsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [editing, setEditing] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = () => {
    setLoading(true);
    requestApi
      .getByCollector(user.collectorID)
      .then((res) => setRequests(res.data.data || []))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load your requests.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.collectorID]);

  const filtered = useMemo(() => {
    let list = requests;
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          String(r.requestID).includes(q) ||
          r.Customer?.customerName?.toLowerCase().includes(q) ||
          r.CollectionPoint?.location?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, search, statusFilter]);

  const { pageItems, page, totalPages, setPage, totalItems, pageSize } = usePagination(filtered, 8);

  const handleUpdate = async (newStatus) => {
    if (!editing) return;
    setUpdating(true);
    try {
      await requestApi.updateStatus(editing.requestID, newStatus);
      toast.success(`Request #${editing.requestID} updated to ${newStatus}.`);
      setEditing(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not update request status."));
    } finally {
      setUpdating(false);
    }
  };

  const columns = [
    { key: "requestID", label: "Request ID", render: (r) => `#${r.requestID}` },
    { key: "customer", label: "Customer", render: (r) => r.Customer?.customerName || "—" },
    { key: "phone", label: "Phone", render: (r) => r.Customer?.phoneNo || "—" },
    { key: "address", label: "Address", render: (r) => r.Customer?.address || "—" },
    { key: "cp", label: "Collection Point", render: (r) => r.CollectionPoint?.location || "—" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
    {
      key: "action",
      label: "Action",
      render: (r) => (
        <button className="btn-eco-outline px-3 py-1" onClick={() => setEditing(r)}>
          Update Status
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Assigned Requests" subtitle="Update the status of requests assigned to you." />

      <div className="card-eco p-3">
        <div className="row g-2 mb-3">
          <div className="col-sm-6 col-md-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by ID, customer, point…" />
          </div>
          <div className="col-sm-6 col-md-3">
            <select
              className="form-select form-select-eco"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              {STATUS_FILTERS.map((s) => (
                <option key={s} value={s}>
                  {s || "All statuses"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={pageItems}
          loading={loading}
          emptyTitle="No requests found"
          emptyMessage="Try a different filter or search term."
          emptyIcon="bi-clipboard-x"
          rowKey={(r) => r.requestID}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={totalItems} pageSize={pageSize} />
      </div>

      <StatusUpdateModal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        request={editing}
        onConfirm={handleUpdate}
        loading={updating}
      />
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/badges/StatusBadge";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/modals/Modal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import StatusUpdateModal from "../../components/modals/StatusUpdateModal";
import SelectInput from "../../components/forms/SelectInput";
import { usePagination } from "../../hooks/usePagination";
import { useToast } from "../../hooks/useToast";
import adminApi from "../../api/adminApi";
import requestApi from "../../api/requestApi";
import { formatDate, extractErrorMessage } from "../../utils/format";

const STATUS_FILTERS = ["", "PENDING", "ASSIGNED", "COLLECTED", "COMPLETED", "CANCELLED"];

export default function AdminRequestsPage() {
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [assigning, setAssigning] = useState(null);
  const [selectedCollector, setSelectedCollector] = useState("");
  const [assignSaving, setAssignSaving] = useState(false);

  const [statusEditing, setStatusEditing] = useState(null);
  const [statusSaving, setStatusSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .getRequests()
      .then((res) => setRequests(res.data.data || []))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load requests.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    adminApi.getCollectors().then((res) => setCollectors(res.data.data || [])).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = requests;
    if (statusFilter) list = list.filter((r) => r.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (r) =>
          String(r.requestID).includes(q) ||
          r.Customer?.customerName?.toLowerCase().includes(q) ||
          r.Collector?.collectorName?.toLowerCase().includes(q) ||
          r.CollectionPoint?.location?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [requests, search, statusFilter]);

  const { pageItems, page, totalPages, setPage, totalItems, pageSize } = usePagination(filtered, 8);

  const openAssign = (request) => {
    setAssigning(request);
    setSelectedCollector(request.collectorID || request.Collector?.collectorID || "");
  };

  const handleAssign = async () => {
    if (!assigning || !selectedCollector) return;
    setAssignSaving(true);
    try {
      await requestApi.assignCollector(assigning.requestID, selectedCollector);
      toast.success(`Collector assigned to Request #${assigning.requestID}.`);
      setAssigning(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not assign collector."));
    } finally {
      setAssignSaving(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!statusEditing) return;
    setStatusSaving(true);
    try {
      await requestApi.updateStatus(statusEditing.requestID, newStatus);
      toast.success(`Request #${statusEditing.requestID} updated to ${newStatus}.`);
      setStatusEditing(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not update request status."));
    } finally {
      setStatusSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await requestApi.delete(deleting.requestID);
      toast.success(`Request #${deleting.requestID} deleted.`);
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not delete request."));
    } finally {
      setDeletingLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "Request ID", render: (r) => `#${r.requestID}` },
    { key: "customer", label: "Customer", render: (r) => r.Customer?.customerName || "—" },
    { key: "phone", label: "Customer Phone", render: (r) => r.Customer?.phoneNo || "—" },
    { key: "cp", label: "Collection Point", render: (r) => r.CollectionPoint?.location || "—" },
    { key: "collector", label: "Collector", render: (r) => r.Collector?.collectorName || "Unassigned" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
    {
      key: "actions",
      label: "Actions",
      render: (r) => (
        <div className="d-flex gap-2">
          <button className="btn-icon-eco" onClick={() => openAssign(r)} aria-label="Assign collector" title="Assign collector">
            <i className="bi bi-person-plus" />
          </button>
          <button className="btn-icon-eco" onClick={() => setStatusEditing(r)} aria-label="Update status" title="Update status">
            <i className="bi bi-arrow-repeat" />
          </button>
          <button className="btn-icon-eco" onClick={() => setDeleting(r)} aria-label="Delete request" title="Delete">
            <i className="bi bi-trash text-danger" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="E-Waste Requests" subtitle="Assign collectors, update statuses, and manage all requests." />

      <div className="card-eco p-3">
        <div className="row g-2 mb-3">
          <div className="col-sm-6 col-md-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by ID, customer, collector…" />
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

      <Modal
        open={Boolean(assigning)}
        onClose={() => setAssigning(null)}
        title={assigning ? `Assign Collector — Request #${assigning.requestID}` : ""}
        size="sm"
        footer={
          <>
            <button className="btn-eco-ghost" onClick={() => setAssigning(null)} disabled={assignSaving}>
              Cancel
            </button>
            <button className="btn-eco-primary" onClick={handleAssign} disabled={assignSaving || !selectedCollector}>
              {assignSaving ? "Assigning…" : "Assign Collector"}
            </button>
          </>
        }
      >
        <SelectInput
          label="Available Collectors"
          id="assignCollector"
          value={selectedCollector}
          onChange={(e) => setSelectedCollector(e.target.value)}
          options={collectors.map((c) => ({ value: c.collectorID, label: `${c.collectorName} (${c.email})` }))}
          placeholder="Select a collector"
        />
        <p className="text-muted-eco small mb-0">Assigning a collector automatically sets the status to ASSIGNED.</p>
      </Modal>

      <StatusUpdateModal
        open={Boolean(statusEditing)}
        onClose={() => setStatusEditing(null)}
        request={statusEditing}
        onConfirm={handleStatusUpdate}
        loading={statusSaving}
      />

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete this request?"
        message={`This will permanently delete Request #${deleting?.requestID} and cannot be undone.`}
        confirmLabel="Delete Request"
        danger
        loading={deletingLoading}
      />
    </div>
  );
}

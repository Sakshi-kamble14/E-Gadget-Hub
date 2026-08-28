import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/badges/StatusBadge";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/modals/Modal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import FormInput from "../../components/forms/FormInput";
import SelectInput from "../../components/forms/SelectInput";
import { usePagination } from "../../hooks/usePagination";
import { useToast } from "../../hooks/useToast";
import adminApi from "../../api/adminApi";
import inventoryApi from "../../api/inventoryApi";
import collectionPointApi from "../../api/collectionPointApi";
import { formatDate, extractErrorMessage } from "../../utils/format";
import { isNonEmpty } from "../../utils/validators";

const STATUS_OPTIONS = ["AVAILABLE", "COLLECTED", "PROCESSED", "RECYCLED"];
const STATUS_FILTERS = ["", ...STATUS_OPTIONS];
const emptyForm = { ewasteType: "", quantity: "1", status: "AVAILABLE", collectionPointID: "" };

export default function AdminInventoryPage() {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .getInventory()
      .then((res) => setItems(res.data.data || []))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load inventory.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    collectionPointApi.getAll().then((res) => setPoints(res.data.data || [])).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (statusFilter) list = list.filter((i) => i.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (i) =>
          i.ewasteType?.toLowerCase().includes(q) ||
          i.Collector?.collectorName?.toLowerCase().includes(q) ||
          i.CollectionPoint?.location?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [items, search, statusFilter]);

  const { pageItems, page, totalPages, setPage, totalItems, pageSize } = usePagination(filtered, 8);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      ewasteType: item.ewasteType || "",
      quantity: String(item.quantity ?? "1"),
      status: item.status || "AVAILABLE",
      collectionPointID: item.collectionPointID || item.CollectionPoint?.collectionPointID || "",
    });
    setErrors({});
    setModalOpen(true);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const next = {};
    if (!isNonEmpty(form.ewasteType)) next.ewasteType = "E-waste type is required.";
    if (!form.quantity || Number(form.quantity) <= 0) next.quantity = "Quantity must be greater than 0.";
    if (!form.collectionPointID) next.collectionPointID = "Collection point is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        ewasteType: form.ewasteType,
        quantity: Number(form.quantity),
        status: form.status,
        collectionPointID: Number(form.collectionPointID),
      };
      if (editing) {
        await inventoryApi.update(editing.inventoryID, payload);
        toast.success("Inventory item updated.");
      } else {
        await inventoryApi.create(payload);
        toast.success("Inventory item added.");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not save inventory item."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await inventoryApi.delete(deleting.inventoryID);
      toast.success("Inventory item deleted.");
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not delete inventory item."));
    } finally {
      setDeletingLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "Inventory ID", render: (i) => `#${i.inventoryID}` },
    { key: "type", label: "E-Waste Type", render: (i) => i.ewasteType },
    { key: "qty", label: "Quantity", render: (i) => i.quantity },
    { key: "status", label: "Status", render: (i) => <StatusBadge status={i.status} type="inventory" /> },
    { key: "collector", label: "Collector", render: (i) => i.Collector?.collectorName || "—" },
    { key: "cp", label: "Collection Point", render: (i) => i.CollectionPoint?.location || "—" },
    { key: "createdAt", label: "Created", render: (i) => formatDate(i.createdAt) },
    {
      key: "actions",
      label: "Actions",
      render: (i) => (
        <div className="d-flex gap-2">
          <button className="btn-icon-eco" onClick={() => openEdit(i)} aria-label="Edit">
            <i className="bi bi-pencil" />
          </button>
          <button className="btn-icon-eco" onClick={() => setDeleting(i)} aria-label="Delete">
            <i className="bi bi-trash text-danger" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Inventory"
        subtitle="Manage all e-waste inventory across collection points."
        actions={
          <button className="btn-eco-primary" onClick={openCreate}>
            <i className="bi bi-plus-circle me-1" /> Add Inventory
          </button>
        }
      />

      <div className="card-eco p-3">
        <div className="row g-2 mb-3">
          <div className="col-sm-6 col-md-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by type, collector, point…" />
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
          emptyTitle="No inventory items"
          emptyMessage="Add an inventory item to get started."
          emptyIcon="bi-box-seam"
          rowKey={(i) => i.inventoryID}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={totalItems} pageSize={pageSize} />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? `Edit Inventory #${editing.inventoryID}` : "Add Inventory Item"}
        size="sm"
        footer={
          <>
            <button className="btn-eco-ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn-eco-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save Changes" : "Add Item"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} noValidate>
          <FormInput
            label="E-Waste Type"
            id="ewasteType"
            value={form.ewasteType}
            onChange={set("ewasteType")}
            error={errors.ewasteType}
            placeholder="e.g. Laptops, Batteries, Monitors"
            required
          />
          <FormInput
            label="Quantity"
            id="quantity"
            type="number"
            min="1"
            value={form.quantity}
            onChange={set("quantity")}
            error={errors.quantity}
            required
          />
          <SelectInput
            label="Status"
            id="status"
            value={form.status}
            onChange={set("status")}
            options={STATUS_OPTIONS.map((s) => ({ value: s, label: s }))}
            required
          />
          <SelectInput
            label="Collection Point"
            id="collectionPointID"
            value={form.collectionPointID}
            onChange={set("collectionPointID")}
            error={errors.collectionPointID}
            options={points.map((p) => ({ value: p.collectionPointID, label: p.location }))}
            required
          />
        </form>
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete inventory item?"
        message={`This will permanently delete this inventory record and cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deletingLoading}
      />
    </div>
  );
}

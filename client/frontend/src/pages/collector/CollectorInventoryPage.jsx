import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/badges/StatusBadge";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/modals/Modal";
import FormInput from "../../components/forms/FormInput";
import SelectInput from "../../components/forms/SelectInput";
import { usePagination } from "../../hooks/usePagination";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import inventoryApi from "../../api/inventoryApi";
import collectionPointApi from "../../api/collectionPointApi";
import { formatDate, extractErrorMessage } from "../../utils/format";
import { isNonEmpty } from "../../utils/validators";

const STATUS_OPTIONS = ["AVAILABLE", "COLLECTED", "PROCESSED", "RECYCLED"];
const STATUS_FILTERS = ["", ...STATUS_OPTIONS];

const emptyForm = { ewasteType: "", quantity: "1", status: "COLLECTED", collectionPointID: "" };

export default function CollectorInventoryPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortDesc, setSortDesc] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    inventoryApi
      .getByCollector(user.collectorID)
      .then((res) => setItems(res.data.data || []))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load your inventory.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    collectionPointApi.getAll().then((res) => setPoints(res.data.data || [])).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.collectorID]);

  const filtered = useMemo(() => {
    let list = items;
    if (statusFilter) list = list.filter((i) => i.status === statusFilter);
    const q = search.trim().toLowerCase();
    if (q) list = list.filter((i) => i.ewasteType?.toLowerCase().includes(q));
    list = [...list].sort((a, b) =>
      sortDesc ? b.inventoryID - a.inventoryID : a.inventoryID - b.inventoryID
    );
    return list;
  }, [items, search, statusFilter, sortDesc]);

  const { pageItems, page, totalPages, setPage, totalItems, pageSize } = usePagination(filtered, 8);

  const openCreate = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setForm({
      ewasteType: item.ewasteType || "",
      quantity: String(item.quantity ?? "1"),
      status: item.status || "COLLECTED",
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
      if (editingItem) {
        await inventoryApi.update(editingItem.inventoryID, payload);
        toast.success("Inventory item updated.");
      } else {
        await inventoryApi.create({ ...payload, collectorID: user.collectorID });
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

  const columns = [
    { key: "id", label: "ID", render: (i) => `#${i.inventoryID}` },
    { key: "type", label: "E-Waste Type", render: (i) => i.ewasteType },
    { key: "qty", label: "Quantity", render: (i) => i.quantity },
    { key: "status", label: "Status", render: (i) => <StatusBadge status={i.status} type="inventory" /> },
    { key: "cp", label: "Collection Point", render: (i) => i.CollectionPoint?.location || "—" },
    { key: "createdAt", label: "Created", render: (i) => formatDate(i.createdAt) },
    {
      key: "action",
      label: "Action",
      render: (i) => (
        <button className="btn-eco-outline px-3 py-1" onClick={() => openEdit(i)}>
          Edit
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="My Inventory"
        subtitle="Track e-waste items you've collected and their processing status."
        actions={
          <button className="btn-eco-primary" onClick={openCreate}>
            <i className="bi bi-plus-circle me-1" /> Add Inventory
          </button>
        }
      />

      <div className="card-eco p-3">
        <div className="row g-2 mb-3 align-items-center">
          <div className="col-sm-6 col-md-4">
            <SearchBar value={search} onChange={setSearch} placeholder="Search by e-waste type…" />
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
          <div className="col-sm-6 col-md-3">
            <button className="btn-eco-outline w-100" onClick={() => setSortDesc((s) => !s)}>
              <i className={`bi bi-sort-${sortDesc ? "down" : "up"} me-1`} />
              {sortDesc ? "Newest first" : "Oldest first"}
            </button>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={pageItems}
          loading={loading}
          emptyTitle="No inventory items"
          emptyMessage="Add your first inventory item to start tracking collected e-waste."
          emptyIcon="bi-box-seam"
          rowKey={(i) => i.inventoryID}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={totalItems} pageSize={pageSize} />
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingItem ? `Edit Inventory #${editingItem.inventoryID}` : "Add Inventory Item"}
        size="sm"
        footer={
          <>
            <button className="btn-eco-ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn-eco-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editingItem ? "Save Changes" : "Add Item"}
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
    </div>
  );
}

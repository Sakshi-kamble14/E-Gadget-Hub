import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonCards } from "../../components/loaders/Skeletons";
import Modal from "../../components/modals/Modal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import FormInput from "../../components/forms/FormInput";
import { useToast } from "../../hooks/useToast";
import collectionPointApi from "../../api/collectionPointApi";
import { isNonEmpty } from "../../utils/validators";
import { extractErrorMessage } from "../../utils/format";

const emptyForm = { location: "", capacity: "1000" };

export default function AdminCollectionPointsPage() {
  const toast = useToast();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const load = () => {
    setLoading(true);
    collectionPointApi
      .getAll()
      .then((res) => setPoints(res.data.data || []))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load collection points.")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return points;
    return points.filter((p) => p.location?.toLowerCase().includes(q));
  }, [points, search]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (point) => {
    setEditing(point);
    setForm({ location: point.location || "", capacity: String(point.capacity ?? "0") });
    setErrors({});
    setModalOpen(true);
  };

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const next = {};
    if (!isNonEmpty(form.location)) next.location = "Location is required.";
    if (form.capacity === "" || Number(form.capacity) < 0) next.capacity = "Capacity must be 0 or greater.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = { location: form.location, capacity: Number(form.capacity) };
      if (editing) {
        await collectionPointApi.update(editing.collectionPointID, payload);
        toast.success("Collection point updated successfully.");
      } else {
        await collectionPointApi.create(payload);
        toast.success("Collection point created successfully.");
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not save collection point."));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await collectionPointApi.delete(deleting.collectionPointID);
      toast.success("Collection point deleted successfully.");
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not delete collection point."));
    } finally {
      setDeletingLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Collection Points"
        subtitle="Manage collection points available to customers and collectors."
        actions={
          <button className="btn-eco-primary" onClick={openCreate}>
            <i className="bi bi-plus-circle me-1" /> Add Collection Point
          </button>
        }
      />

      <div className="mb-3" style={{ maxWidth: 340 }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by location…" />
      </div>

      {loading ? (
        <SkeletonCards count={6} />
      ) : filtered.length === 0 ? (
        <div className="card-eco">
          <EmptyState
            icon="bi-geo-alt"
            title="No collection points found"
            message="Add a collection point to get started."
          />
        </div>
      ) : (
        <div className="row g-3">
          {filtered.map((p) => (
            <div className="col-sm-6 col-lg-4" key={p.collectionPointID}>
              <div className="card-eco card-eco-hover p-4 h-100">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className="feature-icon-eco">
                    <i className="bi bi-geo-alt" />
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn-icon-eco" onClick={() => openEdit(p)} aria-label="Edit">
                      <i className="bi bi-pencil" />
                    </button>
                    <button className="btn-icon-eco" onClick={() => setDeleting(p)} aria-label="Delete">
                      <i className="bi bi-trash text-danger" />
                    </button>
                  </div>
                </div>
                <h6 className="mb-1">{p.location}</h6>
                <p className="text-muted-eco small mb-2">Collection Point #{p.collectionPointID}</p>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-2">
                  <span className="small text-muted-eco">Capacity</span>
                  <span className="fw-semibold small">{p.capacity}</span>
                </div>
                {Array.isArray(p.Collectors) && (
                  <div className="d-flex justify-content-between align-items-center pt-2">
                    <span className="small text-muted-eco">Collectors Assigned</span>
                    <span className="fw-semibold small">{p.Collectors.length}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Collection Point" : "Add Collection Point"}
        size="sm"
        footer={
          <>
            <button className="btn-eco-ghost" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn-eco-primary" onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : editing ? "Save Changes" : "Create"}
            </button>
          </>
        }
      >
        <form onSubmit={handleSave} noValidate>
          <FormInput
            label="Location"
            id="location"
            icon="bi-geo-alt"
            value={form.location}
            onChange={set("location")}
            error={errors.location}
            placeholder="e.g. Downtown Recycling Hub"
            required
          />
          <FormInput
            label="Capacity"
            id="capacity"
            type="number"
            min="0"
            value={form.capacity}
            onChange={set("capacity")}
            error={errors.capacity}
            required
          />
        </form>
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete collection point?"
        message={`This will permanently delete "${deleting?.location}" and cannot be undone.`}
        confirmLabel="Delete"
        danger
        loading={deletingLoading}
      />
    </div>
  );
}

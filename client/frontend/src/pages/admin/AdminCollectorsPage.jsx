import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/tables/DataTable";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/modals/Modal";
import SelectInput from "../../components/forms/SelectInput";
import { usePagination } from "../../hooks/usePagination";
import { useToast } from "../../hooks/useToast";
import adminApi from "../../api/adminApi";
import collectorApi from "../../api/collectorApi";
import collectionPointApi from "../../api/collectionPointApi";
import { formatDate, initials, extractErrorMessage } from "../../utils/format";

export default function AdminCollectorsPage() {
  const toast = useToast();
  const [collectors, setCollectors] = useState([]);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [assigning, setAssigning] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState("");
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .getCollectors()
      .then((res) => setCollectors(res.data.data || []))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load collectors.")))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    collectionPointApi.getAll().then((res) => setPoints(res.data.data || [])).catch(() => {});
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return collectors;
    return collectors.filter(
      (c) => c.collectorName?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q)
    );
  }, [collectors, search]);

  const { pageItems, page, totalPages, setPage, totalItems, pageSize } = usePagination(filtered, 8);

  const openAssign = (collector) => {
    setAssigning(collector);
    setSelectedPoint(collector.collectionPointID || collector.CollectionPoint?.collectionPointID || "");
  };

  const handleAssign = async () => {
    if (!assigning || !selectedPoint) return;
    setSaving(true);
    try {
      await collectorApi.updateCollectionPoint(assigning.collectorID, selectedPoint);
      toast.success("Collection point assigned successfully.");
      setAssigning(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not assign collection point."));
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: "id", label: "Collector ID", render: (c) => `#${c.collectorID}` },
    {
      key: "name",
      label: "Name",
      render: (c) => (
        <div className="d-flex align-items-center gap-2">
          <div className="avatar-eco" style={{ width: 30, height: 30, fontSize: "0.7rem" }}>
            {initials(c.collectorName)}
          </div>
          {c.collectorName}
        </div>
      ),
    },
    { key: "email", label: "Email", render: (c) => c.email },
    {
      key: "cp",
      label: "Collection Point",
      render: (c) =>
        c.CollectionPoint?.location ? (
          <span className="badge-eco badge-info-eco">{c.CollectionPoint.location}</span>
        ) : (
          <span className="badge-eco badge-neutral-eco">Unassigned</span>
        ),
    },
    { key: "createdAt", label: "Created", render: (c) => formatDate(c.createdAt) },
    {
      key: "actions",
      label: "Actions",
      render: (c) => (
        <button className="btn-eco-outline px-3 py-1" onClick={() => openAssign(c)}>
          <i className="bi bi-geo-alt me-1" /> Assign
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Collectors" subtitle="View collectors and assign them to collection points." />

      <div className="card-eco p-3">
        <div className="mb-3" style={{ maxWidth: 340 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email…" />
        </div>
        <DataTable
          columns={columns}
          data={pageItems}
          loading={loading}
          emptyTitle="No collectors found"
          emptyMessage="Try a different search term."
          emptyIcon="bi-truck"
          rowKey={(c) => c.collectorID}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={totalItems} pageSize={pageSize} />
      </div>

      <Modal
        open={Boolean(assigning)}
        onClose={() => setAssigning(null)}
        title={assigning ? `Assign Collection Point — ${assigning.collectorName}` : ""}
        size="sm"
        footer={
          <>
            <button className="btn-eco-ghost" onClick={() => setAssigning(null)} disabled={saving}>
              Cancel
            </button>
            <button className="btn-eco-primary" onClick={handleAssign} disabled={saving || !selectedPoint}>
              {saving ? "Saving…" : "Assign"}
            </button>
          </>
        }
      >
        <SelectInput
          label="Collection Point"
          id="assignPoint"
          value={selectedPoint}
          onChange={(e) => setSelectedPoint(e.target.value)}
          options={points.map((p) => ({ value: p.collectionPointID, label: `${p.location} (capacity ${p.capacity})` }))}
          placeholder="Select a collection point"
        />
      </Modal>
    </div>
  );
}

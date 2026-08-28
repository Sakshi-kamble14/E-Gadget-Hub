import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import EmptyState from "../../components/common/EmptyState";
import { SkeletonCards } from "../../components/loaders/Skeletons";
import { useToast } from "../../hooks/useToast";
import collectionPointApi from "../../api/collectionPointApi";
import { extractErrorMessage } from "../../utils/format";

export default function CustomerCollectionPointsPage() {
  const toast = useToast();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    collectionPointApi
      .getAll()
      .then((res) => setPoints(res.data.data || []))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load collection points.")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return points;
    return points.filter((p) => p.location?.toLowerCase().includes(q));
  }, [points, search]);

  return (
    <div>
      <PageHeader title="Collection Points" subtitle="Browse active e-waste collection points near you." />

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
            message="Try a different search term, or check back later."
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
                  <span className="badge-eco badge-success-eco">
                    <i className="bi bi-check-circle" /> Active
                  </span>
                </div>
                <h6 className="mb-1">{p.location}</h6>
                <p className="text-muted-eco small mb-2">Collection Point #{p.collectionPointID}</p>
                <div className="d-flex justify-content-between align-items-center pt-2 border-top mt-2">
                  <span className="small text-muted-eco">Capacity</span>
                  <span className="fw-semibold small">{p.capacity}</span>
                </div>
                {Array.isArray(p.Collectors) && (
                  <div className="d-flex justify-content-between align-items-center pt-2">
                    <span className="small text-muted-eco">Collectors</span>
                    <span className="fw-semibold small">{p.Collectors.length}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

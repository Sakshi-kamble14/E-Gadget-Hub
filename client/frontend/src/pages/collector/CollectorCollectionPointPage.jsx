import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import EmptyState from "../../components/common/EmptyState";
import LoadingSpinner from "../../components/loaders/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import collectorApi from "../../api/collectorApi";
import { extractErrorMessage } from "../../utils/format";

export default function CollectorCollectionPointPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [collector, setCollector] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    collectorApi
      .getById(user.collectorID)
      .then((res) => setCollector(res.data.data))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load your collection point.")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.collectorID]);

  const point = collector?.CollectionPoint;

  return (
    <div>
      <PageHeader title="Collection Point" subtitle="The collection point currently assigned to you." />

      {loading ? (
        <LoadingSpinner label="Loading…" fullHeight />
      ) : !point ? (
        <div className="card-eco">
          <EmptyState
            icon="bi-geo-alt"
            title="No collection point assigned"
            message="An admin hasn't assigned you to a collection point yet. Check back later."
          />
        </div>
      ) : (
        <div className="card-eco p-4" style={{ maxWidth: 480 }}>
          <div className="feature-icon-eco mb-3">
            <i className="bi bi-geo-alt" />
          </div>
          <h5 className="mb-1">{point.location}</h5>
          <p className="text-muted-eco small mb-3">Collection Point #{point.collectionPointID}</p>
          <div className="d-flex justify-content-between align-items-center py-2 border-top">
            <span className="small text-muted-eco">Capacity</span>
            <span className="fw-semibold">{point.capacity}</span>
          </div>
        </div>
      )}
    </div>
  );
}

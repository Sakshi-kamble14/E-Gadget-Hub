import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import LoadingSpinner from "../../components/loaders/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import collectorApi from "../../api/collectorApi";
import { initials, extractErrorMessage } from "../../utils/format";

export default function CollectorProfilePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [collector, setCollector] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    collectorApi
      .getById(user.collectorID)
      .then((res) => setCollector(res.data.data))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load your profile.")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.collectorID]);

  if (loading) return <LoadingSpinner label="Loading your profile…" fullHeight />;

  const data = collector || user;

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Your collector account details." />

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card-eco p-4 text-center">
            <div className="avatar-eco mx-auto mb-3" style={{ width: 72, height: 72, fontSize: "1.5rem" }}>
              {initials(data.collectorName)}
            </div>
            <h6 className="mb-1">{data.collectorName}</h6>
            <p className="text-muted-eco small mb-0">{data.email}</p>
            <span className="role-chip mt-3 d-inline-block">COLLECTOR</span>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card-eco p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="text-muted-eco small mb-1">Collector Name</div>
                <div className="fw-semibold">{data.collectorName}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted-eco small mb-1">Email</div>
                <div className="fw-semibold">{data.email}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted-eco small mb-1">Assigned Collection Point</div>
                <div className="fw-semibold">{data.CollectionPoint?.location || "Not assigned yet"}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted-eco small mb-1">Collector ID</div>
                <div className="fw-semibold">#{data.collectorID}</div>
              </div>
            </div>
            <hr className="divider-eco" />
            <p className="text-muted-eco small mb-0">
              <i className="bi bi-info-circle me-2" />
              To update your name, email, or collection point assignment, please contact an
              administrator.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

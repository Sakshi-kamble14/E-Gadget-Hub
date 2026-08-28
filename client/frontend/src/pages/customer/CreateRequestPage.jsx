import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import SelectInput from "../../components/forms/SelectInput";
import LoadingSpinner from "../../components/loaders/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import collectionPointApi from "../../api/collectionPointApi";
import requestApi from "../../api/requestApi";
import { extractErrorMessage } from "../../utils/format";

export default function CreateRequestPage() {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [points, setPoints] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(true);
  const [collectionPointID, setCollectionPointID] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    collectionPointApi
      .getAll()
      .then((res) => setPoints(res.data.data || []))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load collection points.")))
      .finally(() => setLoadingPoints(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!collectionPointID) {
      setError("Please select a collection point.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      await requestApi.create({
        collectionPointID: Number(collectionPointID),
        customerID: user.customerID,
      });
      toast.success("Request submitted successfully!");
      navigate("/customer/requests");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not submit your request."));
    } finally {
      setSubmitting(false);
    }
  };

  const selectedPoint = points.find((p) => String(p.collectionPointID) === String(collectionPointID));

  return (
    <div>
      <PageHeader
        title="Submit a New E-Waste Request"
        subtitle="Choose a nearby collection point to schedule your pickup."
        breadcrumbs={["Requests", "New Request"]}
      />

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="card-eco p-4">
            {loadingPoints ? (
              <LoadingSpinner label="Loading collection points…" />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <SelectInput
                  label="Collection Point"
                  id="collectionPointID"
                  value={collectionPointID}
                  onChange={(e) => setCollectionPointID(e.target.value)}
                  error={error}
                  required
                  placeholder="Choose a collection point"
                  options={points.map((p) => ({
                    value: p.collectionPointID,
                    label: `${p.location} — capacity ${p.capacity}`,
                  }))}
                />
                <button
                  type="submit"
                  className="btn-eco-primary w-100 py-2 mt-2"
                  disabled={submitting || points.length === 0}
                >
                  {submitting ? "Submitting…" : "Submit Request"}
                </button>
                {points.length === 0 && (
                  <p className="text-muted-eco small mt-2 mb-0">
                    No collection points are available right now. Please check back later.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <div className="col-lg-5">
          <div className="card-eco p-4 h-100">
            <h6 className="mb-3">
              <i className="bi bi-info-circle me-2" style={{ color: "var(--color-primary)" }} />
              What happens next?
            </h6>
            {selectedPoint ? (
              <div className="mb-3 p-3 rounded-3" style={{ background: "var(--color-primary-light)" }}>
                <div className="fw-semibold">{selectedPoint.location}</div>
                <div className="small text-muted-eco">Capacity: {selectedPoint.capacity}</div>
              </div>
            ) : (
              <p className="text-muted-eco small">Select a collection point to preview it here.</p>
            )}
            <ol className="small text-muted-eco ps-3 mb-0">
              <li className="mb-2">Your request is created with status <strong>PENDING</strong>.</li>
              <li className="mb-2">An admin assigns a verified collector to your request.</li>
              <li className="mb-2">The collector picks up your e-waste and updates the status.</li>
              <li>Once processed, your request is marked <strong>COMPLETED</strong>.</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

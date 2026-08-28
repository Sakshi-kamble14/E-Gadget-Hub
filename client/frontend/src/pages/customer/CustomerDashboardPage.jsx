import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/cards/StatCard";
import DataTable from "../../components/tables/DataTable";
import StatusBadge from "../../components/badges/StatusBadge";
import { SkeletonCards } from "../../components/loaders/Skeletons";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import requestApi from "../../api/requestApi";
import { formatDate, extractErrorMessage } from "../../utils/format";

export default function CustomerDashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    requestApi
      .getByCustomer(user.customerID)
      .then((res) => {
        if (active) setRequests(res.data.data || []);
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load your requests.")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.customerID]);

  const stats = useMemo(() => {
    const total = requests.length;
    const pending = requests.filter((r) => r.status === "PENDING").length;
    const assigned = requests.filter((r) => r.status === "ASSIGNED").length;
    const completed = requests.filter((r) => r.status === "COMPLETED").length;
    return { total, pending, assigned, completed };
  }, [requests]);

  const recent = requests.slice(0, 5);

  const columns = [
    { key: "requestID", label: "Request ID", render: (r) => `#${r.requestID}` },
    { key: "cp", label: "Collection Point", render: (r) => r.CollectionPoint?.location || "—" },
    { key: "collector", label: "Collector", render: (r) => r.Collector?.collectorName || "Unassigned" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    { key: "createdAt", label: "Created", render: (r) => formatDate(r.createdAt) },
    {
      key: "action",
      label: "Action",
      render: (r) => (
        <Link to="/customer/requests" className="btn-eco-ghost px-2 py-1">
          View <i className="bi bi-arrow-right ms-1" />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.customerName?.split(" ")[0] || "there"} 👋`}
        subtitle="Here's an overview of your e-waste requests."
        actions={
          <Link to="/customer/create-request" className="btn-eco-primary">
            <i className="bi bi-plus-circle me-1" /> New Request
          </Link>
        }
      />

      {loading ? (
        <SkeletonCards count={4} />
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Total Requests" value={stats.total} icon="bi-clipboard-data" tone="primary" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Pending" value={stats.pending} icon="bi-hourglass-split" tone="warning" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Assigned" value={stats.assigned} icon="bi-person-check" tone="info" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Completed" value={stats.completed} icon="bi-check-circle" tone="success" />
          </div>
        </div>
      )}

      <div className="card-eco p-3">
        <div className="d-flex justify-content-between align-items-center mb-2 px-1">
          <h5 className="mb-0">Recent Requests</h5>
          <Link to="/customer/requests" className="btn-eco-ghost">
            View all <i className="bi bi-arrow-right ms-1" />
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={recent}
          loading={loading}
          emptyTitle="No requests yet"
          emptyMessage="Submit your first e-waste collection request to get started."
          emptyIcon="bi-clipboard-plus"
          rowKey={(r) => r.requestID}
        />
      </div>
    </div>
  );
}

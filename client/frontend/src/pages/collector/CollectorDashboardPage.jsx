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
import inventoryApi from "../../api/inventoryApi";
import { formatDate, extractErrorMessage } from "../../utils/format";

export default function CollectorDashboardPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    Promise.all([
      requestApi.getByCollector(user.collectorID),
      inventoryApi.getByCollector(user.collectorID),
    ])
      .then(([reqRes, invRes]) => {
        if (!active) return;
        setRequests(reqRes.data.data || []);
        setInventory(invRes.data.data || []);
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load your dashboard data.")))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.collectorID]);

  const stats = useMemo(() => {
    const assigned = requests.filter((r) => r.status === "ASSIGNED").length;
    const pending = requests.filter((r) => r.status === "PENDING").length;
    const collected = requests.filter((r) => r.status === "COLLECTED").length;
    const completed = requests.filter((r) => r.status === "COMPLETED").length;
    return { assigned, pending, collected, completed, inventoryCount: inventory.length };
  }, [requests, inventory]);

  const activeRequests = requests.filter((r) => r.status !== "COMPLETED" && r.status !== "CANCELLED").slice(0, 6);

  const columns = [
    { key: "requestID", label: "Request ID", render: (r) => `#${r.requestID}` },
    { key: "customer", label: "Customer", render: (r) => r.Customer?.customerName || "—" },
    { key: "phone", label: "Phone", render: (r) => r.Customer?.phoneNo || "—" },
    { key: "address", label: "Address", render: (r) => r.Customer?.address || "—" },
    { key: "cp", label: "Collection Point", render: (r) => r.CollectionPoint?.location || "—" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
    {
      key: "action",
      label: "Action",
      render: () => (
        <Link to="/collector/requests" className="btn-eco-ghost px-2 py-1">
          Manage <i className="bi bi-arrow-right ms-1" />
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${user.collectorName?.split(" ")[0] || "there"} 👋`}
        subtitle="Here's what's assigned to you right now."
      />

      {loading ? (
        <SkeletonCards count={5} />
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Assigned" value={stats.assigned} icon="bi-person-check" tone="info" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Pending" value={stats.pending} icon="bi-hourglass-split" tone="warning" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Collected" value={stats.collected} icon="bi-box-seam" tone="primary" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Completed" value={stats.completed} icon="bi-check-circle" tone="success" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Inventory Items" value={stats.inventoryCount} icon="bi-boxes" tone="accent" />
          </div>
        </div>
      )}

      <div className="card-eco p-3">
        <div className="d-flex justify-content-between align-items-center mb-2 px-1">
          <h5 className="mb-0">Assigned Requests</h5>
          <Link to="/collector/requests" className="btn-eco-ghost">
            View all <i className="bi bi-arrow-right ms-1" />
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={activeRequests}
          loading={loading}
          emptyTitle="No active requests"
          emptyMessage="You have no pending or assigned requests right now."
          emptyIcon="bi-clipboard-check"
          rowKey={(r) => r.requestID}
        />
      </div>
    </div>
  );
}

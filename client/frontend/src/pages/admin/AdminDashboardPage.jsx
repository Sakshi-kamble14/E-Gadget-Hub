import { useEffect, useMemo, useState } from "react";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/cards/StatCard";
import { SkeletonCards } from "../../components/loaders/Skeletons";
import { useToast } from "../../hooks/useToast";
import adminApi from "../../api/adminApi";
import { extractErrorMessage } from "../../utils/format";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const STATUS_COLORS = {
  PENDING: "#f5921b",
  ASSIGNED: "#2461a8",
  COLLECTED: "#8b5cf6",
  COMPLETED: "#22c55e",
  CANCELLED: "#f04438",
};

export default function AdminDashboardPage() {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminApi.getDashboard(), adminApi.getRequests()])
      .then(([statsRes, reqRes]) => {
        setStats(statsRes.data.data);
        setRequests(reqRes.data.data || []);
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load dashboard data.")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const statusBreakdown = useMemo(() => {
    const counts = { PENDING: 0, ASSIGNED: 0, COLLECTED: 0, COMPLETED: 0, CANCELLED: 0 };
    requests.forEach((r) => {
      if (counts[r.status] !== undefined) counts[r.status] += 1;
    });
    return counts;
  }, [requests]);

  const doughnutData = {
    labels: Object.keys(statusBreakdown),
    datasets: [
      {
        data: Object.values(statusBreakdown),
        backgroundColor: Object.keys(statusBreakdown).map((k) => STATUS_COLORS[k]),
        borderWidth: 0,
      },
    ],
  };

  const ewasteData = {
    labels: ["Total E-Waste", "Recycled E-Waste"],
    datasets: [
      {
        label: "Quantity",
        data: stats ? [stats.totalEwasteQuantity, stats.recycledEwasteQuantity] : [0, 0],
        backgroundColor: ["#8b5cf6", "#a3e635"],
        borderRadius: 8,
        maxBarThickness: 60,
      },
    ],
  };

  return (
    <div>
      <PageHeader title="Admin Dashboard" subtitle="A real-time overview of your e-waste network." />

      {loading || !stats ? (
        <SkeletonCards count={4} />
      ) : (
        <div className="row g-3 mb-4">
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Total Customers" value={stats.totalCustomers} icon="bi-people" tone="primary" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Total Collectors" value={stats.totalCollectors} icon="bi-truck" tone="accent" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Collection Points" value={stats.totalCollectionPoints} icon="bi-geo-alt" tone="info" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Total Requests" value={stats.totalRequests} icon="bi-clipboard-data" tone="primary" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Pending Requests" value={stats.pendingRequests} icon="bi-hourglass-split" tone="warning" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Completed Requests" value={stats.completedRequests} icon="bi-check-circle" tone="success" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Total E-Waste" value={stats.totalEwasteQuantity} suffix="units" icon="bi-box-seam" tone="primary" />
          </div>
          <div className="col-sm-6 col-lg-3">
            <StatCard label="Recycled E-Waste" value={stats.recycledEwasteQuantity} suffix="units" icon="bi-recycle" tone="success" />
          </div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card-eco p-4 h-100">
            <h6 className="mb-3">Request Status Breakdown</h6>
            {loading ? (
              <SkeletonCards count={1} />
            ) : requests.length === 0 ? (
              <p className="text-muted-eco small mb-0">No requests yet to visualize.</p>
            ) : (
              <div style={{ maxWidth: 320, margin: "0 auto" }}>
                <Doughnut
                  data={doughnutData}
                  options={{ plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 11 } } } } }}
                />
              </div>
            )}
          </div>
        </div>
        <div className="col-lg-6">
          <div className="card-eco p-4 h-100">
            <h6 className="mb-3">E-Waste Overview</h6>
            {loading || !stats ? (
              <SkeletonCards count={1} />
            ) : (
              <Bar
                data={ewasteData}
                options={{
                  plugins: { legend: { display: false } },
                  scales: { y: { beginAtZero: true } },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import SearchBar from "../../components/common/SearchBar";
import DataTable from "../../components/tables/DataTable";
import Pagination from "../../components/common/Pagination";
import Modal from "../../components/modals/Modal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import { usePagination } from "../../hooks/usePagination";
import { useToast } from "../../hooks/useToast";
import adminApi from "../../api/adminApi";
import customerApi from "../../api/customerApi";
import { formatDate, initials, extractErrorMessage } from "../../utils/format";

export default function AdminCustomersPage() {
  const toast = useToast();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [deletingLoading, setDeletingLoading] = useState(false);

  const load = () => {
    setLoading(true);
    adminApi
      .getCustomers()
      .then((res) => setCustomers(res.data.data || []))
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load customers.")))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.customerName?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phoneNo?.toLowerCase().includes(q)
    );
  }, [customers, search]);

  const { pageItems, page, totalPages, setPage, totalItems, pageSize } = usePagination(filtered, 8);

  const handleDelete = async () => {
    if (!deleting) return;
    setDeletingLoading(true);
    try {
      await customerApi.delete(deleting.customerID);
      toast.success("Customer deleted successfully.");
      setDeleting(null);
      load();
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not delete customer."));
    } finally {
      setDeletingLoading(false);
    }
  };

  const columns = [
    { key: "id", label: "Customer ID", render: (c) => `#${c.customerID}` },
    {
      key: "name",
      label: "Name",
      render: (c) => (
        <div className="d-flex align-items-center gap-2">
          <div className="avatar-eco" style={{ width: 30, height: 30, fontSize: "0.7rem" }}>
            {initials(c.customerName)}
          </div>
          {c.customerName}
        </div>
      ),
    },
    { key: "email", label: "Email", render: (c) => c.email },
    { key: "phone", label: "Phone", render: (c) => c.phoneNo },
    { key: "address", label: "Address", render: (c) => c.address },
    { key: "createdAt", label: "Created", render: (c) => formatDate(c.createdAt) },
    {
      key: "actions",
      label: "Actions",
      render: (c) => (
        <div className="d-flex gap-2">
          <button className="btn-icon-eco" onClick={() => setViewing(c)} aria-label="View details">
            <i className="bi bi-eye" />
          </button>
          <button className="btn-icon-eco" onClick={() => setDeleting(c)} aria-label="Delete customer">
            <i className="bi bi-trash text-danger" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Customers" subtitle="View and manage registered customers." />

      <div className="card-eco p-3">
        <div className="mb-3" style={{ maxWidth: 340 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name, email, phone…" />
        </div>
        <DataTable
          columns={columns}
          data={pageItems}
          loading={loading}
          emptyTitle="No customers found"
          emptyMessage="Try a different search term."
          emptyIcon="bi-people"
          rowKey={(c) => c.customerID}
        />
        <Pagination page={page} totalPages={totalPages} onChange={setPage} totalItems={totalItems} pageSize={pageSize} />
      </div>

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Customer Details" size="sm">
        {viewing && (
          <div className="row g-3 small">
            <div className="col-6">
              <div className="text-muted-eco">Customer ID</div>
              <div className="fw-semibold">#{viewing.customerID}</div>
            </div>
            <div className="col-6">
              <div className="text-muted-eco">Name</div>
              <div className="fw-semibold">{viewing.customerName}</div>
            </div>
            <div className="col-6">
              <div className="text-muted-eco">Email</div>
              <div className="fw-semibold">{viewing.email}</div>
            </div>
            <div className="col-6">
              <div className="text-muted-eco">Phone</div>
              <div className="fw-semibold">{viewing.phoneNo}</div>
            </div>
            <div className="col-12">
              <div className="text-muted-eco">Address</div>
              <div className="fw-semibold">{viewing.address}</div>
            </div>
            <div className="col-6">
              <div className="text-muted-eco">Joined</div>
              <div className="fw-semibold">{formatDate(viewing.createdAt)}</div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal
        open={Boolean(deleting)}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete customer?"
        message={`This will permanently delete ${deleting?.customerName || "this customer"} and cannot be undone.`}
        confirmLabel="Delete Customer"
        danger
        loading={deletingLoading}
      />
    </div>
  );
}

import PageHeader from "../../components/common/PageHeader";
import { useAuth } from "../../hooks/useAuth";
import { initials, formatDate } from "../../utils/format";

export default function AdminProfilePage() {
  const { user } = useAuth();

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Your administrator account details." />

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card-eco p-4 text-center">
            <div className="avatar-eco mx-auto mb-3" style={{ width: 72, height: 72, fontSize: "1.5rem" }}>
              {initials(user.adminName)}
            </div>
            <h6 className="mb-1">{user.adminName}</h6>
            <p className="text-muted-eco small mb-0">{user.email}</p>
            <span className="role-chip mt-3 d-inline-block">ADMIN</span>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card-eco p-4">
            <div className="row g-3">
              <div className="col-md-6">
                <div className="text-muted-eco small mb-1">Admin Name</div>
                <div className="fw-semibold">{user.adminName}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted-eco small mb-1">Email</div>
                <div className="fw-semibold">{user.email}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted-eco small mb-1">Admin ID</div>
                <div className="fw-semibold">#{user.adminID}</div>
              </div>
              <div className="col-md-6">
                <div className="text-muted-eco small mb-1">Account Created</div>
                <div className="fw-semibold">{formatDate(user.createdAt)}</div>
              </div>
            </div>
            <hr className="divider-eco" />
            <p className="text-muted-eco small mb-0">
              <i className="bi bi-info-circle me-2" />
              Admin profile editing isn't currently supported by the backend. Contact a system
              owner to make changes to this account.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

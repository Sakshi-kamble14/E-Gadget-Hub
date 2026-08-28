import { useEffect, useState } from "react";
import PageHeader from "../../components/common/PageHeader";
import FormInput from "../../components/forms/FormInput";
import LoadingSpinner from "../../components/loaders/LoadingSpinner";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import customerApi from "../../api/customerApi";
import { isNonEmpty, isValidPhone, minLength } from "../../utils/validators";
import { extractErrorMessage, initials } from "../../utils/format";

export default function CustomerProfilePage() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ customerName: "", email: "", phoneNo: "", address: "", password: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    customerApi
      .getById(user.customerID)
      .then((res) => {
        const c = res.data.data;
        setForm({
          customerName: c.customerName || "",
          email: c.email || "",
          phoneNo: c.phoneNo || "",
          address: c.address || "",
          password: "",
        });
      })
      .catch((err) => toast.error(extractErrorMessage(err, "Could not load your profile.")))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.customerID]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const next = {};
    if (!isNonEmpty(form.customerName)) next.customerName = "Full name is required.";
    if (!isValidPhone(form.phoneNo)) next.phoneNo = "Enter a valid phone number.";
    if (!isNonEmpty(form.address)) next.address = "Address is required.";
    if (form.password && !minLength(form.password, 6)) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        customerName: form.customerName,
        phoneNo: form.phoneNo,
        address: form.address,
      };
      if (form.password) payload.password = form.password;

      const res = await customerApi.update(user.customerID, payload);
      updateUser(res.data.data);
      setForm({ ...form, password: "" });
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(extractErrorMessage(err, "Could not update your profile."));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading your profile…" fullHeight />;

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal information and account security." />

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card-eco p-4 text-center">
            <div
              className="avatar-eco mx-auto mb-3"
              style={{ width: 72, height: 72, fontSize: "1.5rem" }}
            >
              {initials(form.customerName)}
            </div>
            <h6 className="mb-1">{form.customerName}</h6>
            <p className="text-muted-eco small mb-0">{form.email}</p>
            <span className="role-chip mt-3 d-inline-block">CUSTOMER</span>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card-eco p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="row">
                <div className="col-md-6">
                  <FormInput
                    label="Customer Name"
                    id="customerName"
                    icon="bi-person"
                    value={form.customerName}
                    onChange={set("customerName")}
                    error={errors.customerName}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Email"
                    id="email"
                    icon="bi-envelope"
                    value={form.email}
                    readOnly
                    disabled
                    helpText="Email cannot be changed."
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="Phone Number"
                    id="phoneNo"
                    icon="bi-telephone"
                    value={form.phoneNo}
                    onChange={set("phoneNo")}
                    error={errors.phoneNo}
                    required
                  />
                </div>
                <div className="col-md-6">
                  <FormInput
                    label="New Password"
                    id="password"
                    type="password"
                    icon="bi-lock"
                    value={form.password}
                    onChange={set("password")}
                    error={errors.password}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className="col-12">
                  <FormInput
                    label="Address"
                    id="address"
                    icon="bi-house"
                    value={form.address}
                    onChange={set("address")}
                    error={errors.address}
                    required
                  />
                </div>
              </div>
              <button type="submit" className="btn-eco-primary px-4 py-2" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import FormInput from "../../components/forms/FormInput";
import SelectInput from "../../components/forms/SelectInput";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { roleDashboardPath } from "../../context/AuthContext";
import collectionPointApi from "../../api/collectionPointApi";
import { isValidEmail, isNonEmpty, minLength } from "../../utils/validators";
import { extractErrorMessage } from "../../utils/format";

export default function CollectorRegisterPage() {
  const [form, setForm] = useState({
    collectorName: "",
    email: "",
    password: "",
    collectionPointID: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [points, setPoints] = useState([]);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    collectionPointApi
      .getAll()
      .then((res) => setPoints(res.data.data || []))
      .catch(() => setPoints([]));
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const next = {};
    if (!isNonEmpty(form.collectorName)) next.collectorName = "Full name is required.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!minLength(form.password, 6)) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (!payload.collectionPointID) delete payload.collectionPointID;
      const data = await register("COLLECTOR", payload);
      toast.success("Collector account created successfully!");
      navigate(roleDashboardPath[data.role], { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      sideTitle="Become a verified e-waste collector"
      sideSubtitle="Manage assigned requests, track inventory, and help keep electronics out of landfills."
    >
      <h3 className="mb-1">Create your collector account</h3>
      <p className="text-muted-eco mb-4">
        Already registered?{" "}
        <Link to="/login" className="fw-semibold" style={{ color: "var(--color-primary)" }}>
          Login here
        </Link>
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Full Name"
          id="collectorName"
          icon="bi-person"
          value={form.collectorName}
          onChange={set("collectorName")}
          error={errors.collectorName}
          placeholder="John Smith"
          required
        />
        <FormInput
          label="Email address"
          id="email"
          type="email"
          icon="bi-envelope"
          value={form.email}
          onChange={set("email")}
          error={errors.email}
          placeholder="you@example.com"
          required
        />
        <SelectInput
          label="Collection Point (optional)"
          id="collectionPointID"
          value={form.collectionPointID}
          onChange={set("collectionPointID")}
          placeholder="Assign later"
          options={points.map((p) => ({
            value: p.collectionPointID,
            label: `${p.location} (capacity ${p.capacity})`,
          }))}
          helpText="An admin can also assign or change this later."
        />
        <FormInput
          label="Password"
          id="password"
          type="password"
          icon="bi-lock"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          placeholder="At least 6 characters"
          required
        />
        <button type="submit" className="btn-eco-primary w-100 py-2 mt-2" disabled={submitting}>
          {submitting ? "Creating account…" : "Create Collector Account"}
        </button>
      </form>

      <p className="text-center text-muted-eco small mt-4 mb-0">
        Registering as a customer or admin instead?{" "}
        <Link to="/register/customer" className="fw-semibold" style={{ color: "var(--color-primary)" }}>
          Customer
        </Link>{" "}
        ·{" "}
        <Link to="/register/admin" className="fw-semibold" style={{ color: "var(--color-primary)" }}>
          Admin
        </Link>
      </p>
    </AuthLayout>
  );
}

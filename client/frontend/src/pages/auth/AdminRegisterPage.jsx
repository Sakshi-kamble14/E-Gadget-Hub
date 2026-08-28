import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import FormInput from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { roleDashboardPath } from "../../context/AuthContext";
import { isValidEmail, isNonEmpty, minLength } from "../../utils/validators";
import { extractErrorMessage } from "../../utils/format";

export default function AdminRegisterPage() {
  const [form, setForm] = useState({ adminName: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const next = {};
    if (!isNonEmpty(form.adminName)) next.adminName = "Full name is required.";
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
      const data = await register("ADMIN", form);
      toast.success("Admin account created successfully!");
      navigate(roleDashboardPath[data.role], { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      sideTitle="Oversee the entire e-waste network"
      sideSubtitle="Manage customers, collectors, collection points, requests, and inventory from one dashboard."
    >
      <h3 className="mb-1">Create your admin account</h3>
      <p className="text-muted-eco mb-4">
        Already registered?{" "}
        <Link to="/login" className="fw-semibold" style={{ color: "var(--color-primary)" }}>
          Login here
        </Link>
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Full Name"
          id="adminName"
          icon="bi-person"
          value={form.adminName}
          onChange={set("adminName")}
          error={errors.adminName}
          placeholder="Alex Morgan"
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
          placeholder="admin@example.com"
          required
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
          {submitting ? "Creating account…" : "Create Admin Account"}
        </button>
      </form>

      <p className="text-center text-muted-eco small mt-4 mb-0">
        Registering as a customer or collector instead?{" "}
        <Link to="/register/customer" className="fw-semibold" style={{ color: "var(--color-primary)" }}>
          Customer
        </Link>{" "}
        ·{" "}
        <Link to="/register/collector" className="fw-semibold" style={{ color: "var(--color-primary)" }}>
          Collector
        </Link>
      </p>
    </AuthLayout>
  );
}

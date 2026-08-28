import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import FormInput from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { roleDashboardPath } from "../../context/AuthContext";
import { isValidEmail, isNonEmpty } from "../../utils/validators";
import { extractErrorMessage } from "../../utils/format";

const ROLES = [
  { key: "CUSTOMER", label: "Customer" },
  { key: "COLLECTOR", label: "Collector" },
  { key: "ADMIN", label: "Admin" },
];

export default function LoginPage() {
  const [role, setRole] = useState("CUSTOMER");
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const next = {};
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!isNonEmpty(form.password)) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = await login(role, form);
      toast.success("Login successful. Welcome back!");
      const redirectTo = location.state?.from || roleDashboardPath[data.role];
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Login failed. Please check your credentials."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <h3 className="mb-1">Welcome back</h3>
      <p className="text-muted-eco mb-4">Log in to manage your e-waste activity.</p>

      <div className="role-tab-group mb-4">
        {ROLES.map((r) => (
          <button
            key={r.key}
            type="button"
            className={`role-tab ${role === r.key ? "active" : ""}`}
            onClick={() => setRole(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Email address"
          id="email"
          type="email"
          icon="bi-envelope"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          placeholder="you@example.com"
          required
          autoComplete="email"
        />
        <FormInput
          label="Password"
          id="password"
          type="password"
          icon="bi-lock"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          placeholder="••••••••"
          required
          autoComplete="current-password"
        />
        <button type="submit" className="btn-eco-primary w-100 py-2 mt-2" disabled={submitting}>
          {submitting ? "Logging in…" : `Login as ${ROLES.find((r) => r.key === role).label}`}
        </button>
      </form>

      <p className="text-center text-muted-eco small mt-4 mb-0">
        Don't have an account?{" "}
        <Link to={`/register/${role.toLowerCase()}`} className="fw-semibold" style={{ color: "var(--color-primary)" }}>
          Register as {ROLES.find((r) => r.key === role).label}
        </Link>
      </p>
    </AuthLayout>
  );
}

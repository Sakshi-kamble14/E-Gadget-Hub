import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import FormInput from "../../components/forms/FormInput";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { roleDashboardPath } from "../../context/AuthContext";
import { isValidEmail, isValidPhone, isNonEmpty, minLength } from "../../utils/validators";
import { extractErrorMessage } from "../../utils/format";

export default function CustomerRegisterPage() {
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phoneNo: "",
    password: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const validate = () => {
    const next = {};
    if (!isNonEmpty(form.customerName)) next.customerName = "Full name is required.";
    if (!isValidEmail(form.email)) next.email = "Enter a valid email address.";
    if (!isValidPhone(form.phoneNo)) next.phoneNo = "Enter a valid phone number.";
    if (!minLength(form.password, 6)) next.password = "Password must be at least 6 characters.";
    if (!isNonEmpty(form.address)) next.address = "Address is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const data = await register("CUSTOMER", form);
      toast.success("Account created successfully. Welcome to EcoCycle!");
      navigate(roleDashboardPath[data.role], { replace: true });
    } catch (err) {
      toast.error(extractErrorMessage(err, "Registration failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout
      sideTitle="Join the movement for responsible e-waste disposal"
      sideSubtitle="Create a customer account to submit requests and track your e-waste from pickup to recycling."
    >
      <h3 className="mb-1">Create your customer account</h3>
      <p className="text-muted-eco mb-4">
        Already registered?{" "}
        <Link to="/login" className="fw-semibold" style={{ color: "var(--color-primary)" }}>
          Login here
        </Link>
      </p>

      <form onSubmit={handleSubmit} noValidate>
        <FormInput
          label="Full Name"
          id="customerName"
          icon="bi-person"
          value={form.customerName}
          onChange={set("customerName")}
          error={errors.customerName}
          placeholder="Jane Doe"
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
        <FormInput
          label="Phone Number"
          id="phoneNo"
          icon="bi-telephone"
          value={form.phoneNo}
          onChange={set("phoneNo")}
          error={errors.phoneNo}
          placeholder="+1 555 123 4567"
          required
        />
        <FormInput
          label="Address"
          id="address"
          icon="bi-house"
          value={form.address}
          onChange={set("address")}
          error={errors.address}
          placeholder="123 Green Street, Springfield"
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
          {submitting ? "Creating account…" : "Create Customer Account"}
        </button>
      </form>

      <p className="text-center text-muted-eco small mt-4 mb-0">
        Registering as a collector or admin instead?{" "}
        <Link to="/register/collector" className="fw-semibold" style={{ color: "var(--color-primary)" }}>
          Collector
        </Link>{" "}
        ·{" "}
        <Link to="/register/admin" className="fw-semibold" style={{ color: "var(--color-primary)" }}>
          Admin
        </Link>
      </p>
    </AuthLayout>
  );
}

import { useState } from "react";

export default function FormInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  icon,
  helpText,
  readOnly = false,
  ...rest
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label-eco">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <div className="position-relative">
        {icon && (
          <i
            className={`bi ${icon} position-absolute text-faint-eco`}
            style={{ left: 14, top: "50%", transform: "translateY(-50%)" }}
          />
        )}
        <input
          id={id}
          type={inputType}
          className={`form-control form-control-eco ${icon ? "ps-5" : ""} ${
            isPassword ? "pe-5" : ""
          } ${error ? "border-danger" : ""}`}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          aria-invalid={Boolean(error)}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="btn btn-sm position-absolute text-muted-eco"
            style={{ right: 6, top: "50%", transform: "translateY(-50%)", border: "none", background: "transparent" }}
            aria-label={showPassword ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`} />
          </button>
        )}
      </div>
      {error && <div className="text-danger small mt-1">{error}</div>}
      {!error && helpText && <div className="text-muted-eco small mt-1">{helpText}</div>}
    </div>
  );
}

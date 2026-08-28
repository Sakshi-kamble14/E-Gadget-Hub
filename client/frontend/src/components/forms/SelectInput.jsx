export default function SelectInput({
  label,
  id,
  value,
  onChange,
  options = [],
  error,
  required = false,
  disabled = false,
  placeholder = "Select an option",
  helpText,
}) {
  return (
    <div className="mb-3">
      {label && (
        <label htmlFor={id} className="form-label-eco">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <select
        id={id}
        className={`form-select form-select-eco ${error ? "border-danger" : ""}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        aria-invalid={Boolean(error)}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <div className="text-danger small mt-1">{error}</div>}
      {!error && helpText && <div className="text-muted-eco small mt-1">{helpText}</div>}
    </div>
  );
}

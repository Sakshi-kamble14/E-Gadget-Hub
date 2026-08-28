export default function SearchBar({ value, onChange, placeholder = "Search…", className = "" }) {
  return (
    <div className={`position-relative ${className}`}>
      <i
        className="bi bi-search position-absolute text-faint-eco"
        style={{ left: 14, top: "50%", transform: "translateY(-50%)" }}
      />
      <input
        type="text"
        className="form-control form-control-eco ps-5"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  );
}

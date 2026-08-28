export function isValidEmail(email = "") {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone = "") {
  return /^[0-9+\-\s()]{7,20}$/.test(phone.trim());
}

export function isNonEmpty(value = "") {
  return value.trim().length > 0;
}

export function minLength(value = "", len) {
  return value.length >= len;
}

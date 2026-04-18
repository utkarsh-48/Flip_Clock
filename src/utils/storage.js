export function readStoredBoolean(key, fallback) {
  const value = localStorage.getItem(key);
  if (value === null) return fallback;
  return value === "true";
}

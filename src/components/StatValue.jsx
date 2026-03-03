/**
 * StatValue - Displays a numeric value (e.g. for dashboard summary cards).
 * Formats with toLocaleString() for thousands separators.
 */
export default function StatValue({ value = 0 }) {
  const num = Number(value);
  const display = Number.isNaN(num) ? '0' : num.toLocaleString();
  return <span>{display}</span>;
}

/** Compact relative-ish timestamp for CRM lists ("just now", "3h", "12 Aug"). */
export function formatWhen(date: Date | null | undefined): string {
  if (!date) return "—";
  const d = date instanceof Date ? date : new Date(date);
  const diffMs = Date.now() - d.getTime();
  const min = Math.round(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.round(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.round(hr / 24);
  if (day < 7) return `${day}d ago`;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}

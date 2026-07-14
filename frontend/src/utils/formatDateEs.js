export default function formatDateEs(value) {
  if (value == null || value === "") return "";

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    const dd = String(value.getDate()).padStart(2, "0");
    const mm = String(value.getMonth() + 1).padStart(2, "0");
    const yyyy = String(value.getFullYear());
    return `${dd}/${mm}/${yyyy}`;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return "";

    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, yyyy, mm, dd] = isoMatch;
      return `${dd}/${mm}/${yyyy}`;
    }

    const parsed = new Date(trimmed);
    if (!Number.isNaN(parsed.getTime())) {
      const dd = String(parsed.getDate()).padStart(2, "0");
      const mm = String(parsed.getMonth() + 1).padStart(2, "0");
      const yyyy = String(parsed.getFullYear());
      return `${dd}/${mm}/${yyyy}`;
    }

    return trimmed;
  }

  if (typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      const dd = String(parsed.getDate()).padStart(2, "0");
      const mm = String(parsed.getMonth() + 1).padStart(2, "0");
      const yyyy = String(parsed.getFullYear());
      return `${dd}/${mm}/${yyyy}`;
    }
  }

  return String(value);
}

function safeDate(input?: string | null): Date | null {
  if (!input) return null;
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatShortDate(input?: string | null): string {
  const d = safeDate(input);
  if (!d) return "—";
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}


export function formatTimeRange(
  start?: string | null,
  end?: string | null
): string {
  const sDate = safeDate(start);
  const eDate = safeDate(end);

  // If they are ISO-like, format nicely
  if (sDate || eDate) {
    const s = sDate
      ? sDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
      : "—";
    const e = eDate
      ? eDate.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })
      : "—";
    return `${s} - ${e}`;
  }

  // Otherwise treat them as already-human strings
  if (start && end) return `${start} - ${end}`;
  return "—";
}

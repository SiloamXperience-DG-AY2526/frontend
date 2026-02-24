export const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

export function formatAmount(v: string | number): string {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? currencyFormatter.format(n) : String(v);
}
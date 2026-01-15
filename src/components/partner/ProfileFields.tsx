
type FieldProps = {
  label: string;
  value?: string | number | null;
  placeholder?: string; // default: "— — —"
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
};

export default function Field({
  label,
  value,
  placeholder = '— — —',
  className = '',
  labelClassName = '',
  valueClassName = '',
}: FieldProps) {
  const display =
    value === null || value === undefined || String(value).trim() === ''
      ? placeholder
      : String(value);

  return (
    <div
      className={`flex items-center justify-between gap-6 py-2 ${className}`}
    >
      <span
        className={`text-sm font-semibold text-slate-900 ${labelClassName}`}
      >
        {label}
      </span>

      <span className={`text-sm text-slate-500 ${valueClassName}`}>
        {display}
      </span>
    </div>
  );
}

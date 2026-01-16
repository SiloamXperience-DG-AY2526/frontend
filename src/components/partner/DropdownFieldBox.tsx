type Option = { label: string; value: string };

export default function DropdownFieldBox({
  label,
  value,
  options,
  editable,
  onChange,
  placeholder = 'Select...',
}: {
  label: string;
  value: string;
  options: Option[];
  editable: boolean;
  onChange?: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-900">{label}</div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3">
        {editable ? (
          <>
            <select
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
            >
              <option value="" disabled>
                {placeholder}
              </option>
              {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </>
        ) : (
          <div className="w-full text-sm text-slate-700">
            {value?.trim()
              ? options.find((o) => o.value === value)?.label ?? value
              : '— — —'}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

export default function RadioGroup({
  label,
  value,
  options,
  onChange,
  required = false,
  error,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-black text-md mb-2 font-semibold">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>

      <div className="flex items-center gap-10">
        {options.map((opt) => (
          <label
            key={opt.value}
            className="inline-flex items-center gap-3 cursor-pointer"
          >
            <input
              type="radio"
              checked={value === opt.value}
              onChange={() => onChange(opt.value)}
              className="h-4 w-4"
            />
            <span className="text-sm text-black">{opt.label}</span>
          </label>
        ))}
      </div>

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

"use client";

export default function Select({
  label,
  value,
  options,
  onChange,
  required = false,
  error,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-black font-semibold text-md mb-2">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>

      <select
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full rounded-md border px-3 py-3 bg-white outline-none transition
          ${
            error
              ? "border-red-600 focus:border-red-600 focus:ring-red-600"
              : "border-green-700 focus:border-green-800 focus:ring-green-800"
          }
          focus:ring-1
        `}
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

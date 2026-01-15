'use client';

export default function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-black font-semibold text-md mb-2">
        {label} :
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-md
          border
          border-green-700
          px-3
          py-2
          bg-white
          outline-none
          transition
          focus:border-green-800
          focus:ring-1
          focus:ring-green-800
        "
      >
        <option value="">Select</option>

        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

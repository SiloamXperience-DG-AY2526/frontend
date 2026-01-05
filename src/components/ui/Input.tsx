"use client";

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  readOnly = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void; // ✅ MUST be optional here
  type?: string;
  readOnly?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="block text-black text-md mb-2 font-semibold">
        {label}
      </label>

      <input
        type={type}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)} 
        className="
          w-full
          rounded-md
          border
          border-green-700
          px-3
          py-2
          outline-none
          transition
          focus:border-green-800
          focus:ring-1
          focus:ring-green-800
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          read-only:bg-gray-50
        "
      />
    </div>
  );
}

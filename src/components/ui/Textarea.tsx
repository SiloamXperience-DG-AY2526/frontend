"use client";

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,         
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string; 
  rows?: number;
}) {
  return (
    <div>
      {label && (
        <label className="block text-black font-semibold text-md mb-2">
          {label}
        </label>
      )}

      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}  
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-md
          border
          border-green-700
          px-3
          py-2
          outline-none
          resize-none
          transition
          placeholder:text-gray-400
          focus:border-green-800
          focus:ring-1
          focus:ring-green-800
        "
      />
    </div>
  );
}

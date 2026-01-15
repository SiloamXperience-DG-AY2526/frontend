'use client';

export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,         
  readOnly = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string; 
  readOnly?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      {label && (
        <label className="block text-black text-md mb-2 font-semibold">
          {label}
        </label>
      )}

      <input
        type={type}
        value={value}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}   
        onChange={(e) => onChange?.(e.target.value)}
        className="
          w-full
          rounded-md
          border
          border-green-700
          px-3
          py-3
          outline-none
          transition
          placeholder:text-gray-400 text-sm
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

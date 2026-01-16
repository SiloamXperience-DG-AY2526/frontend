'use client';

export default function Input({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  readOnly = false,
  disabled = false,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  readOnly?: boolean;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block text-black text-md mb-2 font-semibold">
          {label}
          {required && <span className="text-red-600"> *</span>}
        </label>
      )}

      <input
        type={type}
        value={value}
        required={required}
        readOnly={readOnly}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className={`
          w-full rounded-md border px-3 py-3 outline-none transition text-sm
          ${
            error
              ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
              : 'border-green-700 focus:border-green-800 focus:ring-green-800'
          }
          focus:ring-1
          placeholder:text-gray-400
          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
          read-only:bg-gray-50
        `}
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

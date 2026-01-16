'use client';

export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  required = false,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      {label && (
        <label className="block text-black font-semibold text-md mb-2">
          {label}
          {required && <span className="text-red-600">*</span>}
        </label>
      )}

      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full rounded-md border px-3 py-2 outline-none resize-none transition
          placeholder:text-gray-400
          ${
            error
              ? 'border-red-600 focus:border-red-600 focus:ring-red-600'
              : 'border-green-700 focus:border-green-800 focus:ring-green-800'
          }
          focus:ring-1
        `}
      />

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

'use client';

export default function TextArea({
  label,
  value,
  onChange,
<<<<<<< HEAD
  placeholder,         
  rows = 3,
=======
  placeholder,
  rows = 3,
  required = false,
  error,
>>>>>>> main
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
<<<<<<< HEAD
  placeholder?: string; 
  rows?: number;
=======
  placeholder?: string;
  rows?: number;
  required?: boolean;
  error?: string;
>>>>>>> main
}) {
  return (
    <div>
      {label && (
        <label className="block text-black font-semibold text-md mb-2">
          {label}
<<<<<<< HEAD
=======
          {required && <span className="text-red-600">*</span>}
>>>>>>> main
        </label>
      )}

      <textarea
        rows={rows}
        value={value}
<<<<<<< HEAD
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
=======
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
>>>>>>> main
          focus:ring-1
        `}
      />

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

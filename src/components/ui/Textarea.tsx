'use client';

export default function TextArea({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-black font-semibold text-md mb-2">
        {label} :
      </label>

      <textarea
        rows={3}
        value={value}
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
          focus:border-green-800
          focus:ring-1
          focus:ring-green-800
        "
      />
    </div>
  );
}

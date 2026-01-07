export default function RadioGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-black text-md mb-2 font-semibold">
        {label}
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
    </div>
  );
}

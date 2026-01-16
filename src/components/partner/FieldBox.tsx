export default function FieldBox({
  label,
  value,
  editable,
  onChange,
  type = 'text',
}: {
  label: string;
  value: string;
  editable: boolean;
  onChange?: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-900">{label}</div>

      <div className="flex items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 py-3">
        {editable ? (
          <>
            <input
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              type={type}
            />
            {/* edit mode */}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-slate-600"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
            </svg>
          </>
        ) : (
          // view mode
          <div className="w-full text-sm text-slate-700">
            {value ?? '— — —'}
          </div>
        )}
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select All Applicable",
  required = false,
  error,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = options.filter(
    (opt) =>
      opt.toLowerCase().includes(query.toLowerCase()) && !value.includes(opt)
  );

  const add = (opt: string) => {
    onChange([...value, opt]);
    setQuery("");
    setOpen(false);
  };

  const remove = (opt: string) => {
    onChange(value.filter((v) => v !== opt));
  };

  return (
    <div className="relative" ref={wrapRef}>
      <label className="block text-black font-semibold text-md mb-2">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {value.map((v) => (
            <span
              key={v}
              className="bg-green-800 text-white text-xs px-2 py-1 rounded flex items-center gap-2"
            >
              {v}
              <button
                type="button"
                onClick={() => remove(v)}
                className="text-white/70 hover:text-white"
                aria-label={`Remove ${v}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className={`
          w-full rounded-md border px-3 py-2 outline-none transition
          ${
            error
              ? "border-red-600 focus:border-red-600 focus:ring-red-600"
              : "border-green-700 focus:border-green-800 focus:ring-green-800"
          }
          focus:ring-1
        `}
      />

      {open && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-green-700 rounded-md mt-1 max-h-48 overflow-y-auto shadow-sm">
          {filtered.map((opt) => (
            <li
              key={opt}
              onClick={() => add(opt)}
              className="px-3 py-2 cursor-pointer text-sm hover:bg-green-800 hover:text-white"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}

      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}

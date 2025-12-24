"use client";

import { useState } from "react";

interface Props {
  label: string;
  options: string[];
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}

export default function MultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select All Applicable",
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

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
    <div className="relative">
      <label className="block text-black font-semibold text-sm mb-1">{label} :</label>

      {/* Selected tags */}
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((v) => (
          <span
            key={v}
            className="bg-black text-white text-xs px-2 py-1 rounded flex items-center gap-2"
          >
            {v}
            <button
              type="button"
              onClick={() => remove(v)}
              className="text-white/70 hover:text-white"
            >
              ×
            </button>
          </span>
        ))}
      </div>

      {/* Input */}
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        className="w-full border-b border-black outline-none py-1.5"
      />

      {/* Dropdown */}
      {open && filtered.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border border-black mt-1 max-h-48 overflow-y-auto">
          {filtered.map((opt) => (
            <li
              key={opt}
              onClick={() => add(opt)}
              className="px-3 py-2 cursor-pointer hover:bg-black hover:text-white text-sm"
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

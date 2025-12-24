"use client";

import { useState } from "react";

export default function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-black font-semibold text-sm mb-1">{label} :</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-black outline-none py-1.5 bg-transparent"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
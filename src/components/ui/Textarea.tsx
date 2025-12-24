"use client";

import { useState } from "react";

export default function Textarea({
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
      <label className="block text-black font-semibold text-sm mb-1">{label} :</label>
      <textarea
        rows={2}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-black outline-none resize-none"
      />
    </div>
  );
}
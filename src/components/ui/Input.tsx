"use client";

import { useState } from "react";

export default function Input({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-black text-sm mb-1 font-semibold ">
        {label} :
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border-b border-black outline-none py-1.5"
      />
    </div>
  );
}

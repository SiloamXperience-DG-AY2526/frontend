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
      <label className="block text-black text-md mb-2 font-semibold">
        {label}
      </label>

      <input
        type={type}
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
          transition
          focus:border-green-800
          focus:ring-1
          focus:ring-green-800
        "
      />
    </div>
  );
}

"use client";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function VolunteerSearch({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-2 rounded-xl border bg-gray-50 px-4 py-3 shadow-sm">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search through all projects to find one you’d like to volunteer for."
          className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
        <span className="text-gray-400">🔎</span>
      </div>
    </div>
  );
}

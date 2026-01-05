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
      <div className="flex w-1/2 items-center gap-3 rounded-xl  bg-[#F0F0F2] px-4 py-3 shadow-sm">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search through all projects to find one you’d like to volunteer for."
          className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
        />
      </div>
    </div>
  );
}

import React from "react";

export function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "rounded-full px-5 py-2 text-sm font-medium border transition cursor-pointer",
        active
          ? "bg-[#0E5A4A] text-white border-[#0E5A4A]"
          : "bg-white text-gray-600 border-gray-900 hover:bg-gray-50",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function StatusBadge({
  label,
  tone,
}: {
  label: string;
  tone: "upcoming" | "active" | "completed" | "pending";
}) {
  const cls =
    tone === "upcoming"
      ? "bg-[#DDF2FF] text-[#1B6D9B]"
      : tone === "active"
      ? "bg-[#DDF7EE] text-[#0E5A4A]"
      : tone === "completed"
      ? "bg-[#EEE8FF] text-[#5C44B3]"
      : "bg-[#E7EEF9] text-[#2C4A74]";

  return (
    <span
      className={`inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold ${cls}`}
    >
      {label}
    </span>
  );
}

export function formatProjectDateTime(
  startDate: string,
  startTime?: string,
  endTime?: string
) {
  const date = new Date(startDate);
  const start = startTime ? new Date(startTime) : null;
  const end = endTime ? new Date(endTime) : null;

  const datePart = date.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  if (!start || !end) return datePart;

  const startTimePart = start.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  const endTimePart = end.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return `${datePart}, ${startTimePart} - ${endTimePart}`;
}

import React from "react";
import { VolunteerProject } from "@/types/Volunteer";
import { formatShortDate, formatTimeRange } from "@/lib/utils/date";
import Link from "next/link";

export default function VolunteerProjectCard({ p }: { p: VolunteerProject }) {
  const spotsLeft =
    typeof p.availableSpots === "number" ? p.availableSpots : undefined;

  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="relative h-44 w-full bg-gray-100">
        {p.image ? (
          <img
            src={p.image}
            alt={p.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-500">
            No image
          </div>
        )}

        {typeof spotsLeft === "number" && (
          <div className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white">
            {spotsLeft} spots left
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="text-lg font-semibold text-gray-900">{p.title}</div>

        <div className="mt-2 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gray-100">
              📅
            </span>
            <span>{formatShortDate(p.startDate)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gray-100">
              ⏰
            </span>
            <span>{formatTimeRange(p.startTime, p.endTime)}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-gray-100">
              📍
            </span>
            <span>{p.location ?? "—"}</span>
          </div>
        </div>

        <Link
          href={`/volunteers/projects/${p.id}`}
          className="mt-5 block w-full rounded-lg bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-teal-700 active:bg-teal-800"
        >
          Join Now!
        </Link>
      </div>
    </div>
  );
}

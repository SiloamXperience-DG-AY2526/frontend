import React from "react";
import Link from "next/link";
import { VolunteerProject } from "@/types/Volunteer";
import { formatShortDate, formatTimeRange } from "@/lib/utils/date";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

export default function VolunteerProjectCard({ p }: { p: VolunteerProject }) {
  const spotsLeft = p.projectAvailableSlots;

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#E4FAF4] shadow-sm">
      {/* Image */}
      <div className="relative h-44 w-full bg-gray-100">
        {p.image ? (
          // eslint-disable-next-line @next/next/no-img-element
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

        {/* Spots left pill */}
        {typeof spotsLeft === "number" && (
          <div className="absolute left-3 top-3 rounded-md bg-[#F3F4F6] px-3 py-1 text-xs font-semibold text-gray-800 shadow">
            {spotsLeft} spot{spotsLeft === 1 ? "" : "s"} left
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pb-5 pt-4">
        <div className="text-xl font-bold text-gray-900">{p.title}</div>
        {p.aboutDesc ? (
          <div className="mt-1 text-md text-gray-700">{p.aboutDesc}</div>
        ) : (
          <div className="mt-2 text-md text-gray-700">
            Distribute essential supplies.
          </div>
        )}

        {/* Details rows */}
        <div className="mt-4 space-y-5 text-sm text-gray-800">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-5 w-5 text-gray-700" />
            <span>{formatShortDate(p.startDate)}</span>
          </div>

          <div className="flex items-center gap-3">
            <ClockIcon className="h-5 w-5 text-gray-700" />
            <span>{formatTimeRange(p.startTime, p.endTime)}</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPinIcon className="h-5 w-5 text-gray-700" />
            <span>{p.location ?? "—"}</span>
          </div>
        </div>

        {/* Button aligned bottom-right */}
        <div className="mt-5 flex justify-end">
          <Link
            href={`/volunteers/projects/${p.id}`}
            className="
              inline-flex items-center justify-center
              rounded-xl px-6 py-2.5 text-sm font-bold text-white
              bg-gradient-to-r from-[#1F7A67] to-[#2AAE92]
              hover:from-[#1A6A59] hover:to-[#22997F]
              shadow-sm
              active:scale-[0.99]
              transition
            "
          >
            Join Now!
          </Link>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import Link from "next/link";
import {
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { StatusBadge, formatProjectDateTime } from "./ui";
import { VolunteerApplicationDTO } from "@/types/Volunteer";

export default function ContributionCard({
  item,
  badge,
  showGiveFeedback,
}: {
  item: VolunteerApplicationDTO;
  badge: {
    label: string;
    tone: "upcoming" | "active" | "completed" | "pending";
  };
  showGiveFeedback?: boolean;
}) {
  return (
    <div className="w-full rounded-xl border border-black shadow-sm bg-white px-6 py-7">
      <div className="flex items-start justify-between gap-6">

        <div className="flex-1">
          {/* Project title */}
          <h3 className="text-lg font-semibold text-black mb-2">
            {item.project.title}
          </h3>

          {/* Project description */}
          <p className="mt-1 text-sm text-gray-600">
            {item.project.description}
          </p>

          {/*  info */}
          <div className="mt-4 space-y-4 text-sm text-black">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-black" />
              <span>{item.project.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <CalendarDaysIcon className="h-4 w-4 text-black" />
              <span>
                {formatProjectDateTime(
                  item.project.startDate,
                  item.project.startTime,
                  item.project.endTime
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-black" />
              <span>{item.position.role}</span>
            </div>
          </div>
        </div>


        <div className="flex flex-col items-end gap-2">
          <StatusBadge label={badge.label} tone={badge.tone} />

          {showGiveFeedback && (
            <Link
              href={`/volunteer/${item.project.id}/feedback`}
              className="rounded-full bg-[#0E5A4A] px-4 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              Give feedback
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

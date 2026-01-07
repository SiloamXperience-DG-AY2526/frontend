"use client";

import React, { useEffect, useMemo, useState } from "react";
import ContributionCard from "../contribution/ContributionCard";
import { fetchVolunteerApplications } from "@/lib/api/volunteer";
import { VolunteerApplicationDTO } from "@/types/Volunteer";
import { Pill } from "./ui";

type FilterKey = "all" | "upcoming" | "active" | "completed" | "pending";

export default function VolunteeringTab({ userId }: { userId: string }) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<VolunteerApplicationDTO[]>([]);
  const [error, setError] = useState<string | null>(null);

  // show volunteering items where application status is APPROVED
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        // fetch only approved from backend
        const data = await fetchVolunteerApplications({
          userId,
          status: "approved",
        });

        if (!mounted) return;
        setItems(data);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Failed to load volunteering");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const now = new Date();

  const computed = useMemo(() => {
    const getBucket = (a: VolunteerApplicationDTO) => {
      const start = new Date(a.project.startDate);
      const end = new Date(a.project.endDate);

      if (end.getTime() < now.getTime()) {
        return { key: "completed" as const };
      }
      if (start.getTime() > now.getTime()) {
        return { key: "upcoming" as const };
      }
      return { key: "active" as const };
    };

    const decorated = items.map((a) => ({
      a,
      bucket: getBucket(a),
    }));

    const filtered =
      filter === "all"
        ? decorated
        : filter === "pending"
        ? []
        : decorated.filter((x) => x.bucket.key === filter);

    return filtered.map(({ a, bucket }) => {
      const badge =
        bucket.key === "upcoming"
          ? { label: "Upcoming", tone: "upcoming" as const }
          : bucket.key === "active"
          ? { label: "Active", tone: "active" as const }
          : { label: "Completed", tone: "completed" as const };

      // feedback
      const showGiveFeedback =
        bucket.key === "completed" && a.feedbackGiven === false;

      return { item: a, badge, showGiveFeedback };
    });
  }, [items, filter, now]);

  return (
    <div>
      {/* Filters  */}
      <div className="mb-6 grid grid-cols-5 gap-3 w-full">
        <Pill active={filter === "all"} onClick={() => setFilter("all")}>
          All events
        </Pill>

        <Pill
          active={filter === "upcoming"}
          onClick={() => setFilter("upcoming")}
        >
          Upcoming
        </Pill>

        <Pill active={filter === "active"} onClick={() => setFilter("active")}>
          Active
        </Pill>

        <Pill
          active={filter === "completed"}
          onClick={() => setFilter("completed")}
        >
          Completed
        </Pill>

        <Pill
          active={filter === "pending"}
          onClick={() => setFilter("pending")}
        >
          Pending
        </Pill>
      </div>

      {loading && <div className="text-sm text-gray-500">Loading...</div>}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {!loading && !error && computed.length === 0 && (
        <div className="text-sm text-gray-500">
          No volunteering records found.
        </div>
      )}

      <div className="space-y-5">
        {computed.map(({ item, badge, showGiveFeedback }) => (
          <ContributionCard
            key={item.applicationId}
            item={item}
            badge={badge}
            showGiveFeedback={showGiveFeedback}
          />
        ))}
      </div>
    </div>
  );
}

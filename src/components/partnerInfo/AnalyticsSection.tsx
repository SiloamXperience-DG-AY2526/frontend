'use client';

import { useMemo } from 'react';
import { PartnerInfoResponse } from '@/types/PartnerInfo';

const CHART_WIDTH = 640;
const CHART_PADDING = { top: 12, right: 18, bottom: 26, left: 36 } as const;

function LineChart({
  data,
  height = 180,
}: {
  data: number[];
  height?: number;
}) {
  const width = CHART_WIDTH;
  const padding = CHART_PADDING;

  const { points, minY, maxY } = useMemo(() => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const safeMin = Number.isFinite(min) ? min : 0;
    const safeMax = Number.isFinite(max) ? max : 1;
    const range = safeMax - safeMin || 1;

    const xStep =
      (width - padding.left - padding.right) / Math.max(1, data.length - 1);
    const yScale = (height - padding.top - padding.bottom) / range;

    const pts = data
      .map((y, i) => {
        const x = padding.left + i * xStep;
        const yy = padding.top + (safeMax - y) * yScale;
        return `${x.toFixed(2)},${yy.toFixed(2)}`;
      })
      .join(' ');

    return { points: pts, minY: safeMin, maxY: safeMax };
  }, [data, height]);

  const yTicks = useMemo(() => {
    const ticks = 5;
    const range = maxY - minY || 1;
    return Array.from({ length: ticks }, (_, i) => {
      const t = i / (ticks - 1);
      const value = minY + (1 - t) * range;
      const y =
        padding.top + ((height - padding.top - padding.bottom) * i) / (ticks - 1);
      return { value, y };
    });
  }, [height, maxY, minY]);

  const xTicks = useMemo(() => {
    const maxTick = 12;
    const ticks = maxTick + 1;
    const xStep = (width - padding.left - padding.right) / Math.max(1, ticks - 1);
    return Array.from({ length: ticks }, (_, i) => ({
      label: String(i),
      x: padding.left + i * xStep,
    }));
  }, []);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" role="img" aria-label="Line chart">
      {yTicks.map((t) => (
        <g key={t.y}>
          <line
            x1={padding.left}
            x2={width - padding.right}
            y1={t.y}
            y2={t.y}
            stroke="#E5E7EB"
            strokeWidth="1"
          />
          <text
            x={padding.left - 8}
            y={t.y + 4}
            textAnchor="end"
            fontSize="10"
            fill="#6B7280"
          >
            {Math.round(t.value)}
          </text>
        </g>
      ))}

      <line
        x1={padding.left}
        x2={padding.left}
        y1={padding.top}
        y2={height - padding.bottom}
        stroke="#111827"
        strokeWidth="1"
      />
      <line
        x1={padding.left}
        x2={width - padding.right}
        y1={height - padding.bottom}
        y2={height - padding.bottom}
        stroke="#111827"
        strokeWidth="1"
      />

      {xTicks.map((t) => (
        <g key={t.x}>
          <line
            x1={t.x}
            x2={t.x}
            y1={height - padding.bottom}
            y2={height - padding.bottom + 4}
            stroke="#111827"
            strokeWidth="1"
          />
          <text
            x={t.x}
            y={height - 8}
            textAnchor="middle"
            fontSize="10"
            fill="#111827"
          >
            {t.label}
          </text>
        </g>
      ))}

      <polyline
        points={points}
        fill="none"
        stroke="#0B5C75"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AnalyticsSection({ partnerInfo }: { partnerInfo: PartnerInfoResponse }) {
  const monthlyHours = useMemo(() => {
    const arr = Array.from({ length: 13 }, () => 0);
    for (const p of partnerInfo.projects) {
      for (const s of p.sessions) {
        if (s.attendance !== 'Attended') continue;
        const d = new Date(s.date);
        if (Number.isNaN(d.getTime())) continue;
        const monthIndex = d.getUTCMonth(); // 0..11
        arr[monthIndex] += s.hoursCompleted || 0;
      }
    }
    return arr.map((n) => Math.round(n * 100) / 100);
  }, [partnerInfo.projects]);

  const totalHoursCompleted = useMemo(() => {
    const total = partnerInfo.projects.reduce((sum, p) => sum + (p.totalHours || 0), 0);
    return Math.round(total * 100) / 100;
  }, [partnerInfo.projects]);

  const averageHoursCompleted = useMemo(() => {
    if (partnerInfo.projects.length === 0) return 0;
    return Math.round((totalHoursCompleted / partnerInfo.projects.length) * 100) / 100;
  }, [partnerInfo.projects.length, totalHoursCompleted]);

  const averageScore = useMemo(() => {
    if (partnerInfo.performance.length === 0) return 0;
    const avg =
      partnerInfo.performance.reduce((sum, r) => sum + (r.score || 0), 0) /
      partnerInfo.performance.length;
    return Math.round(avg * 100) / 100;
  }, [partnerInfo.performance]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        <div className="mb-3 text-sm font-semibold text-gray-800">
          Number of hours completed by month
        </div>
        <div className="rounded-md border border-gray-100 p-3">
          <LineChart data={monthlyHours} />
        </div>
      </div>

      <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_0.9fr]">
        <div className="flex h-full flex-col gap-4">
          <div className="flex flex-1 flex-col rounded-lg border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-800">
              Total number of hours completed
            </div>
            <div className="flex flex-1 items-center justify-center text-center text-3xl font-bold text-gray-900">
              <span>{totalHoursCompleted}</span>
            </div>
          </div>

          <div className="flex flex-1 flex-col rounded-lg border bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold text-gray-800">
              Average number of hours completed
            </div>
            <div className="flex flex-1 items-center justify-center text-center text-3xl font-bold text-gray-900">
              <span>{averageHoursCompleted}</span>
            </div>
          </div>
        </div>

        <div className="flex h-full flex-col rounded-lg border bg-white p-4 shadow-sm">
          <div className="text-sm font-semibold text-gray-800">Name’s Average score</div>
          <div className="flex flex-1 items-center justify-center text-center text-4xl font-bold text-gray-900">
            <span>{averageScore.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}



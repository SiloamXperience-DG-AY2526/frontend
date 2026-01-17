'use client';

import { PerformanceReview } from '@/types/PartnerInfo';
import { formatTimestampUTC } from '@/app/(partner)/partner/[slug]/utils';

export function PerformanceCard({ performance }: { performance: PerformanceReview[] }) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="bg-[#2C8794] px-5 py-3 text-sm font-semibold text-white">
        Performance
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#C7F0FF] text-gray-700">
              <th className="px-5 py-3 text-left font-medium">Reviewer name</th>
              <th className="px-5 py-3 text-left font-medium">Timestamp</th>
              <th className="px-5 py-3 text-center font-medium">Score</th>
              <th className="px-5 py-3 text-left font-medium">Strengths</th>
              <th className="px-5 py-3 text-left font-medium">Areas of Improvement</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {performance.map((row) => (
              <tr key={`${row.reviewerName}-${row.timestamp}`} className="text-gray-700">
                <td className="px-5 py-4">{row.reviewerName}</td>
                <td className="px-5 py-4 text-gray-600">
                  {formatTimestampUTC(row.timestamp)}
                </td>
                <td className="px-5 py-4 text-center text-gray-600">
                  {row.score.toFixed(1)} / 5
                </td>
                <td className="px-5 py-4 text-gray-600">{row.strengths}</td>
                <td className="px-5 py-4 text-gray-600">{row.areasOfImprovement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



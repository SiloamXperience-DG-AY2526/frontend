'use client';

import { useMemo } from 'react';
import { AttendanceStatus, ProjectInfo, ProjectSession } from '@/types/PartnerInfo';
import { calcHoursRounded, formatDateShortUTC, formatTimeLabelUTC, setTimeOnIsoDateUTC } from '@/app/(partner)/partner/[slug]/utils';
import { PopoverSelect } from './common';

export function ProjectsCard({
  projects,
  attendanceOptions,
  timeOptions,
  onUpdateSession,
}: {
  projects: ProjectInfo[];
  attendanceOptions: AttendanceStatus[];
  timeOptions: string[];
  onUpdateSession: (
    projectId: string,
    sessionIndex: number,
    patch: Partial<ProjectSession>
  ) => void;
}) {
  const sessionRows = useMemo(() => {
    return projects.flatMap((p) =>
      p.sessions.map((s, sessionIndex) => ({
        rowId: `${p.projectId}-${sessionIndex}`,
        projectId: p.projectId,
        projectTitle: p.projectTitle,
        sessionIndex,
        session: s,
      }))
    );
  }, [projects]);

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="bg-[#2C8794] px-5 py-3 text-sm font-semibold text-white">Projects</div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-[#C7F0FF] text-gray-700">
              <th className="px-5 py-3 text-left font-medium">Project Joined</th>
              <th className="px-5 py-3 text-left font-medium">Attendance</th>
              <th className="px-5 py-3 text-left font-medium">Date Volunteered</th>
              <th className="px-5 py-3 text-left font-medium">Time Volunteered</th>
              <th className="px-5 py-3 text-left font-medium">Hours Completed</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {sessionRows.map((row) => {
              const s = row.session;
              const timeDisabled = s.attendance !== 'Attended';
              const startLabel = s.startTime ? formatTimeLabelUTC(s.startTime) : '';
              const endLabel = s.endTime ? formatTimeLabelUTC(s.endTime) : '';

              return (
                <tr key={row.rowId} className="align-top text-gray-700">
                  <td className="px-5 py-4">
                    <div className="font-medium text-gray-800">{row.projectTitle}</div>
                    <div className="text-xs text-gray-500">{s.sessionName}</div>
                  </td>

                  <td className="px-5 py-4">
                    <PopoverSelect
                      value={s.attendance}
                      placeholder="Choose an option"
                      options={attendanceOptions as unknown as string[]}
                      onChange={(v) => {
                        const nextAttendance = v as AttendanceStatus;
                        onUpdateSession(row.projectId, row.sessionIndex, {
                          attendance: nextAttendance,
                          hoursCompleted:
                            nextAttendance === 'Attended'
                              ? calcHoursRounded(s.startTime, s.endTime)
                              : 0,
                        });
                      }}
                    />
                  </td>

                  <td className="px-5 py-4 text-gray-600">{formatDateShortUTC(s.date)}</td>

                  <td className="px-5 py-4">
                    {timeDisabled ? (
                      <div className="text-gray-400">-</div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <div className="min-w-[120px]">
                          <PopoverSelect
                            value={startLabel}
                            placeholder={startLabel || 'Time'}
                            options={timeOptions}
                            onChange={(v) =>
                              onUpdateSession(row.projectId, row.sessionIndex, {
                                startTime: setTimeOnIsoDateUTC(s.startTime || s.date, v),
                              })
                            }
                            disabled={timeDisabled}
                          />
                        </div>
                        <span className="pt-2 text-gray-500">to</span>
                        <div className="min-w-[120px]">
                          <PopoverSelect
                            value={endLabel}
                            placeholder={endLabel || 'Time'}
                            options={timeOptions}
                            onChange={(v) =>
                              onUpdateSession(row.projectId, row.sessionIndex, {
                                endTime: setTimeOnIsoDateUTC(s.endTime || s.date, v),
                              })
                            }
                            align="right"
                            disabled={timeDisabled}
                          />
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="px-5 py-4 text-gray-600">{s.hoursCompleted.toFixed(2)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}



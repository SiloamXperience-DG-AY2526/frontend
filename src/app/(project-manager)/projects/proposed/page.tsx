"use client";

import { useState } from "react";
import { ProjectApprovalStatus } from "@/types/ProjectData";
import { changeProposedProjectStatus } from "@/lib/api/general/projects";

interface Project {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    organisingTeam: string;
    initiatorName: string;
    approvalStatus: ProjectApprovalStatus;
}

const projects: Project[] = [
    {
        id: "1",
        name: "Community Garden Initiative",
        startDate: "2025-11-18",
        endDate: "2025-12-19",
        location: "Downtown Community Center",
        organisingTeam: "Green Volunteers",
        initiatorName: "John Smith",
        approvalStatus: ProjectApprovalStatus.pending,
    },
    {
        id: "2",
        name: "Food Bank Drive",
        startDate: "2025-11-18",
        endDate: "2025-12-19",
        location: "Central Food Hub",
        organisingTeam: "Care Collective",
        initiatorName: "Jane Doe",
        approvalStatus: ProjectApprovalStatus.reviewing,
    },
    {
        id: "3",
        name: "Beach Cleanup Project",
        startDate: "2025-11-18",
        endDate: "2025-12-19",
        location: "Sunset Beach",
        organisingTeam: "Ocean Warriors",
        initiatorName: "Mike Johnson",
        approvalStatus: ProjectApprovalStatus.approved,
    },
];

export default function Projects() {
    const [projectStatuses, setProjectStatuses] = useState<Record<string, ProjectApprovalStatus>>(
        projects.reduce((acc, project) => {
            acc[project.id] = project.approvalStatus;
            return acc;
        }, {} as Record<string, ProjectApprovalStatus>)
    );
    const [loading, setLoading] = useState<string | null>(null);

    const handleStatusChange = async (projectId: string, newStatus: ProjectApprovalStatus) => {
        setLoading(projectId);
    
        try {
            await changeProposedProjectStatus(projectId, newStatus);
    
            // Update local state
            setProjectStatuses(prev => ({
                ...prev,
                [projectId]: newStatus,
            }));
    
            alert("Project status updated successfully!");
        } catch (error) {
            console.error("Error updating project status:", error);
            alert("Failed to update project status. Please try again.");
        } finally {
            setLoading(null);
        }
    };

    const getStatusColor = (status: ProjectApprovalStatus) => {
        switch (status) {
            case ProjectApprovalStatus.approved:
                return "text-green-600";
            case ProjectApprovalStatus.rejected:
                return "text-red-600";
            case ProjectApprovalStatus.reviewing:
                return "text-blue-600";
            case ProjectApprovalStatus.pending:
                return "text-orange-600";
            default:
                return "text-gray-600";
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-GB");
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-5 mb-6 sm:mb-10">
                <div className="w-[5px] h-[30px] sm:h-[39px] bg-[#56E0C2]" />
                <h1 className="text-2xl sm:text-[40px] font-bold text-slate-900">Proposed Projects</h1>
            </div>

            {/* Table */}
            <div className="border border-[#195D4B] rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[#206378]">
                            <th className="px-4 py-4 text-left text-white font-bold text-sm">Projects</th>
                            <th className="px-4 py-4 text-left text-white font-bold text-sm">Time Period</th>
                            <th className="px-4 py-4 text-left text-white font-bold text-sm">Location</th>
                            <th className="px-4 py-4 text-left text-white font-bold text-sm">Organising Team</th>
                            <th className="px-4 py-4 text-left text-white font-bold text-sm">Initiator Name</th>
                            <th className="px-4 py-4 text-left text-white font-bold text-sm">Status</th>
                            <th className="px-4 py-4 text-left text-white font-bold text-sm">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {projects.map((project) => (
                            <tr
                                key={project.id}
                                className="border-b border-neutral-40 last:border-b-0 hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-4 py-4">
                                    <span className="text-sm text-[#2C89A5] font-medium">{project.name}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm text-gray-700">
                                        {formatDate(project.startDate)} - {formatDate(project.endDate)}
                                    </span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm font-bold text-gray-700">{project.location}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm font-bold text-gray-700">{project.organisingTeam}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <span className="text-sm font-bold text-gray-700">{project.initiatorName}</span>
                                </td>
                                <td className="px-4 py-4">
                                    <select
                                        value={projectStatuses[project.id]}
                                        onChange={(e) => handleStatusChange(project.id, e.target.value as ProjectApprovalStatus)}
                                        disabled={loading === project.id}
                                        className={`text-sm font-medium px-3 py-1.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#56E0C2] ${getStatusColor(projectStatuses[project.id])} ${loading === project.id ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                                            }`}
                                    >
                                        <option value={ProjectApprovalStatus.pending}>Pending</option>
                                        <option value={ProjectApprovalStatus.reviewing}>Reviewing</option>
                                        <option value={ProjectApprovalStatus.approved}>Approved</option>
                                        <option value={ProjectApprovalStatus.rejected}>Rejected</option>
                                    </select>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* Edit Icon */}
                                        <button className="hover:opacity-70 transition-opacity">
                                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.2873 0.351835L1.19785 12.4417C1.01713 12.622 0.89862 12.8552 0.859568 13.1075L0.0138559 18.6186C-0.0146819 18.8047 0.000999985 18.9949 0.0596322 19.1739C0.118264 19.3528 0.2182 19.5155 0.351352 19.6486C0.484505 19.7818 0.647134 19.8817 0.826079 19.9404C1.00502 19.999 1.19526 20.0147 1.38139 19.9861L6.89351 19.1404C7.14563 19.1017 7.37885 18.9836 7.55929 18.8033L19.6488 6.71346C19.8737 6.4885 20 6.18342 20 5.86532C20 5.54723 19.8737 5.24215 19.6488 5.01719L14.9824 0.350636C14.7575 0.126107 14.4526 0 14.1349 0C13.8171 0 13.5122 0.126107 13.2873 0.350636M2.63376 17.3674L3.17118 13.8596L14.1354 2.89505L17.1044 5.86532L6.14017 16.8299L2.63376 17.3674Z" fill="#00657A" />
                                                <path d="M11.1797 4.88601L12.4513 3.6132L16.3403 7.5L15.0676 8.77281L11.1797 4.88601Z" fill="#00657A" />
                                            </svg>
                                        </button>
                                        {/* Delete Icon */}
                                        <button className="hover:opacity-70 transition-opacity">
                                            <svg width="23" height="21" viewBox="0 0 23 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M18.8957 5.10645L17.65 17.935C17.6102 18.2972 17.4476 18.6312 17.1931 18.8735C16.9385 19.1159 16.6098 19.2497 16.2692 19.2497H6.2285C5.8879 19.2497 5.55914 19.1159 5.30461 18.8735C5.05009 18.6312 4.88749 18.2972 4.84769 17.935L3.60156 5.10645" stroke="#00657A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M20.5357 1.25H1.96429C1.5698 1.25 1.25 1.59539 1.25 2.02145V4.33581C1.25 4.76187 1.5698 5.10726 1.96429 5.10726H20.5357C20.9302 5.10726 21.25 4.76187 21.25 4.33581V2.02145C21.25 1.59539 20.9302 1.25 20.5357 1.25Z" stroke="#00657A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                <path d="M13.6043 8.96484L8.89844 15.3936M13.6043 15.3936L8.89844 8.96484" stroke="#00657A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
}
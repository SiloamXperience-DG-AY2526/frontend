'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getProjectPeerFeedback } from '@/lib/api/general/projects';
import StatsCards from "@/components/project-manager/feedback/StatsCards";
import ScoreGauge from "@/components/project-manager/feedback/ScoreGauge";
import FamousTags from "@/components/project-manager/feedback/FamousTags";
import FeedbackTable from "@/components/project-manager/feedback/FeedbackTable";

interface FeedbackTag {
    id: string;
    name: string;
    feedbackId: string;
    createdAt: string;
}

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    title: string;
}

interface FeedbackData {
    id: string;
    reviewerId: string;
    revieweeId: string;
    projectId: string;
    reviewer: User;
    reviewee: User;
    score: number;
    type: string;
    strengths: string;
    improvements: string;
    tags: FeedbackTag[];
    createdAt: string;
    updatedAt: string;
}

export default function FeedbackAnalyticsPage() {
    const params = useParams();
    const projectId = params?.projectId as string;

    console.log('Params:', params);
    console.log('Project ID:', projectId);

    const [feedbackData, setFeedbackData] = useState<FeedbackData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                setIsLoading(true);
                console.log('Fetching feedback for project:', projectId);
                const data = await getProjectPeerFeedback(projectId);
                console.log('Received data:', data);
                setFeedbackData(data);
            } catch (err) {
                console.error('Error fetching feedback:', err);
                setError('Failed to load feedback data');
            } finally {
                setIsLoading(false);
            }
        };

        if (projectId) {
            fetchFeedback();
        }
    }, [projectId]);

    const totalShown = feedbackData.length;
    const totalResponse = feedbackData.filter(f => f.score > 0).length;
    const responseRate = totalShown > 0 ? Math.round((totalResponse / totalShown) * 100) : 0;

    const averageScore = feedbackData.length > 0
        ? Math.round((feedbackData.reduce((sum, f) => sum + f.score, 0) / feedbackData.length) * 20)
        : 0;

    const tagFrequency = feedbackData.reduce((acc, feedback) => {
        feedback.tags.forEach(tag => {
            acc[tag.name] = (acc[tag.name] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const famousTags = Object.entries(tagFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 9)
        .map(([name]) => name);

    const lastUpdated = feedbackData.length > 0
        ? new Date(Math.max(...feedbackData.map(f => new Date(f.updatedAt).getTime())))
        : new Date();

    if (isLoading) {
        return (
            <main className="flex-1 lg:ml-[190px] p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#56E0C2] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading feedback...</p>
                    </div>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex-1 lg:ml-[190px] p-4 md:p-6 lg:p-8">
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <p className="text-red-600 font-medium">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 px-4 py-2 bg-[#56E0C2] text-white rounded-md hover:bg-[#45d0b2]"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            <div className="max-w-[1090px]">

                <div className="flex items-center gap-3 sm:gap-5 mb-6 sm:mb-10">
                    <div className="w-[5px] h-[30px] sm:h-[39px] bg-[#56E0C2]" />
                    <h1 className="text-2xl sm:text-[40px] font-bold text-slate-900">
                        Feedback Analytics
                    </h1>
                </div>

                <StatsCards
                    totalShown={totalShown}
                    totalResponse={totalResponse}
                    responseRate={responseRate}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <ScoreGauge
                        score={averageScore}
                    />
                    <FamousTags tags={famousTags} />
                </div>

                <FeedbackTable feedbackData={feedbackData} />
            </div>
        </main>
    );
}
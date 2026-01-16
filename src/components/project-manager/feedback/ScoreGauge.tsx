'use client';

import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
    score: number;
}

export default function ScoreGauge({ score }: ScoreGaugeProps) {
    const [animatedScore, setAnimatedScore] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedScore(score);
        }, 100);
        return () => clearTimeout(timer);
    }, [score]);

    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (animatedScore / 100) * circumference;

    // Determine color based on score
    const getScoreColor = (score: number) => {
        if (score >= 80) return '#10b981'; 
        if (score >= 60) return '#36C9A2'; 
        if (score >= 40) return '#f59e0b'; 
        return '#ef4444'; 
    };

    const getScoreLabel = (score: number) => {
        if (score >= 80) return 'Excellent';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Fair';
        return 'Needs Improvement';
    };

    return (
        <div className="border border-[#207860] rounded-2xl shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] p-6 bg-white">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#207860] text-xl font-semibold">Overall Score</h2>
            </div>

            <div className="flex flex-col items-center justify-center py-4">
                {/* Circular Progress */}
                <div className="relative w-64 h-64">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background circle */}
                        <circle
                            cx="128"
                            cy="128"
                            r={radius}
                            stroke="#E5E7EB"
                            strokeWidth="16"
                            fill="none"
                        />
                        {/* Progress circle */}
                        <circle
                            cx="128"
                            cy="128"
                            r={radius}
                            stroke={getScoreColor(score)}
                            strokeWidth="16"
                            fill="none"
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                        />
                    </svg>

                    {/* Center content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="text-6xl font-bold" style={{ color: getScoreColor(score) }}>
                            {animatedScore}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">out of 100</div>
                        <div
                            className="mt-3 px-4 py-1.5 rounded-full text-sm font-medium text-white"
                            style={{ backgroundColor: getScoreColor(score) }}
                        >
                            {getScoreLabel(score)}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
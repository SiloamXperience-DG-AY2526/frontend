'use client';

import { submitPeerFeedback } from '@/lib/api/general/projects';
import { useParams } from 'next/navigation';
import { useState } from 'react';


type FeedbackType = 'supervisor' | 'peer' | 'self';


export default function FeedbackPage() {
    const { projectId } = useParams();
    const [loading, setLoading] = useState(false);
    const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
    const [formData, setFormData] = useState({
        reviewer: '',
        reviewee: '',
        score: '',
        strengths: '',
        improvements: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!feedbackType) {
            alert('Please select a feedback type.');
            return;
        }

        if (!formData.reviewer || !formData.reviewee || !formData.score) {
            alert('Please fill in all required fields.');
            return;
        }

        setLoading(true);

        const payload = {
            feedbackType,
            reviewer: formData.reviewer.trim(),
            reviewee: formData.reviewee.trim(),
            score: parseInt(formData.score),
            strengths: formData.strengths.trim(),
            improvements: formData.improvements.trim(),
            submittedAt: new Date().toISOString(),
            projectId: String(projectId),
        };

        try {
            await submitPeerFeedback(payload);
            alert('Feedback submitted successfully!');

            setFeedbackType(null);
            setFormData({
                reviewer: '',
                reviewee: '',
                score: '',
                strengths: '',
                improvements: '',
            });
        } catch {
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center gap-3 sm:gap-5 mb-6 sm:mb-10">
                <div className="w-[5px] h-[30px] sm:h-[39px] bg-[#56E0C2]" />
                <h1 className="text-2xl sm:text-[40px] font-bold text-slate-900">Feedback Form</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                            <input
                                type="radio"
                                name="feedbackType"
                                value="supervisor"
                                checked={feedbackType === 'supervisor'}
                                onChange={() => setFeedbackType('supervisor')}
                                className="peer sr-only"
                            />
                            <div className="w-4 h-4 rounded-full border-2 border-[#195D4B] peer-checked:border-[6px] peer-checked:border-eucalyptus-100" />
                        </div>
                        <span className="text-sm font-medium text-black">Supervisor feedback</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                            <input
                                type="radio"
                                name="feedbackType"
                                value="peer"
                                checked={feedbackType === 'peer'}
                                onChange={() => setFeedbackType('peer')}
                                className="peer sr-only"
                            />
                            <div className="w-4 h-4 rounded-full border-2 border-[#195D4B] peer-checked:border-[6px] peer-checked:border-eucalyptus-100" />
                        </div>
                        <span className="text-sm font-medium text-black">Peer feedback</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                        <div className="relative">
                            <input
                                type="radio"
                                name="feedbackType"
                                value="self"
                                checked={feedbackType === 'self'}
                                onChange={() => setFeedbackType('self')}
                                className="peer sr-only"
                            />
                            <div className="w-4 h-4 rounded-full border-2 border-[#195D4B] peer-checked:border-[6px] peer-checked:border-eucalyptus-100" />
                        </div>
                        <span className="text-sm font-medium text-black">Self review</span>
                    </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-black">
                            Reviewer <span className="text-eucalyptus-100">*</span>
                        </label>
                        <input
                            type="text"
                            name="reviewer"
                            value={formData.reviewer}
                            onChange={handleInputChange}
                            placeholder="Full name of reviewer"
                            required
                            className="h-[57px] px-[30px] rounded-xl border border-[#195D4B] text-sm font-medium placeholder:text-neutral-20 focus:outline-none focus:ring-2 focus:ring-eucalyptus-100"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-black">
                            Reviewee <span className="text-eucalyptus-100">*</span>
                        </label>
                        <input
                            type="text"
                            name="reviewee"
                            value={formData.reviewee}
                            onChange={handleInputChange}
                            placeholder="Full name of reviewee"
                            required
                            className="h-[57px] px-[30px] rounded-xl border border-[#195D4B] text-sm font-medium placeholder:text-neutral-20 focus:outline-none focus:ring-2 focus:ring-eucalyptus-100"
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-bold text-black">
                            Score (out of 100) <span className="text-eucalyptus-100">*</span>
                        </label>
                        <input
                            type="number"
                            name="score"
                            value={formData.score}
                            onChange={handleInputChange}
                            placeholder="Score for reviewee"
                            min="0"
                            max="100"
                            required
                            className="h-[57px] px-[30px] rounded-xl border border-[#195D4B] text-sm font-medium placeholder:text-neutral-20 focus:outline-none focus:ring-2 focus:ring-eucalyptus-100"
                        />
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-black">Strengths</label>
                    <textarea
                        name="strengths"
                        value={formData.strengths}
                        onChange={handleInputChange}
                        placeholder="Strengths of reviewee"
                        rows={8}
                        className="w-full px-[30px] py-5 rounded-xl border border-[#195D4B] text-sm font-medium placeholder:text-neutral-20 focus:outline-none focus:ring-2 focus:ring-eucalyptus-100 resize-none"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="text-sm font-bold text-black">Areas for improvement</label>
                    <textarea
                        name="improvements"
                        value={formData.improvements}
                        onChange={handleInputChange}
                        placeholder="Areas for improvement of reviewee"
                        rows={8}
                        className="w-full px-[30px] py-5 rounded-xl border border-[#195D4B] text-sm font-medium placeholder:text-neutral-20 focus:outline-none focus:ring-2 focus:ring-eucalyptus-100 resize-none"
                    />
                </div>

                <div className="flex justify-end pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-2.5 rounded-md text-slate-50 text-base font-semibold disabled:opacity-50"
                        style={{
                            background: 'linear-gradient(90deg, #015E4B 0%, #014F5E 100%)',
                        }}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </form>
        </>
    );
}
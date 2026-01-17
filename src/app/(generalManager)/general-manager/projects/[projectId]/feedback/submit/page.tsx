'use client';

import { useState } from 'react';
import { submitPeerFeedback } from '@/lib/api/general/projects';
import { useParams } from 'next/navigation';

type FeedbackType = 'supervisor' | 'peer' | 'self';

export default function FeedbackPage() {
  const params = useParams();
  const projectId = params?.projectId as string;

  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [reviewer, setReviewer] = useState('');
  const [reviewee, setReviewee] = useState('');
  const [score, setScore] = useState(0);
  const [strengths, setStrengths] = useState('');
  const [improvements, setImprovements] = useState('');
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    if (!feedbackType) {
      alert('Please select a feedback type.');
      return;
    }
    if (!reviewer.trim() || !reviewee.trim() || !strengths.trim() || !improvements.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (score < 1 || score > 5) {
      setError('Score must be between 1 and 5.');
      return;
    }
    setError(null);

    const payload = {
      feedbackType,
      reviewer,
      reviewee,
      score,
      strengths,
      improvements,
      submittedAt: new Date().toISOString(),
      projectId,
    };

    await submitPeerFeedback(payload);
    alert('Feedback submitted successfully!');
    setFeedbackType(null);
    setReviewer('');
    setReviewee('');
    setScore(0);
    setStrengths('');
    setImprovements('');
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Feedback Form</h1>

      <div className="space-y-4">
        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        {/* Feedback Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Feedback Type <span className="text-red-600">*</span>
          </label>
          <div className="mt-2 flex gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="feedbackType"
                checked={feedbackType === 'supervisor'}
                onChange={() => setFeedbackType('supervisor')}
              />
              Supervisor feedback
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="feedbackType"
                checked={feedbackType === 'peer'}
                onChange={() => setFeedbackType('peer')}
              />
              Peer feedback
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="feedbackType"
                checked={feedbackType === 'self'}
                onChange={() => setFeedbackType('self')}
              />
              Self feedback
            </label>
          </div>
        </div>

        {/* Reviewer */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reviewer Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={reviewer}
            required
            onChange={(e) => setReviewer(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Reviewee */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Reviewee Name <span className="text-red-600">*</span>
          </label>
          <input
            type="text"
            value={reviewee}
            required
            onChange={(e) => setReviewee(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Score */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Score (1-5) <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={score}
            required
            onChange={(e) => setScore(Number(e.target.value))}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Strengths */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Strengths <span className="text-red-600">*</span>
          </label>
          <textarea
            value={strengths}
            required
            onChange={(e) => setStrengths(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
          />
        </div>

        {/* Improvements */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Improvements <span className="text-red-600">*</span>
          </label>
          <textarea
            value={improvements}
            required
            onChange={(e) => setImprovements(e.target.value)}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
            rows={3}
          />
        </div>

        <button
          onClick={onSubmit}
          className="mt-4 px-6 py-2 bg-[#56E0C2] text-white rounded-md hover:bg-[#45d0b2]"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
}

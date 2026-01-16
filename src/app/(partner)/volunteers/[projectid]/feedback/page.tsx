'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/sidebar';
import StarRating from '@/components/ui/StarRating';
import Textarea from '@/components/ui/TextArea';
import Button from '@/components/ui/Button';
import { useParams } from 'next/navigation';
import { FeedbackPayload } from '@/types/Volunteer';
import { submitVolunteerFeedback } from '@/lib/api/volunteer';
import Toast from '@/components/ui/Toast';

export default function FeedbackPage() {
  const params = useParams<{ projectid: string }>();

  const router = useRouter();

  const projectId = params.projectid;
  const [toastOpen, setToastOpen] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [toastTitle, setToastTitle] = useState('');
  const [toastMsg, setToastMsg] = useState<string | undefined>(undefined);
  const [ratings, setRatings] = useState({
    overall: 0,
    management: 0,
    planning: 0,
    facilities: 0,
  });

  const [feedback, setFeedback] = useState({
    experience: '',
    improvement: '',
    comments: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!projectId) {
      alert('Missing projectId in URL.');
      return;
    }

    // basic frontend validation
    if (
      !ratings.overall ||
      !ratings.management ||
      !ratings.planning ||
      !ratings.facilities
    ) {
      alert('Please rate all categories before submitting.');
      return;
    }

    //  validation for text fields
    if (!feedback.experience.trim() || !feedback.improvement.trim()) {
      alert('Please fill in the experience and improvement fields.');
      return;
    }

    setLoading(true);

    const payload: FeedbackPayload = {
      ratings: {
        overall: ratings.overall,
        management: ratings.management,
        planning: ratings.planning,
        facilities: ratings.facilities,
      },
      feedback: {
        experience: feedback.experience.trim(),
        improvement: feedback.improvement.trim(),
        comments: feedback.comments.trim() || undefined,
      },
   
    };

    try {
      const resp = await submitVolunteerFeedback({
        projectId,
        payload,
      });

      setToastType('success');
      setToastTitle('Application submitted');
      setToastMsg('We’ll contact you soon with the next steps.');
      setToastOpen(true);

      // reset form
      setRatings({ overall: 0, management: 0, planning: 0, facilities: 0 });
      setFeedback({ experience: '', improvement: '', comments: '' });
      setTimeout(() => {
        router.replace('/volunteers');
      }, 2000);

      console.log('Feedback response:', resp);
    } catch (e: unknown) {
      setToastType('error');
      setToastTitle('Submission failed');
      setToastMsg(`Failed to submit feedback: ${e}`);
      setToastOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <Toast
        open={toastOpen}
        type={toastType}
        title={toastTitle}
        message={toastMsg}
        duration={3500}
        onClose={() => setToastOpen(false)}
      />
      <main className="flex-1 px-10 py-8">
        <div className="mb-8 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-1" />
          <div>
            <h1 className="text-3xl font-bold">Volunteer Feedback Form</h1>
            <p className="text-sm text-gray-500">
              Track your volunteer activities, donations, and applications
            </p>
          </div>
        </div>

        {/* Rate your experience */}
        <div className="rounded-lg border bg-white p-6 mb-6">
          <h2 className="text-xl font-bold mb-1">Rate your experience</h2>
          <p className="text-sm text-gray-600 mb-6">
            Please rate the following aspects of your volunteer experience
          </p>

          {/* Overall */}
          <div className="mb-4">
            <p className="font-semibold mb-2">Overall Experience</p>
            <StarRating
              value={ratings.overall}
              onChange={(v) => setRatings({ ...ratings, overall: v })}
            />
            <hr className="mt-4 border-gray-400" />
          </div>

          {/* Management */}
          <div className="mb-4">
            <p className="font-semibold mb-2">Management Support & Guidance</p>
            <StarRating
              value={ratings.management}
              onChange={(v) => setRatings({ ...ratings, management: v })}
            />
            <hr className="mt-4 border-gray-400" />
          </div>

          {/* Organisation */}
          <div className="mb-4">
            <p className="font-semibold mb-2">Organisation & Planning</p>
            <StarRating
              value={ratings.planning}
              onChange={(v) => setRatings({ ...ratings, planning: v })}
            />
            <hr className="mt-4 border-gray-400" />
          </div>

          {/* Facilities */}
          <div>
            <p className="font-semibold mb-2">
              Facilities & Resources Provided
            </p>
            <StarRating
              value={ratings.facilities}
              onChange={(v) => setRatings({ ...ratings, facilities: v })}
            />
          </div>
        </div>

        {/* Your Feedback */}
        <div className="rounded-lg border bg-white p-6">
          <h2 className="text-xl font-bold mb-1">Your Feedback</h2>
          <p className="text-sm text-gray-500 mb-6">
            Help us understand your experience better
          </p>

          <div className="space-y-5">
            <Textarea
              label="What did you enjoy most about this volunteer experience"
              value={feedback.experience}
              onChange={(v) => setFeedback({ ...feedback, experience: v })}
            />

            <Textarea
              label="What could have made the activity better for you"
              value={feedback.improvement}
              onChange={(v) => setFeedback({ ...feedback, improvement: v })}
            />

            <Textarea
              label="Any other comments you'd like to share"
              value={feedback.comments}
              onChange={(v) => setFeedback({ ...feedback, comments: v })}
            />
          </div>
        </div>

        {/* Submit */}
        <div className="mt-6 flex justify-end">
          <Button
            label={loading ? 'Submitting...' : 'SUBMIT'}
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </main>
    </div>
  );
}

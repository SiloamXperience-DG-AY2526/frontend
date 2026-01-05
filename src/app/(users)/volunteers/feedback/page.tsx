"use client";

import { useState } from "react";
import Sidebar from "@/components/sidebar";
import StarRating from "@/components/ui/StarRating";
import Textarea from "@/components/ui/TextArea";
import Button from "@/components/ui/Button";
import { FeedbackPayload } from "@/types/Volunteer";

export default function FeedbackPage() {
  const [ratings, setRatings] = useState({
    overall: 0,
    management: 0,
    planning: 0,
    facilities: 0,
  });

  const [feedback, setFeedback] = useState({
    experience: "",
    improvement: "",
    comments: "",
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async () => {
    // basic frontend validation
    if (
      !ratings.overall ||
      !ratings.management ||
      !ratings.planning ||
      !ratings.facilities
    ) {
      alert("Please rate all categories before submitting.");
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
        comments: feedback.comments.trim(),
      },
      submittedAt: new Date().toISOString(),
    };

    try {
      // test call
      console.log("Submitting feedback payload:", payload);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      alert("Feedback submitted successfully!");

      // reset form
      setRatings({
        overall: 0,
        management: 0,
        planning: 0,
        facilities: 0,
      });

      setFeedback({
        experience: "",
        improvement: "",
        comments: "",
      });
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 px-10 py-8">
        {/* Header with green bar */}
        <div className="mb-8 flex items-start gap-3">
          <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-1" />
          <div>
            <h1 className="text-2xl font-bold">
              Volunteer <span className="bg-yellow-300 px-1">Feedback</span>{" "}
              Form
            </h1>
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
          <h2 className="text-xl font-bold mb-1">
            Your <span className="bg-yellow-300 px-1">Feedback</span>
          </h2>
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
            label={loading ? "Submitting..." : "SUBMIT"}
            onClick={handleSubmit}
            disabled={loading}
          />
        </div>
      </main>
    </div>
  );
}

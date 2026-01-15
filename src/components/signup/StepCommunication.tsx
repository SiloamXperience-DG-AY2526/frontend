"use client";

import { useState } from "react";
import { SignUpData } from "@/types/SignUpData";
import Button from "@/components/ui/Button";
import Select from "../ui/Select";
import Toast from "../ui/Toast";

type LastSignUpFormProps = {
  data: SignUpData;
  setData: (d: SignUpData) => void;
  back: () => void;
};

export default function StepCommunication({ data, setData, back }: LastSignUpFormProps) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{
    open: boolean;
    type: "success" | "error";
    title: string;
    message?: string;
  }>({ open: false, type: "error", title: "" });

  const validate = () => {
    const e: Record<string, string> = {};

    //  Required fields for submission
    if (!data.preferredContactMethod) e.preferredContactMethod = "Required";
    if (data.agreeUpdates !== true) e.agreeUpdates = "Required";

    setErrors(e);
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();

    if (Object.keys(e).length > 0) {
      // Required-first toast
      let title = "Missing information";
      let message = "Please complete the required fields to submit.";

      if (e.preferredContactMethod === "Required") {
        title = "Preferred contact required";
        message = "Please select the best way to stay in touch.";
      } else if (e.agreeUpdates === "Required") {
        title = "Consent required";
        message = "You must agree to receive updates to continue.";
      }

      setToast({ open: true, type: "error", title, message });
      return;
    }

    setLoading(true);

    try {
      const payload: SignUpData = { ...data };

      // frontend test
      console.log("Signup data:", payload);

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setToast({
        open: true,
        type: "success",
        title: "Signup complete",
        message: "Your signup was submitted successfully.",
      });
    } catch (error) {
      console.error(error);
      setToast({
        open: true,
        type: "error",
        title: "Submission failed",
        message: "There was an error submitting the form. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Toast
        open={toast.open}
        type={toast.type}
        title={toast.title}
        message={toast.message}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
      />

      <h2 className="text-3xl font-bold text-black text-center mb-2">Stay Connected</h2>
      <p className="text-sm text-gray-600 text-center mb-8">
        We promise not to spam! Just updates and opportunities that matter.
      </p>

      <div className="space-y-6">
        <Select
          label="How did you hear about us?"
          value={data.foundUsThrough || ""}
          options={["Friend", "Social Media", "Church", "Website", "Event", "Other"]}
          onChange={(v) => setData({ ...data, foundUsThrough: v })}
        />

        <Select
          label="What's the best way to stay in touch?"
          value={data.preferredContactMethod || ""}
          options={["Email", "WhatsApp", "Telegram", "Messenger", "Phone Call"]}
          onChange={(v) => {
            setData({ ...data, preferredContactMethod: v });
            if (errors.preferredContactMethod)
              setErrors((p) => ({ ...p, preferredContactMethod: "" }));
          }}
          required
          error={errors.preferredContactMethod}
        />


        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm text-black">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              checked={data.agreeUpdates === true}
              onChange={(e) => {
                setData({ ...data, agreeUpdates: e.target.checked });
                if (errors.agreeUpdates) setErrors((p) => ({ ...p, agreeUpdates: "" }));
              }}
            />
            <span>
              I agree to receive updates and communications{" "}
              <span className="text-red-600">(required)</span>
            </span>
          </label>

          {errors.agreeUpdates ? (
            <p className="text-xs text-red-600">{errors.agreeUpdates}</p>
          ) : null}

          <label className="flex items-start gap-3 text-sm text-black">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4"
              checked={data.joinMailingList === true}
              onChange={(e) => setData({ ...data, joinMailingList: e.target.checked })}
            />
            <span>
              I&apos;d like to join your mailing list for newsletters and event invitations{" "}
              <span className="text-gray-500">(optional)</span>
            </span>
          </label>
        </div>
      </div>

      <div className="mt-8 flex justify-between">
        <Button label="Back" onClick={back} />
        <Button
          label={loading ? "Submitting..." : "SUBMIT →"}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </div>
  );
}

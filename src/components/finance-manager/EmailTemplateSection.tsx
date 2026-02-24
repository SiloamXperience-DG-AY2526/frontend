"use client";

import { RefObject } from "react";
import { classNames } from "@/lib/utils/finance-manager-email/classNames";
import { insertAtCursor } from "@/lib/utils/finance-manager-email/insertAtCursor";
import { safeTextToHtml } from "@/lib/utils/finance-manager-email/text-html";
import { TemplateForm } from "@/types/EmailCampaign";

type TemplateType = "thankyou" | "receipt";

type Variable = { label: string; value: string; showIn: TemplateType | "both" };

type Props = {
  staffEmail: string;

  templateType: TemplateType;
  setTemplateType: (t: TemplateType) => void;

  templateForm: TemplateForm;
  setTemplateForm: (updater: (p: TemplateForm) => TemplateForm) => void;

  templateMessageRef: RefObject<HTMLTextAreaElement | null>;

  busy: boolean;
  onSave: () => Promise<void>;
  onReset: () => void;

  variables: Variable[];
  defaultText: Record<TemplateType, { subject: string; message: string }>;
};

export default function TemplatesSection({
  staffEmail,
  templateType,
  setTemplateType,
  templateForm,
  setTemplateForm,
  templateMessageRef,
  busy,
  onSave,
  onReset,
  variables,
  defaultText,
}: Props) {
  return (
    <section className="rounded-xl border border-[#195D4B] bg-white overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
       
      </div>

      <div className="px-5 pb-6">
        <div className="mb-4 flex items-center gap-2">
          <button type="button"
            className={classNames(
              "rounded-md px-3 py-2 text-sm font-semibold border transition",
              templateType === "thankyou"
                ? "bg-[#206378] border-[#206378] text-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
            )}
            onClick={() => setTemplateType("thankyou")}
          >
            Thank you
          </button>
          <button type="button" 
            className={classNames(
              "rounded-md px-3 py-2 text-sm font-semibold border transition",
              templateType === "receipt"
                ? "bg-[#206378] border-[#206378] text-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
            )}
            onClick={() => setTemplateType("receipt")}
          >
            Receipt
          </button>
        </div>

      <div className="mb-3 flex flex-wrap gap-2">
  {variables
    .filter((v) => v.showIn === "both" || v.showIn === templateType)
    .map((v) => (
      <button
        key={v.value}
        type="button"
        className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
        onClick={() => {
          const el = templateMessageRef.current;
          if (!el) return;

          const start = el.selectionStart ?? templateForm.message.length;
          const end = el.selectionEnd ?? templateForm.message.length;

          const next =
            templateForm.message.slice(0, start) +
            v.value +
            templateForm.message.slice(end);

          const cursor = start + v.value.length;

          setTemplateForm((p) => ({ ...p, message: next }));

          requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(cursor, cursor);
          });
        }}
      >
        Insert {v.label}
      </button>
    ))}
</div>
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <label className="block text-xs uppercase tracking-[0.16em] text-gray-500">
              Staff email
            </label>
            <input
              value={staffEmail || "Loading..."}
              readOnly
              disabled={!staffEmail}
              className="mt-2 w-full rounded-md border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-700 cursor-not-allowed"
            />

            <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-gray-500">
              Subject
            </label>
            <input
              value={templateForm.subject}
              onChange={(e) =>
                setTemplateForm((p) => ({ ...p, subject: e.target.value }))
              }
              className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            />

            <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-gray-500">
              Custom note (optional)
            </label>
            <input
              value={templateForm.customNote}
              onChange={(e) =>
                setTemplateForm((p) => ({ ...p, customNote: e.target.value }))
              }
              className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            />

            <label className="mt-4 block text-xs uppercase tracking-[0.16em] text-gray-500">
              Message
            </label>
            <textarea
              ref={templateMessageRef}
              value={templateForm.message}
              onChange={(e) =>
                setTemplateForm((p) => ({ ...p, message: e.target.value }))
              }
              rows={12}
              className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
            />

            <div className="mt-4 flex gap-2">
              <button
                disabled={busy}
                onClick={onSave}
                className={classNames(
                  "rounded-md px-4 py-2 text-sm font-semibold transition",
                  busy
                    ? "bg-gray-200 text-gray-500"
                    : "bg-[#206378] text-white hover:opacity-95",
                )}
              >
                Save template
              </button>

              <button
                onClick={onReset}
                className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
              Preview
            </p>
            <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4">
              <div className="text-sm font-semibold text-gray-900">
                {templateForm.subject}
              </div>
              <div
                className="mt-3 text-sm text-gray-700 leading-6"
                dangerouslySetInnerHTML={{
                  __html: safeTextToHtml(templateForm.message),
                }}
              />
            </div>

            <p className="mt-3 text-xs text-gray-500">
              Preview shows formatting only. Real donor values appear when sent.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  getFinanceManagerProjects,
  getDonationProjectFinance,
} from "@/lib/api/donation";
import {
  getDonationReviewTemplate,
  saveDonationReviewTemplate,
  sendDonationReviewThankYou,
  sendDonationReviewFollowUp,
  processDonationReviewReceipt,
} from "@/lib/api/emailCampaign";
import type { DonationProject } from "@/types/DonationProjectData";

type Tab = "review" | "templates";
type TemplateType = "thankyou" | "receipt";

type DonationTransaction = {
  id: string;
  date: string;
  amount: string | number;
  paymentMode: string;
  receiptStatus: "pending" | "received" | "cancelled";
  submissionStatus: "draft" | "submitted" | "withdrawn";
  isThankYouSent: boolean;
};

type TemplateForm = {
  senderAddress: string;
  subject: string;
  message: string; // plain text
  customNote: string;
};

const DEFAULT_TEXT_TEMPLATE: Record<
  TemplateType,
  Pick<TemplateForm, "subject" | "message">
> = {
  thankyou: {
    subject: "Thank you {{name}} — {{project}}",
    message:
      `Hi {{name}},\n\n` +
      `Thank you for your interest in {{project}}.\n` +
      `Amount: {{amount}}\n\n` +
      `Your payment is still being reviewed.\n\n 
       Receipt will be sent in a short while.` +
      `Regards,\nFinance Team`,
  },
  receipt: {
    subject: "Receipt {{receiptNumber}} — {{project}}",
    message:
      `Hi {{name}},\n\n` +
      `Thank you for your donation to {{project}}.\n\n` +
      `Receipt No: {{receiptNumber}}\n` +
      `Amount: {{amount}}\n` +
      `Remarks: {{remarks}}\n\n` +
      `Regards,\nFinance Team`,
  },
};

const VARIABLES: Array<{
  label: string;
  value: string;
  showIn: TemplateType | "both";
}> = [
  { label: "Donor name", value: "{{name}}", showIn: "both" },
  { label: "Project", value: "{{project}}", showIn: "both" },
  { label: "Amount", value: "{{amount}}", showIn: "both" },
  { label: "Receipt number", value: "{{receiptNumber}}", showIn: "receipt" },
  { label: "Remarks", value: "{{remarks}}", showIn: "receipt" },
];

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

function classNames(...c: Array<string | false | undefined | null>) {
  return c.filter(Boolean).join(" ");
}

function safeTextToHtml(text: string) {
  const escaped = text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
  return escaped.replaceAll("\n", "<br/>");
}

function htmlToText(html: string) {
  return (html || "")
    .replaceAll("<br/>", "\n")
    .replaceAll("<br />", "\n")
    .replaceAll("<br>", "\n")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function insertAtCursor(el: HTMLTextAreaElement, value: string) {
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? el.value.length;
  el.value = el.value.slice(0, start) + value + el.value.slice(end);
  const cursor = start + value.length;
  el.setSelectionRange(cursor, cursor);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function formatAmount(v: string | number) {
  const n = typeof v === "string" ? Number(v) : v;
  return Number.isFinite(n) ? currencyFormatter.format(n) : String(v);
}

export default function FinanceManagerReportsPage() {
  const [tab, setTab] = useState<Tab>("review");

  const [projects, setProjects] = useState<DonationProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId) ?? null,
    [projects, selectedProjectId],
  );

  const [donations, setDonations] = useState<DonationTransaction[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingDonations, setIsLoadingDonations] = useState(false);

  const [selectedTx, setSelectedTx] = useState<DonationTransaction | null>(
    null,
  );

  const [receiptNumber, setReceiptNumber] = useState("");
  const [receiptDate, setReceiptDate] = useState(() =>
    new Date().toISOString().slice(0, 10),
  );
  const [remarks, setRemarks] = useState("");

  const [templateType, setTemplateType] = useState<TemplateType>("thankyou");
  const [templateForm, setTemplateForm] = useState<TemplateForm>({
    senderAddress: "",
    subject: DEFAULT_TEXT_TEMPLATE.thankyou.subject,
    message: DEFAULT_TEXT_TEMPLATE.thankyou.message,
    customNote: "",
  });
  const templateMessageRef = useRef<HTMLTextAreaElement | null>(null);

  const [banner, setBanner] = useState<{
    type: "error" | "success";
    message: string;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  // Load projects
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoadingProjects(true);
        const res = await getFinanceManagerProjects(1, 100);
        const list = res?.projects ?? [];
        if (!mounted) return;
        setProjects(list);
        setSelectedProjectId(list[0]?.id ?? "");
      } catch (e) {
        if (!mounted) return;
        setBanner({
          type: "error",
          message: e instanceof Error ? e.message : "Failed to load projects",
        });
      } finally {
        if (!mounted) return;
        setIsLoadingProjects(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Load donations using existing getDonationProjectFinance()
  async function loadFinanceData(projectId: string) {
    setIsLoadingDonations(true);
    setBanner(null);
    setSelectedTx(null);

    try {
      const finance = await getDonationProjectFinance(projectId);
      const list = (finance.donations ?? []) as DonationTransaction[];
      setDonations(list);
    } catch (e) {
      setBanner({
        type: "error",
        message: e instanceof Error ? e.message : "Failed to load donations",
      });
      setDonations([]);
    } finally {
      setIsLoadingDonations(false);
    }
  }

  useEffect(() => {
    if (!selectedProjectId) return;
    loadFinanceData(selectedProjectId);
 
  }, [selectedProjectId]);

  // Load template when template tab changes type/project
  useEffect(() => {
    if (tab !== "templates") return;
    if (!selectedProjectId) return;

    let mounted = true;
    (async () => {
      try {
        setBusy(true);
        setBanner(null);
        const tpl = await getDonationReviewTemplate(
          selectedProjectId,
          templateType,
        );
        if (!mounted) return;

        setTemplateForm({
          senderAddress: tpl.senderAddress ?? "",
          subject: tpl.subject ?? DEFAULT_TEXT_TEMPLATE[templateType].subject,
          message: htmlToText(
            tpl.body ??
              safeTextToHtml(DEFAULT_TEXT_TEMPLATE[templateType].message),
          ),
          customNote: tpl.previewText ?? "",
        });
      } catch (e) {
        if (!mounted) return;
        setBanner({
          type: "error",
          message: e instanceof Error ? e.message : "Failed to load template",
        });
      } finally {
        if (!mounted) return;
        setBusy(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [tab, selectedProjectId, templateType]);

  const pendingDonations = useMemo(
    () =>
      donations.filter(
        (d) =>
          d.receiptStatus === "pending" && d.submissionStatus === "submitted",
      ),
    [donations],
  );

  async function refreshDonations() {
    if (!selectedProjectId) return;
    await loadFinanceData(selectedProjectId);
  }

  async function runAction(fn: () => Promise<void>, success: string) {
    if (!selectedTx) {
      setBanner({
        type: "error",
        message: "Please select a donation to review.",
      });
      return;
    }
    setBusy(true);
    setBanner(null);
    try {
      await fn();
      setBanner({ type: "success", message: success });
      await refreshDonations();
    } catch (e) {
      setBanner({
        type: "error",
        message: e instanceof Error ? e.message : "Action failed",
      });
    } finally {
      setBusy(false);
    }
  }

  async function saveTemplate() {
    if (!selectedProjectId) return;
    setBusy(true);
    setBanner(null);
    try {
      await saveDonationReviewTemplate(selectedProjectId, {
        type: templateType,
        senderAddress: templateForm.senderAddress.trim() || "finance@siloamXperience.org",
        subject: templateForm.subject,
        body: safeTextToHtml(templateForm.message),
        customNote: templateForm.customNote || null,
      });
      setBanner({ type: "success", message: "Template saved." });
    } catch (e) {
      setBanner({
        type: "error",
        message: e instanceof Error ? e.message : "Failed to save template",
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full bg-gray-50 px-6 py-8 lg:px-10">
      <header className="mb-8 flex items-start gap-3">
        <div className="w-[5px] h-[39px] bg-[#56E0C2] mt-1" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">Finance Review</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review donations, follow up on payments, and issue receipts.
          </p>
        </div>
      </header>

      {banner ? (
        <div
          className={classNames(
            "mb-6 rounded-lg border px-4 py-3 text-sm",
            banner.type === "error"
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-800",
          )}
        >
          {banner.message}
        </div>
      ) : null}

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 border-l-4 border-l-[#56E0C2]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Project
          </p>
          <div className="mt-2">
            {isLoadingProjects ? (
              <div className="text-sm text-gray-500">Loading projects...</div>
            ) : (
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#56E0C2]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            )}
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Selected:{" "}
            <span className="text-gray-700">
              {selectedProject?.title ?? "—"}
            </span>
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 border-l-4 border-l-[#56E0C2]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Menu
          </p>
          <div className="mt-3 flex gap-2">
            <button
              className={classNames(
                "rounded-md px-3 py-2 text-sm font-semibold border transition",
                tab === "review"
                  ? "bg-[#206378] border-[#206378] text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
              )}
              onClick={() => setTab("review")}
            >
              Review donations
            </button>
            <button
              className={classNames(
                "rounded-md px-3 py-2 text-sm font-semibold border transition",
                tab === "templates"
                  ? "bg-[#206378] border-[#206378] text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50",
              )}
              onClick={() => setTab("templates")}
            >
              Templates
            </button>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Review first, templates are settings.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 border-l-4 border-l-[#56E0C2]">
          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
            Needs attention
          </p>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {isLoadingDonations ? "..." : pendingDonations.length}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Pending receipts (submitted).
          </p>
        </div>
      </section>

      {tab === "review" ? (
        <section className="rounded-xl border border-[#195D4B] bg-white overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h2 className="text-lg font-semibold text-gray-900">
              Donations to review
            </h2>
            <p className="text-sm text-gray-500">
              Select a donation to send messages or issue receipts.
            </p>
          </div>

          <div className="grid gap-4 px-5 pb-6 lg:grid-cols-3">
            <div className="lg:col-span-2 rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-[#206378] text-white text-xs uppercase tracking-[0.16em]">
                    <tr>
                      <th className="px-4 py-3 font-bold">Date</th>
                      <th className="px-4 py-3 font-bold">Amount</th>
                      <th className="px-4 py-3 font-bold">Payment</th>
                      <th className="px-4 py-3 font-bold">Receipt</th>
                      <th className="px-4 py-3 font-bold">Thank you</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingDonations ? (
                      <tr>
                        <td className="px-4 py-4 text-gray-500" colSpan={5}>
                          Loading donations...
                        </td>
                      </tr>
                    ) : pendingDonations.length ? (
                      pendingDonations.map((d) => {
                        const isSelected = selectedTx?.id === d.id;
                        return (
                          <tr
                            key={d.id}
                            className={classNames(
                              "border-b border-gray-100 last:border-b-0 cursor-pointer",
                              isSelected ? "bg-emerald-50" : "hover:bg-gray-50",
                            )}
                            onClick={() => {
                              setSelectedTx(d);
                              setReceiptNumber("");
                              setRemarks("");
                              setReceiptDate(
                                new Date().toISOString().slice(0, 10),
                              );
                            }}
                          >
                            
                            <td className="px-4 py-3 text-gray-700">
                              {new Date(d.date).toLocaleString()}
                            </td>
                            <td className="px-4 py-3 font-medium text-gray-900">
                              {formatAmount(d.amount)}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {d.paymentMode}
                            </td>
                            <td className="px-4 py-3 text-gray-700 capitalize">
                              {d.receiptStatus}
                            </td>
                            <td className="px-4 py-3 text-gray-700">
                              {d.isThankYouSent ? "Sent" : "Not sent"}
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="px-4 py-4 text-gray-500" colSpan={5}>
                          No pending donations for this project.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-gray-500">
                Review actions
              </p>

              {!selectedTx ? (
                <div className="mt-3 text-sm text-gray-600">
                  Select a donation from the table to proceed.
                </div>
              ) : (
                <>
                  <div className="mt-3 rounded-lg border border-gray-200 bg-white p-3">
                    <div className="text-sm font-semibold text-gray-900">
                      Donation details
                    </div>
                    <div className="mt-2 text-sm text-gray-700">
                      <div>
                        <span className="text-gray-500">Amount:</span>{" "}
                        {formatAmount(selectedTx.amount)}
                      </div>
                      <div>
                        <span className="text-gray-500">Payment:</span>{" "}
                        {selectedTx.paymentMode}
                      </div>
                      <div>
                        <span className="text-gray-500">Date:</span>{" "}
                        {new Date(selectedTx.date).toLocaleString()}
                      </div>
                      <div className="mt-2">
                        <span className="text-gray-500">Reference:</span>
                        <div className="mt-1 rounded-md bg-gray-50 border border-gray-200 px-2 py-1 text-xs break-all">
                          {selectedTx.id}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      disabled={busy}
                      onClick={() =>
                        runAction(
                          () => sendDonationReviewThankYou(selectedTx.id),
                          "Thank you email sent.",
                        )
                      }
                      className={classNames(
                        "rounded-md px-3 py-2 text-sm font-semibold transition",
                        busy
                          ? "bg-gray-200 text-gray-500"
                          : "bg-[#206378] text-white hover:opacity-95",
                      )}
                    >
                      Send thank you
                    </button>

                    <button
                      disabled={busy}
                      onClick={() =>
                        runAction(
                          () => sendDonationReviewFollowUp(selectedTx.id),
                          "Payment reminder sent.",
                        )
                      }
                      className={classNames(
                        "rounded-md px-3 py-2 text-sm font-semibold transition border",
                        busy
                          ? "bg-gray-200 text-gray-500 border-gray-200"
                          : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50",
                      )}
                    >
                      Send follow-up
                    </button>
                  </div>

                  <div className="mt-4 rounded-lg border border-gray-200 bg-white p-3">
                    <div className="text-sm font-semibold text-gray-900">
                      Issue receipt
                    </div>

                    <label className="mt-3 block text-xs uppercase tracking-[0.16em] text-gray-500">
                      Receipt number
                    </label>
                    <input
                      value={receiptNumber}
                      onChange={(e) => setReceiptNumber(e.target.value)}
                      className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="e.g. RCP-2026-0001"
                    />

                    <label className="mt-3 block text-xs uppercase tracking-[0.16em] text-gray-500">
                      Receipt date (optional)
                    </label>
                    <input
                      type="date"
                      value={receiptDate}
                      onChange={(e) => setReceiptDate(e.target.value)}
                      className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                    />

                    <label className="mt-3 block text-xs uppercase tracking-[0.16em] text-gray-500">
                      Remarks (optional)
                    </label>
                    <input
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                      placeholder="Optional"
                    />

                    <button
                      disabled={busy || !receiptNumber.trim()}
                      onClick={() =>
                        runAction(
                          () =>
                            processDonationReviewReceipt(selectedTx.id, {
                              receiptNumber,
                              remarks: remarks || null,
                              // only send receiptDate if your backend schema accepts it.
                              // receiptDate,
                            } as any),
                          "Receipt issued and emailed.",
                        )
                      }
                      className={classNames(
                        "mt-4 w-full rounded-md px-4 py-2 text-sm font-semibold transition",
                        busy || !receiptNumber.trim()
                          ? "bg-gray-200 text-gray-500"
                          : "bg-[#206378] text-white hover:opacity-95",
                      )}
                    >
                      Confirm & send receipt
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-[#195D4B] bg-white overflow-hidden">
          <div className="px-5 pt-5 pb-3">
            <h2 className="text-lg font-semibold text-gray-900">Templates</h2>
            <p className="text-sm text-gray-500">
              Write emails like normal text. Use buttons to insert fields.
            </p>
          </div>

          <div className="px-5 pb-6">
            <div className="mb-4 flex items-center gap-2">
              <button
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
              <button
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
              {VARIABLES.filter(
                (v) => v.showIn === "both" || v.showIn === templateType,
              ).map((v) => (
                <button
                  key={v.value}
                  type="button"
                  className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    if (templateMessageRef.current)
                      insertAtCursor(templateMessageRef.current, v.value);
                  }}
                >
                  Insert {v.label}
                </button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <label className="block text-xs uppercase tracking-[0.16em] text-gray-500">
                  Sender email
                </label>
                <input
                  value={templateForm.senderAddress}
                  onChange={(e) =>
                    setTemplateForm((p) => ({
                      ...p,
                      senderAddress: e.target.value,
                    }))
                  }
                  className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
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
                    setTemplateForm((p) => ({
                      ...p,
                      customNote: e.target.value,
                    }))
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
                    onClick={saveTemplate}
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
                    onClick={() => {
                      setTemplateForm((p) => ({
                        ...p,
                        subject: DEFAULT_TEXT_TEMPLATE[templateType].subject,
                        message: DEFAULT_TEXT_TEMPLATE[templateType].message,
                      }));
                      setBanner({
                        type: "success",
                        message: "Reset to default.",
                      });
                    }}
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
                  Preview shows formatting only. Real donor values appear when
                  sent.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

"use client";

import { useMemo } from "react";
import { classNames } from "@/lib/utils/finance-manager-email/classNames";
import { formatAmount } from "@/lib/utils/finance-manager-email/formatAmount";
import { DonationTransaction } from "@/types/DonationProject";
import DonationsTable from "./DonationTable";


type Props = {
  pendingDonations: DonationTransaction[];
  isLoadingDonations: boolean;

  selectedTx: DonationTransaction | null;
  setSelectedTx: (tx: DonationTransaction | null) => void;

  receiptNumber: string;
  setReceiptNumber: (v: string) => void;

  receiptDate: string;
  setReceiptDate: (v: string) => void;

  remarks: string;
  setRemarks: (v: string) => void;

  busy: boolean;

  onSendThankYou: () => Promise<void>;
  onSendFollowUp: () => Promise<void>;
  onProcessReceipt: () => Promise<void>;
};

export default function ReviewDonationsSection({
  pendingDonations,
  isLoadingDonations,
  selectedTx,
  setSelectedTx,
  receiptNumber,
  setReceiptNumber,
  receiptDate,
  setReceiptDate,
  remarks,
  setRemarks,
  busy,
  onSendThankYou,
  onSendFollowUp,
  onProcessReceipt,
}: Props) {
  return (
    <section className="rounded-xl border border-[#195D4B] bg-white overflow-hidden">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-lg font-semibold text-gray-900">Donations to review</h2>
        <p className="text-sm text-gray-500">
          Select a donation to send messages or issue receipts.
        </p>
      </div>

      <div className="grid gap-4 px-5 pb-6 lg:grid-cols-3">
        <DonationsTable
          rows={pendingDonations}
          isLoading={isLoadingDonations}
          selectedTxId={selectedTx?.id}
          onSelect={(d) => {
            setSelectedTx(d);
            setReceiptNumber("");
            setRemarks("");
            setReceiptDate(new Date().toISOString().slice(0, 10));
          }}
        />

        {/* Actions panel */}
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
                <div className="text-sm font-semibold text-gray-900">Donation details</div>
                <div className="mt-2 text-sm text-gray-700">
                  <div>
                    <span className="text-gray-500">Amount:</span>{" "}
                    {formatAmount(selectedTx.amount as any)}
                  </div>
                  <div>
                    <span className="text-gray-500">Payment:</span>{" "}
                    {(selectedTx as any).paymentMode}
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
                  onClick={onSendThankYou}
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
                  onClick={onSendFollowUp}
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
                <div className="text-sm font-semibold text-gray-900">Issue receipt</div>

                <label className="mt-3 block text-xs uppercase tracking-[0.16em] text-gray-500">
                  Receipt number *
                </label>
                <input
                  value={receiptNumber}
                  required
                  onChange={(e) => setReceiptNumber(e.target.value)}
                  className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm"
                  placeholder="e.g. RCP-2026-0001"
                />

                <label className="mt-3 block text-xs uppercase tracking-[0.16em] text-gray-500">
                  Receipt date *
                </label>
                <input
                  type="date"
                  required
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
                  disabled={busy || !receiptNumber.trim() || !receiptDate}
                  onClick={onProcessReceipt}
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
  );
}
'use client';

import { classNames } from '@/lib/utils/finance-manager-email/classNames';
import { formatAmount } from '@/lib/utils/finance-manager-email/formatAmount';
import { DonationTransaction } from '@/types/DonationProject';

type Props = {
  rows: DonationTransaction[];
  isLoading: boolean;
  selectedTxId?: string | null;
  onSelect: (tx: DonationTransaction) => void;
};

export default function DonationsTable({
  rows,
  isLoading,
  selectedTxId,
  onSelect,
}: Props) {
  return (
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
            {isLoading ? (
              <tr>
                <td className="px-4 py-4 text-gray-500" colSpan={5}>
                  Loading donations...
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((d) => {
                const isSelected = selectedTxId === d.id;
                return (
                  <tr
                    key={d.id}
                    className={classNames(
                      'border-b border-gray-100 last:border-b-0 cursor-pointer',
                      isSelected ? 'bg-emerald-50' : 'hover:bg-gray-50',
                    )}
                    onClick={() => onSelect(d)}
                  >
                    <td className="px-4 py-3 text-gray-700">
                      {new Date(d.date).toLocaleString()}
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">
                      {formatAmount(d.amount)}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{d.paymentMode}</td>
                    <td className="px-4 py-3 text-gray-700 capitalize">
                      {d.receiptStatus}
                    </td>
                    <td className="px-4 py-3 text-gray-700">
                      {d.isThankYouSent ? 'Sent' : 'Not sent'}
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
  );
}
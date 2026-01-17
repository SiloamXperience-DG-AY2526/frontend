'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { getMyDonations } from '@/lib/api/donation';
import { DonationApplication } from '@/types/DonationData';
import { StatusBadge } from './ui';
import {
  CalendarDaysIcon,
  MapPinIcon,
  BanknotesIcon,
  CreditCardIcon,
} from '@heroicons/react/24/outline';

type DonationWithProject = DonationApplication & {
  project?: {
    id: string;
    title: string;
    location: string;
    image: string | null;
    type: string;
    brickSize: string | null;
  };
};

export default function DonationsTab() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<DonationWithProject[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyDonations('all', 1, 20);
        if (mounted) setItems(data.donations || []);
      } catch (e: unknown) {
        if (!mounted) return;
        const msg = e instanceof Error ? e.message : 'Failed to load donations';
        setError(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo(() => {
    return items.map((donation) => {
      const isReceived = donation.receiptStatus === 'received';
      const status = isReceived
        ? { label: 'Completed', tone: 'completed' as const }
        : donation.submissionStatus === 'cancelled'
          ? { label: 'Cancelled', tone: 'pending' as const }
          : { label: 'Pending receipt', tone: 'pending' as const };

      const amount =
        typeof donation.amount === 'string'
          ? parseFloat(donation.amount)
          : donation.amount;

      return {
        donation,
        status,
        amount: Number.isFinite(amount) ? amount : 0,
      };
    });
  }, [items]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-SG', {
      style: 'currency',
      currency: 'SGD',
    }).format(amount);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-600">{error}</div>;
  }

  if (!rows.length) {
    return (
      <div className="text-sm text-gray-500">No donation records yet.</div>
    );
  }

  return (
    <div className="space-y-5">
      {rows.map(({ donation, status, amount }) => (
        <div
          key={donation.id}
          className="w-full rounded-xl border border-black bg-white px-6 py-7 shadow-sm"
        >
          <div className="flex items-start justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-black mb-2">
                {donation.project?.title || 'Donation'}
              </h3>

              <div className="mt-4 space-y-3 text-sm text-black">
                {donation.project?.location && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="h-4 w-4 text-black" />
                    <span>{donation.project.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BanknotesIcon className="h-4 w-4 text-black" />
                  <span>{formatCurrency(amount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCardIcon className="h-4 w-4 text-black" />
                  <span>{donation.paymentMode}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CalendarDaysIcon className="h-4 w-4 text-black" />
                  <span>
                    {new Date(donation.createdAt).toLocaleDateString(
                      undefined,
                      {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      }
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <StatusBadge label={status.label} tone={status.tone} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

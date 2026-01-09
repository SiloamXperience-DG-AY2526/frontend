'use client';

import React, { useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/solid';

export type ToastType = 'success' | 'error';

export default function Toast({
  open,
  type,
  title,
  message,
  duration = 3000,
  onClose,
}: {
  open: boolean;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number; // ms
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  if (!open) return null;

  const isSuccess = type === 'success';
  const Icon = isSuccess ? CheckCircleIcon : XCircleIcon;

  return (
    <div className="fixed right-6 top-6 z-50">
      <div
        className={`
          w-[360px] rounded-xl border px-4 py-3 shadow-lg
          bg-white
          ${isSuccess ? 'border-green-200' : 'border-red-200'}
        `}
      >
        <div className="flex items-start gap-3">
          <Icon
            className={`h-6 w-6 ${
              isSuccess ? 'text-green-600' : 'text-red-600'
            }`}
          />

          <div className="flex-1">
            <div className="text-sm font-bold text-gray-900">{title}</div>
            {message ? (
              <div className="mt-1 text-sm text-gray-600 leading-5">
                {message}
              </div>
            ) : null}
          </div>

          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  );
}

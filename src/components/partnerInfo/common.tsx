'use client';

import { useEffect, useRef, useState } from 'react';

export function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="bg-[#2C8794] px-5 py-3 text-sm font-semibold text-white">
        {title}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

export function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[240px_1fr] gap-x-10 py-2 text-sm">
      <div className="font-semibold text-gray-700">{label}</div>
      <div className="text-gray-600">{value}</div>
    </div>
  );
}

export function InterestRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[1fr_140px] gap-x-10 py-2 text-sm">
      <div className="text-gray-700">{label}</div>
      <div className="text-gray-600">{value}</div>
    </div>
  );
}

export function PopoverSelect({
  value,
  placeholder,
  options,
  onChange,
  align = 'left',
  disabled = false,
}: {
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
  align?: 'left' | 'right';
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    return () => window.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block w-full">
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          setOpen((v) => !v);
        }}
        className={[
          'w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-left text-sm',
          'hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#56E0C2]/40',
          disabled ? 'cursor-not-allowed bg-gray-50 text-gray-300' : '',
          value ? 'text-gray-700' : 'text-gray-300',
        ].join(' ')}
        aria-disabled={disabled}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="truncate">{value || placeholder}</span>
          <span className="text-gray-400">⌄</span>
        </div>
      </button>

      {open && !disabled && (
        <ul
          className={[
            'absolute z-20 mt-2 min-w-[180px] rounded-md border border-gray-200 bg-white py-1 shadow-lg',
            align === 'right' ? 'right-0' : 'left-0',
          ].join(' ')}
        >
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={[
                  'w-full px-4 py-2 text-left text-sm',
                  'hover:bg-gray-50',
                  opt === value ? 'text-gray-900' : 'text-gray-700',
                ].join(' ')}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}



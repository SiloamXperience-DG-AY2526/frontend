'use client';

import Link from 'next/link';
import { useState } from 'react';

type NavItem = { label: string; href: string };

export default function Navbar({
  items = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact Us', href: '/contact' },
  ],
}: {
  items?: NavItem[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0  border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className=" max-w-6xl px-4 py-4 sm:px-6 md:px-12">
        <div className="flex items-center justify-between">
          {/* LEFT GROUP: Brand + Desktop links */}
          <div className="flex items-center gap-10">
            <Link href="/" className="font-bold text-gray-900 text-lg">
              SiloamXperience
            </Link>

            {/* Desktop links (LEFT, beside brand) */}
            <ul className="hidden items-center gap-10 text-md font-semibold text-gray-900 md:flex">
              {items.map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    className="hover:text-[#1F7A67] transition"
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT GROUP: Hamburger (mobile only) */}
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 active:scale-[0.99] transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7H20M4 12H20M4 17H20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="md:hidden mt-3 rounded-xl border border-gray-200 bg-white shadow-sm">
            <ul className="flex flex-col p-2 text-sm font-bold text-gray-900">
              {items.map((i) => (
                <li key={i.href}>
                  <Link
                    href={i.href}
                    className="block rounded-lg px-3 py-2 hover:bg-[#F2FBF8] hover:text-[#1F7A67] transition"
                    onClick={() => setOpen(false)}
                  >
                    {i.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

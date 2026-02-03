'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  HomeIcon,
  HeartIcon,
  UserIcon,
  HandRaisedIcon,
  ClipboardDocumentListIcon,
  ArrowLeftStartOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Toast from '@/components/ui/Toast';

const menu = [
  { name: 'Home', icon: HomeIcon, href: '/partner/home' },
  { name: 'Volunteer', icon: HandRaisedIcon, href: '/partner/volunteers' },
  { name: 'Donate', icon: HeartIcon, href: '/partner/donations' },
  { name: 'My Contributions', icon: ClipboardDocumentListIcon, href: '/partner/contributions' },
  { name: 'My Profile', icon: UserIcon, href: '/partner/profile' },
];

export default function PartnerSidebar() {
  const router = useRouter();
  const { authLogout } = useAuth();
  const [toast, setToast] = useState<{ open: boolean; title: string }>({ open: false, title: '' });

  const handleLogout = async () => {
    await authLogout();
    setToast({ open: true, title: 'Logged out successfully' });
    setTimeout(() => router.push('/login'), 800);
  };

  return (
    <aside className="hidden md:flex w-64 bg-[#195D4B] text-white flex-col py-5">
      <Toast open={toast.open} type="success" title={toast.title} onClose={() => setToast({ open: false, title: '' })} />
      <div className="px-6 py-5 text-lg font-semibold">PARTNER</div>

      <nav className="flex-1 space-y-1 px-3">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm uppercase tracking-wide hover:bg-emerald-800 transition"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="px-3">
        <button 
          type="button" 
          className='flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-emerald-800 hover:cursor-pointer transition w-full text-left'
          onClick={handleLogout}
        >
          <ArrowLeftStartOnRectangleIcon className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}

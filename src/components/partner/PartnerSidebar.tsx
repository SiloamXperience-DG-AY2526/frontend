'use client';

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

const menu = [
  { name: 'Home', icon: HomeIcon, href: '/' },
  { name: 'Volunteer', icon: HandRaisedIcon, href: '/volunteers' },
  { name: 'Donate', icon: HeartIcon, href: '/donate' },
  { name: 'My Contributions', icon: ClipboardDocumentListIcon, href: '/contributions' },
  { name: 'My Profile', icon: UserIcon, href: '/partner/profile' },
];

export default function PartnerSidebar() {

  const router = useRouter();
  const { authLogout } = useAuth();

  const handleLogout = async () => {
    await authLogout();
    router.push('/login');
    alert('Logged out successfully');
  };

  return (
    <aside className="hidden md:flex w-64 bg-[#195D4B] text-white flex-col py-5">
      <div className="px-6 py-5 text-lg font-semibold">PARTNER</div>

      <nav className="flex-1 space-y-1 px-3">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-emerald-800 transition"
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

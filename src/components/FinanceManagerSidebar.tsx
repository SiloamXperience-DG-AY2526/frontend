'use client';

import Link from 'next/link';
import {
  HomeIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const menu = [
  { name: 'Dashboard', icon: HomeIcon, href: '/finance-manager/home' },
  { name: 'Donors', icon: CurrencyDollarIcon, href: '/finance-manager/donors' },
  { name: 'Projects', icon: ChartBarIcon, href: '/finance-manager/projects' },
  { name: 'Reports', icon: DocumentTextIcon, href: '/finance-manager/reports' },
  { name: 'My Profile', icon: UserGroupIcon, href: '/finance-manager/profile' },
];

export default function FinanceManagerSidebar() {
  return (
    <aside className="hidden md:flex w-64 bg-[#195D4B] text-white flex-col">
      <div className="px-6 py-5 text-lg font-semibold">DASHBOARD</div>

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
    </aside>
  );
}

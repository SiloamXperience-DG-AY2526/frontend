'use client';

import { usePathname } from 'next/navigation';

export type ManagerScope = 'general' | 'finance';

export function useManagerBasePath(scope: ManagerScope) {
  const pathname = usePathname() ?? '';

  if (pathname.startsWith('/super-admin')) {
    return '/super-admin';
  }

  return scope === 'finance' ? '/finance-manager' : '/general-manager';
}

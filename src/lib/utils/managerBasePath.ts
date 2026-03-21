'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/AuthData';

export type ManagerScope = 'general' | 'finance';

export function useManagerBasePath(scope: ManagerScope) {
  const { user } = useAuth();
  const pathname = usePathname() ?? '';

  if (user?.role === UserRole.SUPER_ADMIN) {
    return '/super-admin';
  }

  if (user?.role === UserRole.SUB_ADMIN) {
    return '/sub-admin';
  }

  if (user?.role === UserRole.FINANCE_MANAGER) {
    return '/finance-manager';
  }

  if (user?.role === UserRole.GENERAL_MANAGER) {
    return '/general-manager';
  }

  if (pathname.startsWith('/super-admin')) {
    return '/super-admin';
  }

  if (pathname.startsWith('/sub-admin')) {
    return '/sub-admin';
  }

  return scope === 'finance' ? '/finance-manager' : '/general-manager';
}

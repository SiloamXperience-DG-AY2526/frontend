'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import UnauthorizedAccessCard from '@/components/UnauthorizedAccessCard';

export default function FinanceManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading, authRefresh } = useAuth();
  const [authError, setAuthError] = useState(false);

  useEffect(() => {
    // Refresh auth on mount to ensure we have the latest user data
    authRefresh().catch(() => {
      setAuthError(true);
    });
  }, [authRefresh]);

  // Compute authorization status directly from user and isLoading
  const isAuthorized = user
    ? user.role === 'financeManager' || user.role === 'superAdmin'
    : false;

  // Show loading state while checking authorization
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized page if authentication failed or user doesn't have proper role
  if (authError || !isAuthorized) {
    return <UnauthorizedAccessCard />;
  }

  // User is authorized, render the children
  return <>{children}</>;
}

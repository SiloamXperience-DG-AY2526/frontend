'use client';

import Button from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-slate-900">Unauthorized</h1>
        <p className="mt-2 text-sm text-slate-600">
          Sorry! You don’t have permission to access this page.
        </p>

        <div className="mt-6 flex gap-3">
          <Button label="Back" onClick={() => router.back()} />
        </div>
      </div>
    </div>
  );
}

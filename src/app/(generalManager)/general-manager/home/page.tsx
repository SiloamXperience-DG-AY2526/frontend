'use client';

import GeneralManagerSidebar from '@/components/general-manager/GeneralManagerSidebar';

export default function GeneralManagerHomePage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <GeneralManagerSidebar />

      <main className="flex-1 px-10 py-8">General Manager Home page</main>
    </div>
  );
}

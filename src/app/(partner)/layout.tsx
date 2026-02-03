import PartnerSidebar from '@/components/partner/PartnerSidebar';
import { getUserCredentialsServer } from '@/lib/api/auth.server';
import { UserRole } from '@/types/AuthData';
import { redirect } from 'next/navigation';

export default async function PartnerLayout({ children }: { children: React.ReactNode }) {

  const { role, hasOnboarded } = await getUserCredentialsServer();

  if (!role) redirect('/login');

  if (role !== UserRole.PARTNER) redirect('/unauthorized');

  // Redirect to onboarding if user hasn't completed it
  if (!hasOnboarded) redirect('/onboarding');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <PartnerSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
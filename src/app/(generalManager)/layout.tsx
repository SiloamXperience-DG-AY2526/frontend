import GeneralManagerSidebar from '@/components/general-manager/GeneralManagerSidebar';
import { getUserCredentialsServer } from '@/lib/api/auth.server';
import { UserRole } from '@/types/AuthData';
import { redirect } from 'next/navigation';

export default async function GeneralManagerLayout({ children }: { children: React.ReactNode }) {

  const { role } = await getUserCredentialsServer();

  if (!role) redirect('/login');

  if (role !== UserRole.GENERAL_MANAGER) redirect('/unauthorized');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <GeneralManagerSidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
import SubAdminSidebar from '@/components/sub-admin/SubAdminSidebar';
import { getUserCredentialsServer } from '@/lib/api/auth.server';
import { UserRole } from '@/types/AuthData';
import { redirect } from 'next/navigation';

export default async function SubAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { role } = await getUserCredentialsServer();

  if (!role) redirect('/login');

  if (role !== UserRole.SUB_ADMIN) redirect('/unauthorized');

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <SubAdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

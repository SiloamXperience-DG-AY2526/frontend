import Sidebar from '@/components/sidebar';
import { getUserCredentialsServer } from '@/lib/api/auth.server';
import { UserRole } from '@/types/AuthData';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const { role } = await getUserCredentialsServer();

    if (!role) redirect('/login');

    if (role !== UserRole.PROJECT_MANAGER) redirect('/unauthorized');


    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <main className="flex-1 px-10 py-10">
                {children}
            </main>
        </div>
    );
}
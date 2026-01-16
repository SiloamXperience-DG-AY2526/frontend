import PartnerSidebar from '@/components/partner/PartnerSidebar';

export default function PartnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <PartnerSidebar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}
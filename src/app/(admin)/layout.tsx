import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getAdminSessionEmail } from '@/lib/auth/admin';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminEmail = await getAdminSessionEmail();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar adminEmail={adminEmail} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}

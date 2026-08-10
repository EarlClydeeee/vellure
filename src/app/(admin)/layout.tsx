import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { getAppSession } from '@/lib/auth/session';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAppSession();
  const adminEmail = session.role === 'admin' ? session.email : null;

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar adminEmail={adminEmail} sessionRole={session.role} />
      <main className="flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}

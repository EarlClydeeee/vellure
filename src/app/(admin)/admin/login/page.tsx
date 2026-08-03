import { Metadata } from 'next';
import { AdminLoginForm } from '@/components/admin/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Admin Login - Vellure',
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <AdminLoginForm />
    </div>
  );
}

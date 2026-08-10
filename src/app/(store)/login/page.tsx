import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { getAppSession } from '@/lib/auth/session';
import { LoginForm } from '@/components/store/LoginForm';

interface LoginPageProps {
  searchParams: Promise<{ returnTo?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { returnTo } = await searchParams;
  const session = await getAppSession();

  if (session.role === 'admin') {
    redirect('/admin/dashboard');
  }

  if (session.role === 'customer') {
    redirect(returnTo && returnTo.startsWith('/') ? returnTo : '/');
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Log in to your Vellure account
          </p>
        </div>
        <Suspense fallback={<p className="text-center text-muted-foreground">Loading...</p>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}

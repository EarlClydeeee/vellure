import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { SignupForm } from '@/components/store/SignupForm';

export default async function SignupPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/');
  }

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Create an Account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join Vellure to start shopping
          </p>
        </div>
        <Suspense fallback={<p className="text-center text-muted-foreground">Loading...</p>}>
          <SignupForm />
        </Suspense>
      </div>
    </div>
  );
}

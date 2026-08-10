import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AccountProfilePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?returnTo=/account/profile');

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Profile</h2>
      <div className="rounded-lg border p-6 space-y-4 max-w-md">
        <div>
          <p className="text-sm text-muted-foreground">Full Name</p>
          <p className="font-medium">{customer?.full_name ?? '—'}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p className="font-medium">{user.email}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Contact Number</p>
          <p className="font-medium">{customer?.contact_number ?? '—'}</p>
        </div>
      </div>
    </div>
  );
}

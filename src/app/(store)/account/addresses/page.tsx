import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCustomerAddresses } from '@/lib/services/addresses';
import { AddressForm } from '@/components/store/AddressForm';
import { Badge } from '@/components/ui/badge';
import { DeleteAddressButton } from '@/components/store/DeleteAddressButton';

export default async function AccountAddressesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login?returnTo=/account/addresses');

  const result = await getCustomerAddresses(user.id);
  const addresses = result.success ? result.data : [];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Saved Addresses</h2>

      {addresses.length > 0 && (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:justify-between sm:gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{addr.label}</p>
                  {addr.isDefault && <Badge variant="secondary">Default</Badge>}
                </div>
                <p className="text-sm">{addr.fullName}</p>
                <p className="text-sm text-muted-foreground">{addr.addressLine}</p>
                <p className="text-sm text-muted-foreground">{addr.contactNumber}</p>
              </div>
              <DeleteAddressButton addressId={addr.id} />
            </div>
          ))}
        </div>
      )}

      <div className="rounded-lg border p-6 max-w-lg">
        <h3 className="font-medium mb-4">Add New Address</h3>
        <AddressForm />
      </div>
    </div>
  );
}

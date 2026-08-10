'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { addressSchema } from '@/lib/validation/schemas';
import { createAddressAction } from '@/app/(store)/actions';
import { deliveryZones } from '@/lib/data/marketing-content';
import { useRouter } from 'next/navigation';

export function AddressForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    label: 'Home',
    fullName: '',
    contactNumber: '',
    addressLine: '',
    shippingZone: 'ncr' as const,
    isDefault: false,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const parsed = addressSchema.safeParse(form);
    if (!parsed.success) {
      setError('Please fill in all required fields');
      return;
    }

    startTransition(async () => {
      const result = await createAddressAction(parsed.data);
      if (!result.success) {
        setError(result.error);
      } else {
        router.refresh();
        setForm({
          label: 'Home',
          fullName: '',
          contactNumber: '',
          addressLine: '',
          shippingZone: 'ncr',
          isDefault: false,
        });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="space-y-2">
        <Label>Label</Label>
        <Input
          value={form.label}
          onChange={(e) => setForm({ ...form, label: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Full Name</Label>
        <Input
          value={form.fullName}
          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Contact Number</Label>
        <Input
          value={form.contactNumber}
          onChange={(e) => setForm({ ...form, contactNumber: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Address</Label>
        <Input
          value={form.addressLine}
          onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label>Region</Label>
        <Select
          value={form.shippingZone}
          onValueChange={(v) =>
            setForm({ ...form, shippingZone: v as typeof form.shippingZone })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {deliveryZones.map((z) => (
              <SelectItem key={z.id} value={z.id}>
                {z.zone}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Address'}
      </Button>
    </form>
  );
}

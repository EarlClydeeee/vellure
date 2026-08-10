'use client';

import { useTransition } from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAddressAction } from '@/app/(store)/actions';
import { useRouter } from 'next/navigation';

export function DeleteAddressButton({ addressId }: { addressId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteAddressAction(addressId);
      router.refresh();
    });
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleDelete} disabled={isPending}>
      <Trash2 className="h-4 w-4 text-destructive" />
    </Button>
  );
}

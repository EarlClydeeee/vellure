'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { confirmPaymentAction } from '@/app/(admin)/actions';

export function ConfirmPaymentButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await confirmPaymentAction(orderId);
      router.refresh();
    });
  }

  return (
    <Button onClick={handleConfirm} disabled={isPending} size="sm">
      {isPending ? 'Confirming...' : 'Confirm Payment'}
    </Button>
  );
}

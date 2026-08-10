'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { updateReturnStatusAction } from '@/app/(admin)/actions';

export function ReturnActions({ returnId }: { returnId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handle(status: 'approved' | 'rejected') {
    startTransition(async () => {
      await updateReturnStatusAction(returnId, status);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" disabled={isPending} onClick={() => handle('approved')}>
        Approve
      </Button>
      <Button size="sm" variant="outline" disabled={isPending} onClick={() => handle('rejected')}>
        Reject
      </Button>
    </div>
  );
}

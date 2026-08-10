'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { createReturnRequestAction } from '@/app/(store)/actions';
import { useRouter } from 'next/navigation';

interface ReturnRequestFormProps {
  orderId: string;
}

export function ReturnRequestForm({ orderId }: ReturnRequestFormProps) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    startTransition(async () => {
      const result = await createReturnRequestAction({ orderId, reason });
      if (!result.success) {
        setError(result.error);
      } else {
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-4">
      <h3 className="font-medium">Request Return</h3>
      <p className="text-sm text-muted-foreground">
        Returns accepted within 7 days of delivery for completed orders.
      </p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="space-y-2">
        <Label htmlFor="reason">Reason for return</Label>
        <Textarea
          id="reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe the issue..."
          rows={4}
        />
      </div>
      <Button type="submit" variant="outline" disabled={isPending}>
        {isPending ? 'Submitting...' : 'Submit Return Request'}
      </Button>
    </form>
  );
}

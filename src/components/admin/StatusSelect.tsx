'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateOrderStatusAction } from '@/app/(admin)/actions';
import { OrderStatus } from '@/lib/types';

const ORDER_STATUSES: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Shipped',
  'Completed',
  'Cancelled',
];

interface StatusSelectProps {
  orderId: string;
  currentStatus: OrderStatus;
}

export function StatusSelect({ orderId, currentStatus }: StatusSelectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleChange(value: string) {
    setLoading(true);
    await updateOrderStatusAction(orderId, value as OrderStatus);
    setLoading(false);
    router.refresh();
  }

  return (
    <Select defaultValue={currentStatus} onValueChange={handleChange} disabled={loading}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select status" />
      </SelectTrigger>
      <SelectContent>
        {ORDER_STATUSES.map((status) => (
          <SelectItem key={status} value={status}>
            {status}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

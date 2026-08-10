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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { updateOrderStatusAction, shipOrderAction } from '@/app/(admin)/actions';
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
  const [trackingNumber, setTrackingNumber] = useState('');
  const [showTracking, setShowTracking] = useState(false);

  async function handleChange(value: string) {
    if (value === 'Shipped') {
      setShowTracking(true);
      return;
    }
    setLoading(true);
    await updateOrderStatusAction(orderId, value as OrderStatus);
    setLoading(false);
    router.refresh();
  }

  async function handleShip() {
    if (!trackingNumber.trim()) return;
    setLoading(true);
    await shipOrderAction(orderId, trackingNumber.trim());
    setLoading(false);
    setShowTracking(false);
    router.refresh();
  }

  return (
    <div className="space-y-3">
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

      {showTracking && (
        <div className="flex gap-2">
          <Input
            placeholder="Tracking number"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
          />
          <Button size="sm" onClick={handleShip} disabled={loading}>
            Ship
          </Button>
        </div>
      )}
    </div>
  );
}

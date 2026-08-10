'use client';

import type { OrderStatus } from '@/lib/types';
import { CheckCircle, Circle, Package, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS: { status: OrderStatus; label: string; icon: typeof Circle }[] = [
  { status: 'Pending', label: 'Order Placed', icon: Circle },
  { status: 'Confirmed', label: 'Confirmed', icon: CheckCircle },
  { status: 'Preparing', label: 'Preparing', icon: Package },
  { status: 'Shipped', label: 'Shipped', icon: Truck },
  { status: 'Completed', label: 'Delivered', icon: CheckCircle },
];

const STATUS_ORDER: OrderStatus[] = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Shipped',
  'Completed',
];

interface OrderTrackingTimelineProps {
  status: OrderStatus;
  trackingNumber?: string | null;
}

export function OrderTrackingTimeline({
  status,
  trackingNumber,
}: OrderTrackingTimelineProps) {
  if (status === 'Cancelled') {
    return (
      <p className="text-sm text-destructive">This order was cancelled.</p>
    );
  }

  const currentIndex = STATUS_ORDER.indexOf(status);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        {STEPS.map((step, index) => {
          const done = index <= currentIndex;
          const Icon = step.icon;
          return (
            <div key={step.status} className="flex items-center gap-2 sm:flex-col sm:text-center">
              <Icon
                className={cn(
                  'h-5 w-5',
                  done ? 'text-green-600' : 'text-muted-foreground'
                )}
              />
              <span
                className={cn(
                  'text-xs font-medium',
                  done ? 'text-foreground' : 'text-muted-foreground'
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
      {trackingNumber && (
        <p className="text-sm">
          Tracking number:{' '}
          <span className="font-mono font-medium">{trackingNumber}</span>
        </p>
      )}
    </div>
  );
}

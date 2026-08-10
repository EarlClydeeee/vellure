import { notFound } from 'next/navigation';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getOrderById } from '@/lib/services/orders';
import { getReturnByOrder } from '@/lib/services/returns';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/format-price';
import { OrderTrackingTimeline } from '@/components/store/OrderTrackingTimeline';
import { ReturnRequestForm } from '@/components/store/ReturnRequestForm';
import { ReviewForm } from '@/components/store/ReviewForm';
import { Button } from '@/components/ui/button';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AccountOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect(`/login?returnTo=/account/orders/${id}`);

  const result = await getOrderById(id);
  if (!result.success || !result.data || result.data.customerId !== user.id) {
    notFound();
  }

  const order = result.data;
  const returnResult = await getReturnByOrder(id);
  const returnRequest = returnResult.success ? returnResult.data : null;

  const daysSinceOrder =
    (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24);
  const canReturn =
    order.status === 'Completed' &&
    daysSinceOrder <= 7 &&
    !returnRequest;

  const firstProductId = order.items?.[0]?.productId;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold">Order #{order.orderNumber}</h2>
        <Badge variant="outline">{order.status}</Badge>
        {order.paymentStatus && (
          <Badge variant="secondary">{order.paymentStatus}</Badge>
        )}
      </div>

      <div className="rounded-lg border p-6">
        <h3 className="font-medium mb-4">Tracking</h3>
        <OrderTrackingTimeline
          status={order.status}
          trackingNumber={order.trackingNumber}
        />
      </div>

      <div className="rounded-lg border p-6 space-y-3">
        <h3 className="font-medium">Items</h3>
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>
              {item.productName} x {item.quantity}
            </span>
            <span>{formatPrice(item.subtotal)}</span>
          </div>
        ))}
        <div className="border-t pt-2 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.shippingFee > 0 && (
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(order.shippingFee)}</span>
            </div>
          )}
          {order.discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({order.promoCode})</span>
              <span>-{formatPrice(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {returnRequest && (
        <div className="rounded-lg border p-4">
          <p className="font-medium">Return Request</p>
          <p className="text-sm text-muted-foreground">Status: {returnRequest.status}</p>
        </div>
      )}

      {canReturn && <ReturnRequestForm orderId={order.id} />}

      {order.status === 'Completed' && firstProductId && (
        <ReviewForm productId={firstProductId} orderId={order.id} />
      )}

      <Link href="/account/orders">
        <Button variant="outline">Back to Orders</Button>
      </Link>
    </div>
  );
}

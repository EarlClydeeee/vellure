import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { OrderStatus } from '@/lib/types';

export async function sendOrderStatusEmail(params: {
  orderId: string;
  customerId: string;
  email: string;
  eventType: string;
  orderNumber: number;
  status: OrderStatus;
  trackingNumber?: string;
}) {
  const payload = {
    orderNumber: params.orderNumber,
    status: params.status,
    trackingNumber: params.trackingNumber,
  };

  console.log('[notification]', params.eventType, params.email, payload);

  try {
    const supabase = await createServerSupabaseClient();
    await supabase.from('notification_logs').insert({
      order_id: params.orderId,
      customer_id: params.customerId,
      channel: 'email',
      event_type: params.eventType,
      recipient: params.email,
      payload,
    });
  } catch {
    // table may not exist yet in dev without migration
  }
}

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ShippingZoneId,
} from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';
import { calculateShipping, getShippingZonesFromDb } from '@/lib/services/shipping';
import { validatePromo } from '@/lib/services/promotions';
import {
  generatePaymentReference,
  getInitialPaymentStatus,
  requiresMockPaymentPage,
} from '@/lib/services/mock-payments';
import { sendOrderStatusEmail } from '@/lib/services/notifications';

export interface CreateOrderInput {
  customerId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  deliveryAddress: string;
  shippingZone: ShippingZoneId;
  paymentMethod: PaymentMethod;
  promoCode?: string;
  notes?: string;
}

function mapOrderItem(row: Record<string, unknown>): OrderItem {
  return {
    id: row.id as string,
    orderId: row.order_id as string,
    productId: row.product_id as string,
    productName: row.product_name as string,
    productPrice: Number(row.product_price),
    quantity: row.quantity as number,
    subtotal: Number(row.subtotal),
  };
}

function mapOrder(row: Record<string, unknown>): Order {
  const items = row.order_items as Record<string, unknown>[] | null;
  return {
    id: row.id as string,
    orderNumber: row.order_number as number,
    customerId: row.customer_id as string,
    fullName: row.full_name as string,
    email: row.email as string,
    contactNumber: row.contact_number as string,
    deliveryAddress: row.delivery_address as string,
    paymentMethod: row.payment_method as PaymentMethod,
    paymentStatus: (row.payment_status as PaymentStatus) ?? 'pending',
    paymentReference: (row.payment_reference as string) ?? null,
    shippingZone: (row.shipping_zone as ShippingZoneId) ?? null,
    shippingFee: Number(row.shipping_fee ?? 0),
    discount: Number(row.discount ?? 0),
    promoCode: (row.promo_code as string) ?? null,
    trackingNumber: (row.tracking_number as string) ?? null,
    status: row.status as OrderStatus,
    notes: (row.notes as string) ?? null,
    subtotal: Number(row.subtotal),
    total: Number(row.total),
    items: items ? items.map(mapOrderItem) : undefined,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function createOrder(
  input: CreateOrderInput
): Promise<ServiceResult<Order & { redirectToPayment?: boolean }>> {
  const supabase = await createServerSupabaseClient();

  const { data: cartItems, error: cartError } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('customer_id', input.customerId);

  if (cartError) {
    return { success: false, error: cartError.message, code: 'CART_ERROR' };
  }

  if (!cartItems || cartItems.length === 0) {
    return { success: false, error: 'Cart is empty', code: 'EMPTY_CART' };
  }

  for (const item of cartItems) {
    const product = item.products as Record<string, unknown>;
    const status = product.status as string;
    if (status === 'Inactive') {
      return {
        success: false,
        error: `"${product.name as string}" is no longer available`,
        code: 'INACTIVE_PRODUCT',
      };
    }
    if (status === 'Out of Stock' || (product.stock_quantity as number) <= 0) {
      return {
        success: false,
        error: `"${product.name as string}" is out of stock`,
        code: 'OUT_OF_STOCK',
      };
    }
  }

  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.products as Record<string, unknown>;
    return sum + Number(product.price) * (item.quantity as number);
  }, 0);

  const promoResult = await validatePromo(input.promoCode, subtotal);
  const promo = promoResult.success ? promoResult.data : null;
  const discount = promo?.valid ? promo.discountAmount : 0;
  const freeShipping = promo?.valid ? promo.freeShipping : false;

  const zones = await getShippingZonesFromDb();
  const shipping = calculateShipping(subtotal, input.shippingZone, zones, freeShipping);
  const shippingFee = shipping.fee;
  const total = Math.max(0, subtotal + shippingFee - discount);

  const paymentStatus = getInitialPaymentStatus(input.paymentMethod);
  const paymentReference =
    requiresMockPaymentPage(input.paymentMethod) || input.paymentMethod === 'Bank Transfer'
      ? generatePaymentReference()
      : null;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: input.customerId,
      full_name: input.fullName,
      email: input.email,
      contact_number: input.contactNumber,
      delivery_address: input.deliveryAddress,
      payment_method: input.paymentMethod,
      payment_status: paymentStatus,
      payment_reference: paymentReference,
      shipping_zone: input.shippingZone,
      shipping_fee: shippingFee,
      discount,
      promo_code: promo?.valid ? promo.code : null,
      notes: input.notes ?? null,
      status: 'Pending',
      subtotal,
      total,
    })
    .select('*')
    .single();

  if (orderError) {
    return { success: false, error: orderError.message, code: 'ORDER_ERROR' };
  }

  const orderItems = cartItems.map((item) => {
    const product = item.products as Record<string, unknown>;
    return {
      order_id: order.id as string,
      product_id: item.product_id as string,
      product_name: product.name as string,
      product_price: Number(product.price),
      quantity: item.quantity as number,
      subtotal: Number(product.price) * (item.quantity as number),
    };
  });

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

  if (itemsError) {
    return { success: false, error: itemsError.message, code: 'ORDER_ITEMS_ERROR' };
  }

  for (const item of cartItems) {
    const product = item.products as Record<string, unknown>;
    const qty = item.quantity as number;
    await supabase
      .from('products')
      .update({
        sales_count: ((product.sales_count as number) ?? 0) + qty,
        stock_quantity: Math.max(0, (product.stock_quantity as number) - qty),
      })
      .eq('id', item.product_id as string);
  }

  await supabase.from('cart_items').delete().eq('customer_id', input.customerId);

  await sendOrderStatusEmail({
    orderId: order.id as string,
    customerId: input.customerId,
    email: input.email,
    eventType: 'order_placed',
    orderNumber: order.order_number as number,
    status: 'Pending',
  });

  revalidatePath('/cart');
  revalidatePath('/orders');
  revalidatePath('/account/orders');
  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  const mapped = mapOrder(order);
  return {
    success: true,
    data: {
      ...mapped,
      redirectToPayment: requiresMockPaymentPage(input.paymentMethod),
    },
  };
}

export async function confirmOrderPayment(
  id: string
): Promise<ServiceResult<Order>> {
  const supabase = await createServerSupabaseClient();

  const { data: existing } = await supabase.from('orders').select('*').eq('id', id).single();
  if (!existing) {
    return { success: false, error: 'Order not found', code: 'NOT_FOUND' };
  }

  const { data, error } = await supabase
    .from('orders')
    .update({
      payment_status: 'paid',
      status: 'Confirmed',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, order_items(*)')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'UPDATE_ERROR' };
  }

  await sendOrderStatusEmail({
    orderId: id,
    customerId: data.customer_id as string,
    email: data.email as string,
    eventType: 'payment_confirmed',
    orderNumber: data.order_number as number,
    status: 'Confirmed',
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath('/account/orders');
  revalidatePath(`/account/orders/${id}`);

  return { success: true, data: mapOrder(data) };
}

export async function updateOrderTracking(
  id: string,
  trackingNumber: string,
  status: OrderStatus = 'Shipped'
): Promise<ServiceResult<Order>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('orders')
    .update({
      tracking_number: trackingNumber,
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select('*, order_items(*)')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'UPDATE_ERROR' };
  }

  await sendOrderStatusEmail({
    orderId: id,
    customerId: data.customer_id as string,
    email: data.email as string,
    eventType: 'order_shipped',
    orderNumber: data.order_number as number,
    status,
    trackingNumber,
  });

  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath('/account/orders');
  revalidatePath(`/account/orders/${id}`);

  return { success: true, data: mapOrder(data) };
}

export async function getOrders(): Promise<ServiceResult<Order[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapOrder) };
}

export async function getOrderById(
  id: string
): Promise<ServiceResult<Order | null>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return { success: true, data: null };
    }
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: mapOrder(data) };
}

export async function getOrdersByCustomer(
  customerId: string
): Promise<ServiceResult<Order[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapOrder) };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<ServiceResult<Order>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*, order_items(*)')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'UPDATE_ERROR' };
  }

  await sendOrderStatusEmail({
    orderId: id,
    customerId: data.customer_id as string,
    email: data.email as string,
    eventType: 'status_updated',
    orderNumber: data.order_number as number,
    status,
  });

  revalidatePath('/orders');
  revalidatePath('/account/orders');
  revalidatePath(`/account/orders/${id}`);
  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  return { success: true, data: mapOrder(data) };
}

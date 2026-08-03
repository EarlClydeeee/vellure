import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Order, OrderItem, OrderStatus, PaymentMethod } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

export interface CreateOrderInput {
  customerId: string;
  fullName: string;
  email: string;
  contactNumber: string;
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
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
): Promise<ServiceResult<Order>> {
  const supabase = await createServerSupabaseClient();

  // 1. Get cart items with product details
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

  // 2. Calculate subtotal and total
  const subtotal = cartItems.reduce((sum, item) => {
    const product = item.products as Record<string, unknown>;
    return sum + Number(product.price) * (item.quantity as number);
  }, 0);
  const total = subtotal;

  // 3. Insert order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: input.customerId,
      full_name: input.fullName,
      email: input.email,
      contact_number: input.contactNumber,
      delivery_address: input.deliveryAddress,
      payment_method: input.paymentMethod,
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

  // 4. Insert order items
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

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    return {
      success: false,
      error: itemsError.message,
      code: 'ORDER_ITEMS_ERROR',
    };
  }

  // 5. Clear the cart
  const { error: clearError } = await supabase
    .from('cart_items')
    .delete()
    .eq('customer_id', input.customerId);

  if (clearError) {
    return {
      success: false,
      error: clearError.message,
      code: 'CLEAR_CART_ERROR',
    };
  }

  revalidatePath('/cart');
  revalidatePath('/orders');
  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  return { success: true, data: mapOrder(order) };
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

  revalidatePath('/orders');
  revalidatePath('/admin/orders');
  revalidatePath('/admin/dashboard');

  return { success: true, data: mapOrder(data) };
}

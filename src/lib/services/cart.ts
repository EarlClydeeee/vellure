import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CartItem, Product } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

function mapCartItem(row: Record<string, unknown>): CartItem {
  const product = row.products as Record<string, unknown> | null;
  return {
    id: row.id as string,
    customerId: row.customer_id as string,
    productId: row.product_id as string,
    product: product
      ? {
          id: product.id as string,
          name: product.name as string,
          description: (product.description as string) ?? null,
          price: Number(product.price),
          stockQuantity: product.stock_quantity as number,
          imageUrl: (product.image_url as string) ?? null,
          categoryId: (product.category_id as string) ?? null,
          status: product.status as Product['status'],
          createdAt: new Date(product.created_at as string),
          updatedAt: new Date(product.updated_at as string),
        }
      : undefined,
    quantity: row.quantity as number,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function getCartItems(
  customerId: string
): Promise<ServiceResult<CartItem[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('cart_items')
    .select('*, products(*)')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: true });

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapCartItem) };
}

export async function addToCart(
  customerId: string,
  productId: string,
  quantity: number
): Promise<ServiceResult<CartItem>> {
  const supabase = await createServerSupabaseClient();

  // Check if item already exists in cart
  const { data: existing, error: selectError } = await supabase
    .from('cart_items')
    .select('*')
    .eq('customer_id', customerId)
    .eq('product_id', productId)
    .maybeSingle();

  if (selectError) {
    return { success: false, error: selectError.message, code: 'QUERY_ERROR' };
  }

  if (existing) {
    // Increment quantity
    const newQuantity = (existing.quantity as number) + quantity;
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity, updated_at: new Date().toISOString() })
      .eq('customer_id', customerId)
      .eq('product_id', productId)
      .select('*, products(*)')
      .single();

    if (error) {
      return { success: false, error: error.message, code: 'UPDATE_ERROR' };
    }

    revalidatePath('/cart');
    return { success: true, data: mapCartItem(data) };
  }

  // Insert new cart item
  const { data, error } = await supabase
    .from('cart_items')
    .insert({
      customer_id: customerId,
      product_id: productId,
      quantity,
    })
    .select('*, products(*)')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'INSERT_ERROR' };
  }

  revalidatePath('/cart');
  return { success: true, data: mapCartItem(data) };
}

export async function updateCartItemQuantity(
  customerId: string,
  productId: string,
  quantity: number
): Promise<ServiceResult<CartItem>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('cart_items')
    .update({ quantity, updated_at: new Date().toISOString() })
    .eq('customer_id', customerId)
    .eq('product_id', productId)
    .select('*, products(*)')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'UPDATE_ERROR' };
  }

  revalidatePath('/cart');
  return { success: true, data: mapCartItem(data) };
}

export async function removeFromCart(
  customerId: string,
  productId: string
): Promise<ServiceResult<void>> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('customer_id', customerId)
    .eq('product_id', productId);

  if (error) {
    return { success: false, error: error.message, code: 'DELETE_ERROR' };
  }

  revalidatePath('/cart');
  return { success: true, data: undefined };
}

export async function clearCart(
  customerId: string
): Promise<ServiceResult<void>> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('customer_id', customerId);

  if (error) {
    return { success: false, error: error.message, code: 'DELETE_ERROR' };
  }

  revalidatePath('/cart');
  return { success: true, data: undefined };
}

export async function getCartTotal(
  customerId: string
): Promise<ServiceResult<{ subtotal: number; total: number }>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('cart_items')
    .select('quantity, products(price)')
    .eq('customer_id', customerId);

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  const subtotal = (data ?? []).reduce((sum, item) => {
    const products = item.products as unknown as
      | { price: number }
      | null;
    const price = Number(products?.price ?? 0);
    return sum + price * (item.quantity as number);
  }, 0);

  return { success: true, data: { subtotal, total: subtotal } };
}

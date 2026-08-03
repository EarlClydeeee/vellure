'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { addToCart, updateCartItemQuantity, removeFromCart } from '@/lib/services/cart';
import { createOrder } from '@/lib/services/orders';
import { checkoutSchema } from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';
import { CheckoutFormData } from '@/lib/validation/schemas';

export async function addToCartAction(productId: string, quantity: number) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to add items to cart');
  }

  const result = await addToCart(user.id, productId, quantity);

  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath('/cart');
  return result.data;
}

export async function updateCartQuantityAction(productId: string, quantity: number) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to update cart');
  }

  const result = await updateCartItemQuantity(user.id, productId, quantity);

  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath('/cart');
  return result.data;
}

export async function removeFromCartAction(productId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('You must be logged in to remove items from cart');
  }

  const result = await removeFromCart(user.id, productId);

  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath('/cart');
}

export async function createOrderAction(formData: CheckoutFormData) {
  const parsed = checkoutSchema.safeParse(formData);

  if (!parsed.success) {
    return { success: false as const, error: 'Invalid form data' };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: 'You must be logged in to place an order' };
  }

  const result = await createOrder({
    customerId: user.id,
    fullName: parsed.data.fullName,
    email: parsed.data.email,
    contactNumber: parsed.data.contactNumber,
    deliveryAddress: parsed.data.deliveryAddress,
    paymentMethod: parsed.data.paymentMethod,
    notes: parsed.data.notes,
  });

  if (!result.success) {
    return { success: false as const, error: result.error };
  }

  return { success: true as const, data: result.data };
}

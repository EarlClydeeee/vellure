'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { addToCart, updateCartItemQuantity, removeFromCart } from '@/lib/services/cart';
import { createOrder } from '@/lib/services/orders';
import { toggleWishlist } from '@/lib/services/wishlist';
import { createAddress, deleteAddress } from '@/lib/services/addresses';
import { createReview } from '@/lib/services/reviews';
import { createReturnRequest } from '@/lib/services/returns';
import { validatePromo } from '@/lib/services/promotions';
import { calculateShipping, getShippingZonesFromDb } from '@/lib/services/shipping';
import {
  checkoutSchema,
  addressSchema,
  reviewSchema,
  returnRequestSchema,
} from '@/lib/validation/schemas';
import { revalidatePath } from 'next/cache';
import { adminLogin, isAdminEmail } from '@/lib/auth/admin';
import type { CheckoutFormData, AddressFormData, ReviewFormData, ReturnRequestFormData } from '@/lib/validation/schemas';
import type { ShippingZoneId } from '@/lib/types';

export async function addToCartAction(productId: string, quantity: number) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, requiresAuth: true as const };
  }

  const result = await addToCart(user.id, productId, quantity);

  if (!result.success) {
    throw new Error(result.error);
  }

  revalidatePath('/cart');
  return { success: true as const, requiresAuth: false as const, data: result.data };
}

export async function mergeGuestCartAction(
  items: { productId: string; quantity: number }[]
) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || items.length === 0) {
    return { success: true as const };
  }

  for (const item of items) {
    await addToCart(user.id, item.productId, item.quantity);
  }

  revalidatePath('/cart');
  revalidatePath('/checkout');
  return { success: true as const };
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

export async function validatePromoAction(code: string, subtotal: number) {
  return validatePromo(code, subtotal);
}

export async function calculateCheckoutTotalsAction(
  subtotal: number,
  shippingZone: ShippingZoneId,
  promoCode?: string
) {
  const promoResult = await validatePromo(promoCode, subtotal);
  const promo = promoResult.success ? promoResult.data : null;
  const discount = promo?.valid ? promo.discountAmount : 0;
  const freeShipping = promo?.valid ? promo.freeShipping : false;
  const zones = await getShippingZonesFromDb();
  const shipping = calculateShipping(subtotal, shippingZone, zones, freeShipping);
  const total = Math.max(0, subtotal + shipping.fee - discount);

  return {
    subtotal,
    shippingFee: shipping.fee,
    discount,
    total,
    promoMessage: promo?.message ?? '',
    promoValid: promo?.valid ?? false,
    freeShippingApplied: shipping.freeShippingApplied,
    estimatedDays: shipping.estimatedDays,
  };
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
    shippingZone: parsed.data.shippingZone,
    paymentMethod: parsed.data.paymentMethod,
    promoCode: parsed.data.promoCode,
    notes: parsed.data.notes,
  });

  if (!result.success) {
    return { success: false as const, error: result.error };
  }

  return { success: true as const, data: result.data };
}

export async function toggleWishlistAction(productId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: 'Login required' };
  }

  return toggleWishlist(user.id, productId);
}

export async function createAddressAction(formData: AddressFormData) {
  const parsed = addressSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false as const, error: 'Invalid address' };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: 'Login required' };
  }

  return createAddress({
    customerId: user.id,
    ...parsed.data,
  });
}

export async function deleteAddressAction(id: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: 'Login required' };
  }

  return deleteAddress(id, user.id);
}

export async function createReviewAction(formData: ReviewFormData) {
  const parsed = reviewSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false as const, error: 'Invalid review' };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: 'Login required' };
  }

  return createReview({
    customerId: user.id,
    ...parsed.data,
  });
}

export async function createReturnRequestAction(formData: ReturnRequestFormData) {
  const parsed = returnRequestSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false as const, error: 'Invalid return request' };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false as const, error: 'Login required' };
  }

  return createReturnRequest({
    customerId: user.id,
    orderId: parsed.data.orderId,
    reason: parsed.data.reason,
  });
}

export async function completeStoreLoginAction(
  email: string,
  password: string,
  returnTo: string
) {
  if (!isAdminEmail(email)) {
    return {
      success: true as const,
      isAdmin: false as const,
      redirectTo: returnTo || '/',
    };
  }

  const sessionStarted = await adminLogin(email, password);
  if (!sessionStarted) {
    return {
      success: false as const,
      error: 'Admin session could not be started. Check ADMIN_USERNAME and ADMIN_PASSWORD in .env.local.',
    };
  }

  return {
    success: true as const,
    isAdmin: true as const,
    redirectTo: '/admin/dashboard',
  };
}

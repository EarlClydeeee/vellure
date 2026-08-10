import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Promotion } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

export interface PromoValidationResult {
  valid: boolean;
  code: string;
  discountAmount: number;
  freeShipping: boolean;
  message: string;
}

const FALLBACK_PROMOS: Promotion[] = [
  { id: '1', code: 'WELCOME10', description: '10% off', discountType: 'percent', discountValue: 10, minSpend: 2500, active: true },
  { id: '2', code: 'TECH88', description: '8% off', discountType: 'percent', discountValue: 8, minSpend: 0, active: true },
  { id: '3', code: 'FREESHIP', description: 'Free shipping', discountType: 'free_shipping', discountValue: 0, minSpend: 5000, active: true },
  { id: '4', code: 'BUNDLE15', description: '15% off bundles', discountType: 'percent', discountValue: 15, minSpend: 0, active: true },
];

function mapPromotion(row: Record<string, unknown>): Promotion {
  return {
    id: row.id as string,
    code: row.code as string,
    description: (row.description as string) ?? null,
    discountType: row.discount_type as Promotion['discountType'],
    discountValue: Number(row.discount_value),
    minSpend: Number(row.min_spend),
    active: row.active as boolean,
  };
}

async function getPromotionByCode(code: string): Promise<Promotion | null> {
  const normalized = code.trim().toUpperCase();
  try {
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('promotions')
      .select('*')
      .eq('code', normalized)
      .eq('active', true)
      .maybeSingle();

    if (data) return mapPromotion(data);
  } catch {
    // fallback below
  }

  return FALLBACK_PROMOS.find((p) => p.code === normalized) ?? null;
}

export async function validatePromo(
  code: string | undefined,
  subtotal: number
): Promise<ServiceResult<PromoValidationResult>> {
  if (!code?.trim()) {
    return {
      success: true,
      data: { valid: false, code: '', discountAmount: 0, freeShipping: false, message: 'No promo code applied' },
    };
  }

  const promo = await getPromotionByCode(code);
  if (!promo) {
    return {
      success: true,
      data: { valid: false, code: code.toUpperCase(), discountAmount: 0, freeShipping: false, message: 'Invalid promo code' },
    };
  }

  if (subtotal < promo.minSpend) {
    return {
      success: true,
      data: {
        valid: false,
        code: promo.code,
        discountAmount: 0,
        freeShipping: false,
        message: `Minimum spend of ₱${promo.minSpend.toLocaleString()} required`,
      },
    };
  }

  if (promo.discountType === 'free_shipping') {
    return {
      success: true,
      data: { valid: true, code: promo.code, discountAmount: 0, freeShipping: true, message: 'Free shipping applied' },
    };
  }

  const discountAmount =
    promo.discountType === 'percent'
      ? Math.round(subtotal * (promo.discountValue / 100) * 100) / 100
      : Math.min(promo.discountValue, subtotal);

  return {
    success: true,
    data: {
      valid: true,
      code: promo.code,
      discountAmount,
      freeShipping: false,
      message: `${promo.code} applied`,
    },
  };
}

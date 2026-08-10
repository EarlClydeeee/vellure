import { locale } from '@/lib/data/marketing-content';
import type { ShippingZone, ShippingZoneId } from '@/lib/types';

export interface ShippingQuote {
  zone: ShippingZoneId;
  fee: number;
  freeShippingApplied: boolean;
  estimatedDays: string;
}

const FALLBACK_ZONES: ShippingZone[] = [
  { id: 'ncr', name: 'Metro Manila', fee: 99, freeShippingThreshold: locale.freeShippingThreshold, estimatedDays: 'Same-day if ordered before 2 PM' },
  { id: 'luzon', name: 'Luzon', fee: 149, freeShippingThreshold: locale.freeShippingThreshold, estimatedDays: '2–3 business days' },
  { id: 'vismin', name: 'Visayas & Mindanao', fee: 199, freeShippingThreshold: locale.freeShippingThreshold, estimatedDays: '3–5 business days' },
];

export function calculateShipping(
  subtotal: number,
  zoneId: ShippingZoneId,
  zones: ShippingZone[] = FALLBACK_ZONES,
  forceFreeShipping = false
): ShippingQuote {
  const zone = zones.find((z) => z.id === zoneId) ?? FALLBACK_ZONES[0];
  const threshold = zone.freeShippingThreshold ?? locale.freeShippingThreshold;
  const freeShippingApplied = forceFreeShipping || subtotal >= threshold;
  const fee = freeShippingApplied ? 0 : zone.fee;

  return {
    zone: zone.id,
    fee,
    freeShippingApplied,
    estimatedDays: zone.estimatedDays,
  };
}

export async function getShippingZonesFromDb(): Promise<ShippingZone[]> {
  try {
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('shipping_zones')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!data?.length) return FALLBACK_ZONES;

    return data.map((row) => ({
      id: row.id as ShippingZoneId,
      name: row.name as string,
      fee: Number(row.fee),
      freeShippingThreshold: row.free_shipping_threshold != null ? Number(row.free_shipping_threshold) : null,
      estimatedDays: row.estimated_days as string,
    }));
  } catch {
    return FALLBACK_ZONES;
  }
}

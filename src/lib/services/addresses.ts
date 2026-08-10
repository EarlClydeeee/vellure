import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CustomerAddress, ShippingZoneId } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

function mapAddress(row: Record<string, unknown>): CustomerAddress {
  return {
    id: row.id as string,
    customerId: row.customer_id as string,
    label: row.label as string,
    fullName: row.full_name as string,
    contactNumber: row.contact_number as string,
    addressLine: row.address_line as string,
    shippingZone: row.shipping_zone as ShippingZoneId,
    isDefault: row.is_default as boolean,
    createdAt: new Date(row.created_at as string),
  };
}

export async function getCustomerAddresses(
  customerId: string
): Promise<ServiceResult<CustomerAddress[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('customer_addresses')
    .select('*')
    .eq('customer_id', customerId)
    .order('is_default', { ascending: false });

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapAddress) };
}

export async function createAddress(input: {
  customerId: string;
  label: string;
  fullName: string;
  contactNumber: string;
  addressLine: string;
  shippingZone: ShippingZoneId;
  isDefault?: boolean;
}): Promise<ServiceResult<CustomerAddress>> {
  const supabase = await createServerSupabaseClient();

  if (input.isDefault) {
    await supabase
      .from('customer_addresses')
      .update({ is_default: false })
      .eq('customer_id', input.customerId);
  }

  const { data, error } = await supabase
    .from('customer_addresses')
    .insert({
      customer_id: input.customerId,
      label: input.label,
      full_name: input.fullName,
      contact_number: input.contactNumber,
      address_line: input.addressLine,
      shipping_zone: input.shippingZone,
      is_default: input.isDefault ?? false,
    })
    .select('*')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'INSERT_ERROR' };
  }

  revalidatePath('/account/addresses');
  return { success: true, data: mapAddress(data) };
}

export async function deleteAddress(
  id: string,
  customerId: string
): Promise<ServiceResult<void>> {
  const supabase = await createServerSupabaseClient();

  const { error } = await supabase
    .from('customer_addresses')
    .delete()
    .eq('id', id)
    .eq('customer_id', customerId);

  if (error) {
    return { success: false, error: error.message, code: 'DELETE_ERROR' };
  }

  revalidatePath('/account/addresses');
  return { success: true, data: undefined };
}

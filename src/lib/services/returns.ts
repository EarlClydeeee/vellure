import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ReturnRequest, ReturnStatus } from '@/lib/types';
import { ServiceResult } from '@/lib/types/service';

function mapReturn(row: Record<string, unknown>): ReturnRequest {
  return {
    id: row.id as string,
    orderId: row.order_id as string,
    customerId: row.customer_id as string,
    reason: row.reason as string,
    status: row.status as ReturnStatus,
    adminNotes: (row.admin_notes as string) ?? null,
    createdAt: new Date(row.created_at as string),
    updatedAt: new Date(row.updated_at as string),
  };
}

export async function createReturnRequest(input: {
  orderId: string;
  customerId: string;
  reason: string;
}): Promise<ServiceResult<ReturnRequest>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('return_requests')
    .insert({
      order_id: input.orderId,
      customer_id: input.customerId,
      reason: input.reason,
      status: 'requested',
    })
    .select('*')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'INSERT_ERROR' };
  }

  revalidatePath('/account/orders');
  revalidatePath('/admin/returns');

  return { success: true, data: mapReturn(data) };
}

export async function getReturnByOrder(
  orderId: string
): Promise<ServiceResult<ReturnRequest | null>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('return_requests')
    .select('*')
    .eq('order_id', orderId)
    .maybeSingle();

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: data ? mapReturn(data) : null };
}

export async function getAllReturns(): Promise<ServiceResult<ReturnRequest[]>> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('return_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    return { success: false, error: error.message, code: 'QUERY_ERROR' };
  }

  return { success: true, data: (data ?? []).map(mapReturn) };
}

export async function updateReturnStatus(
  id: string,
  status: ReturnStatus,
  adminNotes?: string
): Promise<ServiceResult<ReturnRequest>> {
  const supabase = await createServerSupabaseClient();

  const update: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (adminNotes !== undefined) update.admin_notes = adminNotes;

  const { data, error } = await supabase
    .from('return_requests')
    .update(update)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    return { success: false, error: error.message, code: 'UPDATE_ERROR' };
  }

  revalidatePath('/admin/returns');
  revalidatePath('/account/orders');

  return { success: true, data: mapReturn(data) };
}

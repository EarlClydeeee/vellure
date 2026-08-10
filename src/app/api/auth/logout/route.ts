import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { clearSessionRoleCookie } from '@/lib/auth/session';
import { adminLogout } from '@/lib/auth/admin';

export async function POST() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
  }

  await adminLogout();
  await clearSessionRoleCookie();

  return NextResponse.json({ success: true, role: 'guest' as const });
}

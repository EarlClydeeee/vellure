import { cookies } from 'next/headers';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import {
  getAdminConfigEmail,
  isAdminEmail,
  parseAdminSessionToken,
  validateAdminSessionToken,
} from '@/lib/auth/admin-session';
import type { AppSession, SessionRole } from '@/lib/types/auth';

export const ROLE_COOKIE = 'vellure_role';
const ADMIN_COOKIE = 'admin_session';
const SESSION_MAX_AGE = 24 * 60 * 60; // 24 hours

export async function setSessionRoleCookie(role: Exclude<SessionRole, 'guest'>, email: string) {
  const cookieStore = await cookies();
  cookieStore.set(ROLE_COOKIE, role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
  cookieStore.set('vellure_session_email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionRoleCookie() {
  const cookieStore = await cookies();
  cookieStore.set(ROLE_COOKIE, '', { path: '/', maxAge: 0 });
  cookieStore.set('vellure_session_email', '', { path: '/', maxAge: 0 });
}

export async function getAppSession(): Promise<AppSession> {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_COOKIE)?.value;
  const adminPayload = parseAdminSessionToken(adminToken);

  if (adminPayload && validateAdminSessionToken(adminToken)) {
    return {
      role: 'admin',
      email: adminPayload.email ?? getAdminConfigEmail(),
      userId: null,
    };
  }

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user?.email) {
        if (isAdminEmail(user.email)) {
          return {
            role: 'admin',
            email: user.email,
            userId: user.id,
          };
        }
        return {
          role: 'customer',
          email: user.email,
          userId: user.id,
        };
      }
    } catch {
      // fall through to guest
    }
  }

  const roleCookie = cookieStore.get(ROLE_COOKIE)?.value;
  const emailCookie = cookieStore.get('vellure_session_email')?.value;

  if (roleCookie === 'admin' || roleCookie === 'customer') {
    return {
      role: roleCookie,
      email: emailCookie ?? null,
      userId: null,
    };
  }

  return { role: 'guest', email: null, userId: null };
}

export function getSessionRoleFromRequest(cookies: {
  get: (name: string) => { value: string } | undefined;
}): SessionRole {
  const adminToken = cookies.get(ADMIN_COOKIE)?.value;
  if (validateAdminSessionToken(adminToken)) {
    return 'admin';
  }

  const roleCookie = cookies.get(ROLE_COOKIE)?.value;
  if (roleCookie === 'admin' || roleCookie === 'customer') {
    return roleCookie;
  }

  return 'guest';
}

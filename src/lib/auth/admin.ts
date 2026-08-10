import { cookies } from 'next/headers';
import {
  SESSION_DURATION_MS,
  credentialsMatchAdmin,
  getAdminConfigEmail,
  parseAdminSessionToken,
  validateAdminSessionToken,
} from '@/lib/auth/admin-session';

const COOKIE_NAME = 'admin_session';

function createSessionToken(email: string): string {
  const payload = JSON.stringify({ timestamp: Date.now(), email });
  return Buffer.from(payload).toString('base64');
}

export {
  isAdminEmail,
  validateAdminSessionToken,
  getAdminConfigEmail,
  credentialsMatchAdmin,
} from '@/lib/auth/admin-session';

export async function adminLogin(
  identifier: string,
  password: string
): Promise<boolean> {
  if (!credentialsMatchAdmin(identifier, password)) {
    return false;
  }

  const email = getAdminConfigEmail()!;
  const token = createSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  });

  return true;
}

export async function adminLogout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  return validateAdminSessionToken(session?.value);
}

export async function getAdminSessionEmail(): Promise<string | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(COOKIE_NAME);
  const payload = parseAdminSessionToken(session?.value);
  return payload?.email ?? getAdminConfigEmail();
}

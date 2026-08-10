import { cookies } from 'next/headers';
import { SESSION_DURATION_MS, validateAdminSessionToken } from '@/lib/auth/admin-session';

const COOKIE_NAME = 'admin_session';

function createSessionToken(): string {
  const payload = JSON.stringify({ timestamp: Date.now() });
  return Buffer.from(payload).toString('base64');
}

export { isAdminEmail, validateAdminSessionToken } from '@/lib/auth/admin-session';

export async function adminLogin(username: string, password: string): Promise<boolean> {
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminUsername || !adminPassword) {
    return false;
  }

  if (username !== adminUsername || password !== adminPassword) {
    return false;
  }

  const token = createSessionToken();
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

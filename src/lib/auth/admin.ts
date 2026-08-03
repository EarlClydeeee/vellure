import { cookies } from 'next/headers';

const COOKIE_NAME = 'admin_session';
const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

function createSessionToken(): string {
  const payload = JSON.stringify({ timestamp: Date.now() });
  return Buffer.from(payload).toString('base64');
}

function validateSessionToken(token: string): boolean {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (Date.now() - decoded.timestamp > SESSION_DURATION_MS) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

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
    maxAge: SESSION_DURATION_MS / 1000, // in seconds
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

  if (!session?.value) {
    return false;
  }

  return validateSessionToken(session.value);
}

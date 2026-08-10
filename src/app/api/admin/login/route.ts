import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  credentialsMatchAdmin,
  getAdminConfigEmail,
  SESSION_DURATION_MS,
} from '@/lib/auth/admin-session';
import { setSessionRoleCookie } from '@/lib/auth/session';

const COOKIE_NAME = 'admin_session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const adminEmail = getAdminConfigEmail();
    if (!adminEmail || !process.env.ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          error:
            'Admin credentials not configured. Set ADMIN_EMAIL and ADMIN_PASSWORD in .env.local',
        },
        { status: 500 }
      );
    }

    if (!credentialsMatchAdmin(username, password)) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = Buffer.from(
      JSON.stringify({ timestamp: Date.now(), email: adminEmail, role: 'admin' })
    ).toString('base64');
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_DURATION_MS / 1000,
    });

    await setSessionRoleCookie('admin', adminEmail);

    return NextResponse.json({
      success: true,
      role: 'admin' as const,
      email: adminEmail,
    });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

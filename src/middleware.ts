import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const storeProtectedPaths = ['/checkout', '/account'];
  const needsAuth =
    storeProtectedPaths.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith('/orders');

  if (needsAuth && !user) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminSession = request.cookies.get('admin_session');
    if (!adminSession?.value) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
    try {
      const decoded = JSON.parse(Buffer.from(adminSession.value, 'base64').toString());
      if (Date.now() - decoded.timestamp > 24 * 60 * 60 * 1000) {
        const url = request.nextUrl.clone();
        url.pathname = '/admin/login';
        return NextResponse.redirect(url);
      }
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/checkout/:path*',
    '/account/:path*',
    '/orders/:path*',
    '/admin/:path*',
  ],
};

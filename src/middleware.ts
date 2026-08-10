import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@/lib/supabase/middleware';
import { isAdminEmail, validateAdminSessionToken } from '@/lib/auth/admin-session';

function hasValidAdminSession(request: NextRequest): boolean {
  const adminSession = request.cookies.get('admin_session');
  return validateAdminSessionToken(adminSession?.value);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { supabase, supabaseResponse } = createMiddlewareSupabaseClient(request);

  if (!supabase) {
    return supabaseResponse;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminUser = isAdminEmail(user?.email);
  const adminSessionValid = hasValidAdminSession(request);

  // Keep admin accounts on the admin panel, not the customer storefront
  if (isAdminUser && !pathname.startsWith('/admin') && !pathname.startsWith('/api')) {
    if (adminSessionValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/dashboard';
      url.search = '';
      return NextResponse.redirect(url);
    }

    if (pathname !== '/login' && pathname !== '/admin/login') {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      url.search = '';
      return NextResponse.redirect(url);
    }
  }

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

  if (needsAuth && isAdminUser) {
    const url = request.nextUrl.clone();
    url.pathname = adminSessionValid ? '/admin/dashboard' : '/admin/login';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!adminSessionValid) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith('/admin/login') && adminSessionValid) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Refresh Supabase sessions on all routes except static assets.
     * Auth redirects below only apply to matched store/admin paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

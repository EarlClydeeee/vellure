'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Search, User, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavLink } from '@/components/store/NavLink';
import { useCart } from '@/components/store/CartProvider';
import { cn } from '@/lib/utils';

interface HeaderProps {
  userEmail?: string | null;
}

const navLeft = [{ href: '/products', label: 'Shop' }] as const;

const navRight = [
  { href: '/blog', label: 'Blog' },
  { href: '/blog/meet-the-team', label: 'Meet the Team' },
  { href: '/contact', label: 'Contact Us' },
] as const;

const allNavItems = [...navLeft, ...navRight];

const navLinkClass =
  'text-xs font-medium uppercase tracking-[0.12em] text-gray-600 transition-colors hover:text-vellure-primary md:text-sm';

/** Nav links collapse to logo-only on these routes (and sub-routes). */
const LOGO_ONLY_PREFIXES = ['/products', '/blog', '/contact'];

function isLogoOnlyNav(pathname: string): boolean {
  return LOGO_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

function VellureLogoLink({ className }: { className?: string }) {
  return (
    <NavLink href="/" className={cn('shrink-0 px-1', className)} aria-label="Vellure home">
      <Image
        src="/vellure-logo.png"
        alt="Vellure"
        width={120}
        height={48}
        className="h-8 w-auto sm:h-9 md:h-10"
        priority
      />
    </NavLink>
  );
}

function HeaderUtilities({
  userEmail,
  cartCount,
}: {
  userEmail?: string | null;
  cartCount: number;
}) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <NavLink
        href="/products"
        className="rounded-full p-2.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-vellure-primary"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </NavLink>

      <NavLink
        href="/cart"
        className="relative rounded-full p-2.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-vellure-primary"
        aria-label="Shopping cart"
      >
        <ShoppingBag className="h-5 w-5" />
        {cartCount > 0 && (
          <Badge className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-vellure-primary p-0 text-[10px] text-white">
            {cartCount > 9 ? '9+' : cartCount}
          </Badge>
        )}
      </NavLink>

      <NavLink
        href={userEmail ? '/account' : '/login'}
        className="rounded-full p-0.5 text-gray-600 transition-colors hover:opacity-80"
        aria-label={userEmail ? 'My account' : 'Log in'}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
          <User className="h-4 w-4" />
        </span>
      </NavLink>
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
  userEmail,
  cartCount,
}: {
  open: boolean;
  onClose: () => void;
  userEmail?: string | null;
  cartCount: number;
}) {
  return (
    <>
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-[60] w-72 border-l bg-white shadow-xl transition-transform duration-200 ease-in-out md:hidden',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col p-6 pt-20">
          <nav className="flex flex-col gap-4">
            {allNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-vellure-primary"
                onClick={onClose}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              href="/cart"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-vellure-primary"
              onClick={onClose}
            >
              Cart {cartCount > 0 && `(${cartCount})`}
            </NavLink>
            {userEmail && (
              <NavLink
                href="/account"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-vellure-primary"
                onClick={onClose}
              >
                My Account
              </NavLink>
            )}
          </nav>

          <div className="mt-auto flex flex-col gap-2">
            {userEmail ? (
              <>
                <span className="truncate text-sm text-muted-foreground">
                  {userEmail}
                </span>
                <form action="/api/auth/logout" method="POST">
                  <Button variant="outline" size="sm" className="w-full" type="submit">
                    Logout
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" onClick={onClose}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={onClose}>
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[55] bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}

export function Header({ userEmail }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();
  const pathname = usePathname();
  const logoOnly = isLogoOnlyNav(pathname);
  const showFullNav = !logoOnly;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
      <div className="container relative mx-auto flex h-16 items-center px-4">
        {showFullNav && (
          <button
            className="absolute left-4 rounded-full p-2 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        )}

        {logoOnly ? (
          <div className="mx-auto flex flex-1 justify-center">
            <VellureLogoLink />
          </div>
        ) : (
          <nav
            className="mx-auto hidden items-center justify-center gap-4 sm:gap-6 md:flex md:gap-8 lg:gap-10"
            aria-label="Main navigation"
          >
            {navLeft.map((item) => (
              <NavLink key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}

            <VellureLogoLink />

            {navRight.map((item) => (
              <NavLink key={item.href} href={item.href} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>
        )}

        {/* Mobile: logo centered when full nav (links in drawer) */}
        {showFullNav && (
          <div className="mx-auto md:hidden">
            <VellureLogoLink />
          </div>
        )}

        <div className={cn('absolute right-4 md:right-0', logoOnly && 'right-4')}>
          <HeaderUtilities userEmail={userEmail} cartCount={cartCount} />
        </div>
      </div>

      {showFullNav && (
        <MobileDrawer
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          userEmail={userEmail}
          cartCount={cartCount}
        />
      )}
    </header>
  );
}

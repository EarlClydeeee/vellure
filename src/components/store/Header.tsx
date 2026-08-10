'use client';

import { useState } from 'react';
import Link from 'next/link';
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

const navItems = [
  { href: '/', label: 'Branda' },
  { href: '/products', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
];

const landingNavItems = [
  { href: '/products', label: 'Shop' },
  { href: '/products?category=Smartphones', label: 'iPhone' },
  { href: '/blog', label: 'Blog' },
  { href: '/blog/how-we-curate-premium-products', label: 'Why Vellure' },
];

function HeaderUtilities({
  userEmail,
  cartCount,
  onMenuToggle,
  mobileMenuOpen,
}: {
  userEmail?: string | null;
  cartCount: number;
  onMenuToggle?: () => void;
  mobileMenuOpen?: boolean;
}) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <NavLink
        href="/products"
        className="rounded-full p-2.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#111111]"
        aria-label="Search products"
      >
        <Search className="h-5 w-5" />
      </NavLink>

      <NavLink
        href="/cart"
        className="relative rounded-full p-2.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-[#111111]"
        aria-label="Shopping cart"
      >
        <ShoppingBag className="h-5 w-5" />
        {cartCount > 0 && (
          <Badge className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111111] p-0 text-[10px] text-white">
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

      {onMenuToggle && (
        <button
          className="ml-1 flex items-center rounded-full p-2 hover:bg-gray-100 md:hidden"
          onClick={onMenuToggle}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      )}
    </div>
  );
}

function MobileDrawer({
  open,
  onClose,
  navItems: items,
  userEmail,
  cartCount,
}: {
  open: boolean;
  onClose: () => void;
  navItems: { href: string; label: string }[];
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
            {items.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-[#111111]"
                onClick={onClose}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              href="/cart"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-[#111111]"
              onClick={onClose}
            >
              Cart {cartCount > 0 && `(${cartCount})`}
            </NavLink>
            {userEmail && (
              <NavLink
                href="/account"
                className="text-sm font-medium text-gray-600 transition-colors hover:text-[#111111]"
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
  const isLanding = pathname === '/';

  if (isLanding) {
    return (
      <header className="sticky top-0 z-50 w-full bg-white">
        <div className="container relative mx-auto px-4 py-4 md:py-5">
          <div className="absolute right-4 top-4 md:right-0 md:top-5">
            <HeaderUtilities userEmail={userEmail} cartCount={cartCount} />
          </div>

          <div className="flex items-center justify-center md:block md:text-center">
            <button
              className="absolute left-4 top-4 rounded-full p-2 hover:bg-gray-100 md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            <NavLink
              href="/"
              className="font-display text-2xl font-medium uppercase tracking-[0.25em] text-[#111111] md:text-3xl"
            >
              Vellure
            </NavLink>
          </div>

          <nav className="mt-4 hidden items-center justify-center gap-8 md:flex">
            {landingNavItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="text-xs font-medium uppercase tracking-[0.12em] text-gray-600 transition-colors hover:text-[#111111]"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <MobileDrawer
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          navItems={landingNavItems}
          userEmail={userEmail}
          cartCount={cartCount}
        />
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md supports-[backdrop-filter]:bg-white/90">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <NavLink href="/" className="shrink-0 text-xl font-bold tracking-tight text-[#111111]">
          Vellure
        </NavLink>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-600 transition-colors hover:text-[#111111]"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <HeaderUtilities
          userEmail={userEmail}
          cartCount={cartCount}
          onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
          mobileMenuOpen={mobileMenuOpen}
        />
      </div>

      <MobileDrawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        userEmail={userEmail}
        cartCount={cartCount}
      />
    </header>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, Search, User, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavLink } from '@/components/store/NavLink';
import { AnnouncementBar } from '@/components/store/marketing/AnnouncementBar';
import { useCart } from '@/components/store/CartProvider';
import { VELLURE_LOGO } from '@/lib/assets/brand';
import { cn } from '@/lib/utils';

interface HeaderProps {
  userEmail?: string | null;
}

const navItems = [
  { href: '/products', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
  { href: '/blog/meet-the-team', label: 'Meet the Team' },
  { href: '/contact', label: 'Contact Us' },
] as const;

const LOGO_ONLY_PREFIXES = ['/products', '/blog', '/contact'];

function isLogoOnlyNav(pathname: string): boolean {
  return LOGO_ONLY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

const pillLinkClass =
  'hidden whitespace-nowrap px-2 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-80 sm:inline-block sm:text-xs';

function VellureLogoLink({
  inverted = false,
  className,
}: {
  inverted?: boolean;
  className?: string;
}) {
  return (
    <NavLink
      href="/"
      className={cn(
        'inline-flex shrink-0 cursor-pointer rounded-md transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vellure-primary focus-visible:ring-offset-2',
        className
      )}
      aria-label="Back to Vellure home"
    >
      <Image
        src={VELLURE_LOGO}
        alt="Vellure"
        width={600}
        height={600}
        className={cn(
          'h-8 w-auto sm:h-9 md:h-10',
          inverted && 'brightness-0 invert'
        )}
        priority
      />
    </NavLink>
  );
}

function NavPill({
  userEmail,
  cartCount,
  showLinks,
  onMenuOpen,
}: {
  userEmail?: string | null;
  cartCount: number;
  showLinks: boolean;
  onMenuOpen?: () => void;
}) {
  return (
    <div className="flex items-center rounded-full bg-vellure-primary py-1.5 pl-3 pr-1.5 sm:py-2 sm:pl-4 sm:pr-2">
      {showLinks &&
        navItems.map((item) => (
          <NavLink key={item.href} href={item.href} className={pillLinkClass}>
            {item.label}
          </NavLink>
        ))}

      {showLinks && (
        <span className="mx-1 hidden h-4 w-px bg-white/25 sm:block" aria-hidden />
      )}

      <div className="flex items-center gap-0.5 sm:gap-1">
        {showLinks && onMenuOpen && (
          <button
            type="button"
            className="rounded-full p-2 text-white transition-opacity hover:opacity-80 sm:hidden"
            onClick={onMenuOpen}
            aria-label="Open menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        )}

        <NavLink
          href="/products"
          className="rounded-full p-2 text-white transition-opacity hover:opacity-80"
          aria-label="Search products"
        >
          <Search className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        </NavLink>

        <NavLink
          href={userEmail ? '/account' : '/login'}
          className="rounded-full p-2 text-white transition-opacity hover:opacity-80"
          aria-label={userEmail ? 'My account' : 'Log in'}
        >
          <User className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        </NavLink>

        <NavLink
          href="/cart"
          className="relative rounded-full p-2 text-white transition-opacity hover:opacity-80"
          aria-label="Shopping cart"
        >
          <ShoppingBag className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
          {cartCount > 0 && (
            <Badge className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-white p-0 text-[10px] text-vellure-primary">
              {cartCount > 9 ? '9+' : cartCount}
            </Badge>
          )}
        </NavLink>
      </div>
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
          'fixed inset-y-0 right-0 z-[60] w-72 border-l bg-white shadow-xl transition-transform duration-200 ease-in-out',
          open ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col p-6 pt-20">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
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
          className="fixed inset-0 z-[55] bg-black/50"
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
  const isHome = pathname === '/';
  const logoOnly = isLogoOnlyNav(pathname);
  const showNavLinks = !logoOnly;
  const overlay = isHome;

  return (
    <>
      <header
        className={cn(
          'z-50 w-full',
          overlay ? 'absolute left-0 right-0 top-0' : 'sticky top-0 border-b border-gray-100 bg-white'
        )}
      >
        <AnnouncementBar />

        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:py-5">
          <VellureLogoLink inverted={overlay && !logoOnly} />
          <NavPill
            userEmail={userEmail}
            cartCount={cartCount}
            showLinks={showNavLinks}
            onMenuOpen={showNavLinks ? () => setMobileMenuOpen(true) : undefined}
          />
        </div>
      </header>

      {showNavLinks && (
        <MobileDrawer
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
          userEmail={userEmail}
          cartCount={cartCount}
        />
      )}
    </>
  );
}

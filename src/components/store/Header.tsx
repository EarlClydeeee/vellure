'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, User, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NavLink } from '@/components/store/NavLink';
import { cn } from '@/lib/utils';

interface HeaderProps {
  userEmail?: string | null;
  cartItemCount?: number;
}

const navItems = [
  { href: '/', label: 'Branda' },
  { href: '/products', label: 'Shop' },
  { href: '/blog', label: 'Blog' },
];

export function Header({ userEmail, cartItemCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            {cartItemCount > 0 && (
              <Badge className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#111111] p-0 text-[10px] text-white">
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </Badge>
            )}
          </NavLink>

          <NavLink
            href={userEmail ? '/orders' : '/login'}
            className="rounded-full p-0.5 text-gray-600 transition-colors hover:opacity-80"
            aria-label={userEmail ? 'My account' : 'Log in'}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200">
              <User className="h-4 w-4" />
            </span>
          </NavLink>

          <button
            className="ml-1 flex items-center rounded-full p-2 hover:bg-gray-100 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'fixed inset-y-0 right-0 z-[60] w-72 border-l bg-white shadow-xl transition-transform duration-200 ease-in-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col p-6 pt-20">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-gray-600 transition-colors hover:text-[#111111]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink
              href="/cart"
              className="text-sm font-medium text-gray-600 transition-colors hover:text-[#111111]"
              onClick={() => setMobileMenuOpen(false)}
            >
              Cart {cartItemCount > 0 && `(${cartItemCount})`}
            </NavLink>
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
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <Button size="sm" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-[55] bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}

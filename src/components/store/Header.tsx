'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface HeaderProps {
  userEmail?: string | null;
  cartItemCount?: number;
}

export function Header({ userEmail, cartItemCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          Vellure
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge className="absolute -right-2 -top-2 h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                {cartItemCount}
              </Badge>
            )}
          </Link>
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-4">
          {userEmail ? (
            <>
              <span className="text-sm text-muted-foreground">{userEmail}</span>
              <form action="/api/auth/logout" method="POST">
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center"
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

      {/* Mobile Menu */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 z-50 w-64 bg-background shadow-lg border-l transform transition-transform duration-200 ease-in-out md:hidden',
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full p-6 pt-20">
          <nav className="flex flex-col gap-4">
            <Link
              href="/products"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Products
            </Link>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartItemCount > 0 && (
                <Badge className="h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
                  {cartItemCount}
                </Badge>
              )}
            </Link>
          </nav>

          <div className="mt-auto flex flex-col gap-2">
            {userEmail ? (
              <>
                <span className="text-sm text-muted-foreground truncate">
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

      {/* Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </header>
  );
}

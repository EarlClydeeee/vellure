'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutButton } from '@/components/store/LogoutButton';
import { useSession } from '@/components/SessionProvider';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/wishlist', label: 'Wishlist' },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const session = useSession();
  const isLoggedIn = session.role === 'customer' || session.role === 'admin';

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="lg:w-48 shrink-0">
          <nav className="flex flex-row flex-wrap gap-2 lg:flex-col">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  pathname.startsWith(item.href)
                    ? 'bg-vellure-primary text-white'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          {isLoggedIn && (
            <div className="mt-6 space-y-2 border-t pt-4">
              {session.email && (
                <p className="truncate text-xs text-muted-foreground">{session.email}</p>
              )}
              <LogoutButton showIcon />
            </div>
          )}
        </aside>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Tag,
  ShoppingBag,
  RotateCcw,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { href: '/admin/returns', label: 'Returns', icon: RotateCcw },
  { href: '/admin/customers', label: 'Customers', icon: Users },
];

function AdminIdentity({ adminEmail }: { adminEmail?: string | null }) {
  if (!adminEmail) return null;

  return (
    <div className="rounded-lg border border-vellure-primary/20 bg-vellure-primary/5 px-3 py-2.5">
      <div className="mb-1.5 flex items-center gap-2">
        <Shield className="h-4 w-4 shrink-0 text-vellure-primary" aria-hidden />
        <Badge variant="default" className="bg-vellure-primary text-[10px] uppercase tracking-wide">
          Administrator
        </Badge>
      </div>
      <p className="truncate text-xs text-muted-foreground" title={adminEmail}>
        {adminEmail}
      </p>
    </div>
  );
}

interface AdminSidebarProps {
  adminEmail?: string | null;
}

export function AdminSidebar({ adminEmail }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoginPage = pathname.startsWith('/admin/login');

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b bg-background px-4 py-3 md:hidden">
        <div className="min-w-0 flex-1">
          <span className="text-lg font-bold">Vellure Admin</span>
          {adminEmail && !isLoginPage && (
            <p className="truncate text-xs text-muted-foreground">{adminEmail}</p>
          )}
        </div>
        {!isLoginPage && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        )}
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && !isLoginPage && (
        <div className="space-y-1 border-b bg-background px-4 py-2 md:hidden">
          {adminEmail && (
            <div className="mb-2 px-1">
              <AdminIdentity adminEmail={adminEmail} />
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}

      {/* Desktop sidebar */}
      {!isLoginPage && (
        <aside className="hidden md:flex md:w-64 md:flex-col md:border-r bg-background">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-lg font-bold">Vellure Admin</span>
          </div>
          {adminEmail && (
            <div className="border-b px-3 py-3">
              <AdminIdentity adminEmail={adminEmail} />
            </div>
          )}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t px-3 py-4">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </aside>
      )}
    </>
  );
}

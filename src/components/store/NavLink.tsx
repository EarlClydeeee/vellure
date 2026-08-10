'use client';

import Link from 'next/link';
import { useLinkStatus } from 'next/link';
import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

function NavLinkPendingIndicator() {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return (
    <span className="ml-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
  );
}

export function NavLink({ href, className, children, onClick }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'inline-flex items-center transition-opacity',
        className
      )}
    >
      <NavLinkContent>{children}</NavLinkContent>
    </Link>
  );
}

function NavLinkContent({ children }: { children: React.ReactNode }) {
  const { pending } = useLinkStatus();
  return (
    <span
      className={cn(
        'inline-flex items-center transition-opacity',
        pending && 'opacity-50'
      )}
    >
      {children}
      <NavLinkPendingIndicator />
    </span>
  );
}

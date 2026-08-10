'use client';

import { useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NavLink } from '@/components/store/NavLink';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function buildPageHref(page: number, searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams.toString());
  if (page <= 1) {
    params.delete('page');
  } else {
    params.set('page', String(page));
  }
  const qs = params.toString();
  return qs ? `/products?${qs}` : '/products';
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const pages: (number | 'ellipsis')[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3, 'ellipsis', totalPages);
  }

  return (
    <nav className="flex items-center justify-center gap-2" aria-label="Pagination">
      <NavLink
        href={buildPageHref(Math.max(1, currentPage - 1), searchParams)}
        className={cn(
          'flex h-9 items-center gap-1 rounded-full px-3 text-sm transition-colors',
          currentPage === 1
            ? 'pointer-events-none opacity-40'
            : 'hover:bg-muted'
        )}
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </NavLink>

      <div className="flex items-center gap-1">
        {pages.map((page, i) =>
          page === 'ellipsis' ? (
            <span key={`e-${i}`} className="px-2 text-muted-foreground">
              ...
            </span>
          ) : (
            <NavLink
              key={page}
              href={buildPageHref(page, searchParams)}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors',
                page === currentPage
                  ? 'bg-vellure-primary text-white'
                  : 'hover:bg-muted'
              )}
            >
              {page}
            </NavLink>
          )
        )}
      </div>

      <NavLink
        href={buildPageHref(Math.min(totalPages, currentPage + 1), searchParams)}
        className={cn(
          'flex h-9 items-center gap-1 rounded-full px-3 text-sm transition-colors',
          currentPage === totalPages
            ? 'pointer-events-none opacity-40'
            : 'hover:bg-muted'
        )}
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </NavLink>
    </nav>
  );
}

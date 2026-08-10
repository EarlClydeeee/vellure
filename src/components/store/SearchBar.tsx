'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useCallback, Suspense } from 'react';
import { Search } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface SearchBarInnerProps {
  variant?: 'default' | 'hero';
  className?: string;
}

function SearchBarInner({ variant = 'default', className }: SearchBarInnerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get('search') ?? '');

  const updateSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set('search', term);
      } else {
        params.delete('search');
      }
      params.delete('page');
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    updateSearch(value);
  }

  if (variant === 'hero') {
    return (
      <form
        onSubmit={handleSubmit}
        className={cn('flex w-full max-w-md items-center gap-2', className)}
      >
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search on Vellure"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="h-11 w-full rounded-full border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/20"
          />
        </div>
        <button
          type="submit"
          className="h-11 shrink-0 rounded-full bg-[#111111] px-6 text-sm font-medium text-white transition-colors hover:bg-[#111111]/90"
        >
          Search
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex w-full max-w-xl gap-2', className)}>
      <input
        type="text"
        placeholder="Search on Vellure"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-11 flex-1 rounded-full border border-input bg-background px-5 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      />
      <button
        type="submit"
        className="h-11 shrink-0 rounded-full bg-[#111111] px-6 text-sm font-medium text-white transition-colors hover:bg-[#111111]/90"
      >
        Search
      </button>
    </form>
  );
}

interface SearchBarProps {
  variant?: 'default' | 'hero';
  className?: string;
}

export function SearchBar({ variant = 'default', className }: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <Skeleton
          className={cn(
            'h-11 rounded-full',
            variant === 'hero' ? 'w-full max-w-md' : 'w-full max-w-xl'
          )}
        />
      }
    >
      <SearchBarInner variant={variant} className={className} />
    </Suspense>
  );
}

export function SearchBarSkeleton() {
  return <Skeleton className="h-11 w-full max-w-xl rounded-full" />;
}

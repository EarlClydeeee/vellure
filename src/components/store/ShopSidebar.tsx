'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Home,
  Music,
  Smartphone,
  HardDrive,
  LayoutGrid,
  Filter,
  X,
} from 'lucide-react';
import { CategoryWithCount } from '@/lib/services/categories';
import { NavLink } from '@/components/store/NavLink';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ShopSidebarProps {
  categories: CategoryWithCount[];
  selectedCategory?: string;
  selectedFilter?: string;
}

const categoryIcons: Record<string, React.ReactNode> = {
  all: <LayoutGrid className="h-4 w-4" />,
  default: <Home className="h-4 w-4" />,
};

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('music')) return <Music className="h-4 w-4" />;
  if (lower.includes('phone')) return <Smartphone className="h-4 w-4" />;
  if (lower.includes('storage')) return <HardDrive className="h-4 w-4" />;
  if (lower.includes('home')) return <Home className="h-4 w-4" />;
  return categoryIcons.default;
}

function buildHref(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `/products?${qs}` : '/products';
}

function SidebarContent({
  categories,
  selectedCategory,
  selectedFilter,
  onNavigate,
}: ShopSidebarProps & { onNavigate?: () => void }) {
  const searchParams = useSearchParams();
  const search = searchParams.get('search') ?? undefined;
  const sort = searchParams.get('sort') ?? undefined;

  const filterLinks = [
    { label: 'New Arrival', value: 'newest' },
    { label: 'Best Seller', value: 'bestseller' },
    { label: 'On Discount', value: 'discount' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </h2>
        <nav className="space-y-1">
          {categories.map((category) => {
            const isAll = category.id === 'all';
            const isActive = isAll
              ? !selectedCategory
              : selectedCategory === category.id;

            return (
              <NavLink
                key={category.id}
                href={buildHref({
                  search,
                  sort,
                  filter: selectedFilter,
                  ...(isAll ? {} : { category: category.id }),
                })}
                onClick={onNavigate}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-muted font-medium text-foreground'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <span className="flex min-w-0 flex-1 items-center gap-2">
                  {isAll ? categoryIcons.all : getCategoryIcon(category.name)}
                  <span className="truncate">{category.name}</span>
                </span>
                <span className="ml-auto flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-medium text-white">
                  {category.productCount}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t pt-6">
        <nav className="space-y-1">
          {filterLinks.map((link) => (
            <NavLink
              key={link.value}
              href={buildHref({
                search,
                sort,
                category: selectedCategory,
                filter: link.value,
              })}
              onClick={onNavigate}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm transition-colors',
                selectedFilter === link.value
                  ? 'bg-muted font-medium text-foreground'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
              )}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function ShopSidebar(props: ShopSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <Button
          variant="outline"
          className="mb-4 w-full justify-start gap-2 rounded-full"
          onClick={() => setMobileOpen(true)}
        >
          <Filter className="h-4 w-4" />
          Filters & Categories
        </Button>
      </div>

      <aside className="hidden w-60 shrink-0 lg:block">
        <SidebarContent {...props} />
      </aside>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-background p-6 shadow-lg lg:hidden">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-semibold">Filters</h2>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close filters"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent {...props} onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}

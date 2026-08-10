import Link from 'next/link';
import {
  Home,
  Music,
  Smartphone,
  HardDrive,
  LayoutGrid,
  ShoppingBag,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryWithCount } from '@/lib/services/categories';

interface CategoryCardsProps {
  categories: CategoryWithCount[];
  variant?: 'default' | 'abenson';
}

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('music')) return Music;
  if (lower.includes('phone')) return Smartphone;
  if (lower.includes('storage')) return HardDrive;
  if (lower.includes('home')) return Home;
  return ShoppingBag;
}

export function CategoryCards({
  categories,
  variant = 'default',
}: CategoryCardsProps) {
  if (categories.length === 0) return null;

  if (variant === 'abenson') {
    return (
      <section className="border-b px-4 py-8">
        <div className="container mx-auto">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide md:justify-center md:gap-8">
            <Link
              href="/products"
              className="flex shrink-0 cursor-pointer flex-col items-center gap-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-vellure-primary focus-visible:ring-offset-2 rounded-full"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-vellure-primary/10 transition-colors duration-200 hover:bg-vellure-primary/20 md:h-20 md:w-20">
                <LayoutGrid className="h-7 w-7 text-vellure-primary" />
              </div>
              <span className="text-xs font-medium text-gray-700 md:text-sm">
                Best Deals
              </span>
            </Link>
            {categories.map((category) => {
              const Icon = getCategoryIcon(category.name);
              return (
                <Link
                  key={category.id}
                  href={`/products?category=${category.id}`}
                  className="flex shrink-0 cursor-pointer flex-col items-center gap-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-vellure-primary focus-visible:ring-offset-2 rounded-full"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 transition-colors duration-200 hover:bg-vellure-primary/10 md:h-20 md:w-20">
                    <Icon className="h-7 w-7 text-vellure-primary" />
                  </div>
                  <span className="max-w-[80px] text-xs font-medium text-gray-700 md:text-sm">
                    {category.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-12">
      <div className="container mx-auto">
        <h2 className="font-display mb-8 text-2xl font-medium tracking-tight sm:text-3xl">
          Shop by Category
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/products?category=${category.id}`}>
              <Card className="group cursor-pointer border-[#e5e7eb] transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-6">
                  <span className="text-lg font-medium transition-colors group-hover:text-vellure-primary">
                    {category.name}
                  </span>
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-medium text-white">
                    {category.productCount}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

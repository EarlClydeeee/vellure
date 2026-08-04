'use client';

import { Product } from '@/lib/types';
import { ProductCard } from '@/components/store/ProductCard';
import { CountdownTimer, getDefaultDealsEndDate } from '@/components/store/CountdownTimer';
import { NavLink } from '@/components/store/NavLink';

interface DealsSectionProps {
  products: Product[];
  targetDate?: string;
}

export function DealsSection({
  products,
  targetDate = getDefaultDealsEndDate(),
}: DealsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-[#0057B8] py-10 md:py-14">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="container relative mx-auto px-4">
        <div className="mb-8 flex flex-col items-center justify-between gap-6 lg:flex-row lg:items-start">
          <div>
            <h2 className="text-3xl font-bold uppercase tracking-tight text-white md:text-4xl lg:text-5xl">
              Vellure Deals Fest
            </h2>
            <p className="mt-2 text-sm text-white/80">
              Limited-time offers — ends soon
            </p>
          </div>
          <CountdownTimer targetDate={targetDate} className="shrink-0" />
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => (
            <div key={product.id} className="w-64 shrink-0">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <NavLink
            href="/products"
            className="inline-flex items-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0057B8] transition-colors hover:bg-white/90"
          >
            See More
          </NavLink>
        </div>
      </div>
    </section>
  );
}

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroBanner() {
  return (
    <section className="relative w-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 px-4 py-20 text-center text-white md:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
          Welcome to Vellure
        </h1>
        <p className="mt-4 text-base text-blue-100 sm:text-lg md:text-xl">
          Discover premium products at unbeatable prices
        </p>
        <div className="mt-8">
          <Link href="/products">
            <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

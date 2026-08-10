import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { finalCta } from '@/lib/data/marketing-content';

export function FinalCtaBand() {
  return (
    <section className="bg-vellure-primary py-12 md:py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-2xl font-medium text-white md:text-4xl">{finalCta.headline}</h2>
        <p className="mx-auto mt-3 max-w-lg text-white/90">{finalCta.subcopy}</p>
        <Button
          asChild
          size="lg"
          className="mt-6 cursor-pointer rounded-full bg-white px-8 text-vellure-primary hover:bg-white/90"
        >
          <Link href={finalCta.href} className="inline-flex items-center gap-2">
            {finalCta.buttonLabel}
            <ArrowRight className="h-5 w-5" aria-hidden />
          </Link>
        </Button>
      </div>
    </section>
  );
}

import { ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { whyVellureItems } from '@/lib/data/marketing-content';

const icons = {
  curated: Sparkles,
  delivery: Truck,
  secure: ShieldCheck,
} as const;

export function WhyVellure() {
  return (
    <section className="bg-vellure-surface py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-2xl font-bold text-vellure-text md:text-3xl">
            Why Shop with Vellure
          </h2>
          <p className="mt-2 text-slate-600">
            Premium tech, trusted service, and a shopping experience built for Filipino shoppers.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {whyVellureItems.map((item) => {
            const Icon = icons[item.id as keyof typeof icons];
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-sky-100 bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-vellure-primary/10 text-vellure-primary">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-vellure-text">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

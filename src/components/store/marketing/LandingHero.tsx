import Link from 'next/link';
import Image from 'next/image';
import { landingHeroCopy } from '@/lib/data/marketing-content';

export function LandingHero() {
  return (
    <section className="relative min-h-[100svh]">
      <Image
        src={landingHeroCopy.image}
        alt="Vellure lifestyle"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

      <div className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center px-4">
        <div className="text-center">
          {landingHeroCopy.lines.map((line) => (
            <p
              key={line}
              className="font-display text-sm font-medium uppercase tracking-[0.2em] text-white md:text-lg"
            >
              {line}
            </p>
          ))}
          <Link
            href={landingHeroCopy.cta.href}
            className="mt-8 inline-block border border-white px-8 py-3 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors duration-200 hover:bg-white hover:text-vellure-primary"
          >
            {landingHeroCopy.cta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

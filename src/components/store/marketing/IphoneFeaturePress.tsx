import Link from 'next/link';
import Image from 'next/image';
import { iphoneFeaturePress } from '@/lib/data/marketing-content';

export function IphoneFeaturePress() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col gap-10 md:flex-row md:gap-12 lg:gap-16">
          <p
            className="shrink-0 text-xs font-medium uppercase tracking-[0.25em] text-[#111111] md:[writing-mode:vertical-rl] md:[text-orientation:mixed]"
          >
            {iphoneFeaturePress.sidebarLabel}
          </p>

          <div className="grid flex-1 gap-8 md:grid-cols-3 md:gap-6 lg:gap-8">
            {iphoneFeaturePress.cards.map((card) => (
              <article key={card.id} className="flex flex-col">
                <div className="relative mb-6 aspect-[3/4] overflow-hidden bg-slate-100">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-contain p-6"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="text-lg font-semibold text-[#111111] md:text-xl">
                  {card.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-600">
                  {card.description}
                </p>
                <Link
                  href={card.cta.href}
                  className="mt-6 inline-block self-start border border-[#1C1917] px-5 py-2.5 text-xs font-medium uppercase tracking-[0.12em] text-[#111111] transition-colors duration-200 hover:bg-[#111111] hover:text-white"
                >
                  {card.cta.label}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

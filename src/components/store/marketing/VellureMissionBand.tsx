import Link from 'next/link';
import Image from 'next/image';
import {
  Truck,
  CreditCard,
  ShieldCheck,
  Headphones,
  BadgeCheck,
  Gift,
} from 'lucide-react';
import {
  vellureMission,
  type ServiceBadgeIcon,
} from '@/lib/data/marketing-content';

const iconMap: Record<ServiceBadgeIcon, typeof ShieldCheck> = {
  gift: Gift,
  'credit-card': CreditCard,
  truck: Truck,
  'shield-check': ShieldCheck,
  headphones: Headphones,
  'badge-check': BadgeCheck,
};

export function VellureMissionBand() {
  return (
    <section className="bg-vellure-primary">
      <div className="grid md:grid-cols-[55%_45%]">
        <div className="flex flex-col justify-center px-6 py-16 md:px-12 md:py-20 lg:px-16">
          <h2 className="font-display max-w-lg text-3xl font-medium leading-tight text-white md:text-4xl lg:text-5xl">
            {vellureMission.headline}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85 md:text-base">
            {vellureMission.subcopy}
          </p>
          <Link
            href={vellureMission.cta.href}
            className="mt-8 inline-block self-start border border-white px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-white transition-colors duration-200 hover:bg-white hover:text-vellure-primary"
          >
            {vellureMission.cta.label}
          </Link>

          <div className="mt-12 flex gap-8 md:mt-16">
            <div className="hidden w-px shrink-0 bg-white/30 md:block" aria-hidden />
            <ul className="space-y-5">
              {vellureMission.pillars.map((pillar) => {
                const Icon = iconMap[pillar.icon];
                return (
                  <li key={pillar.text} className="flex items-start gap-3">
                    <Icon className="mt-0.5 h-5 w-5 shrink-0 text-white/90" aria-hidden />
                    <span className="text-sm text-white/90 md:text-base">{pillar.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="relative min-h-[320px] md:min-h-[480px]">
          <Image
            src={vellureMission.image}
            alt="Vellure community"
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
      </div>
    </section>
  );
}

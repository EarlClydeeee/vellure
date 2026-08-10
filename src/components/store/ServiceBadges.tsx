import Link from 'next/link';
import {
  Truck,
  CreditCard,
  ShieldCheck,
  Headphones,
  Gift,
  BadgeCheck,
} from 'lucide-react';
import { serviceBadges, type ServiceBadgeIcon } from '@/lib/data/marketing-content';

const iconMap: Record<ServiceBadgeIcon, typeof Gift> = {
  gift: Gift,
  'credit-card': CreditCard,
  truck: Truck,
  'shield-check': ShieldCheck,
  headphones: Headphones,
  'badge-check': BadgeCheck,
};

export function ServiceBadges() {
  return (
    <section className="border-y bg-vellure-surface py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {serviceBadges.map((badge) => {
            const Icon = iconMap[badge.icon];
            return (
              <Link
                key={badge.id}
                href={badge.href}
                className="group flex max-w-[110px] cursor-pointer flex-col items-center gap-2 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-vellure-primary focus-visible:ring-offset-2 rounded-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm transition-colors duration-200 group-hover:bg-vellure-primary/10">
                  <Icon className="h-5 w-5 text-vellure-primary" aria-hidden />
                </div>
                <span className="text-xs font-medium text-gray-700">{badge.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

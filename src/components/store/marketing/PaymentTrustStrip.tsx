import {
  Banknote,
  CreditCard,
  Smartphone,
  Wallet,
} from 'lucide-react';
import { paymentMethods, type PaymentMethodIcon } from '@/lib/data/marketing-content';

const iconMap: Record<PaymentMethodIcon, typeof Smartphone> = {
  smartphone: Smartphone,
  wallet: Wallet,
  banknote: Banknote,
  'credit-card': CreditCard,
};

export function PaymentTrustStrip() {
  return (
    <section className="border-b bg-white py-6">
      <div className="container mx-auto px-4">
        <p className="mb-4 text-center text-xs font-medium uppercase tracking-wider text-slate-500">
          Accepted payment methods
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {paymentMethods.map((method) => {
            const Icon = iconMap[method.icon];
            return (
              <div
                key={method.id}
                className="flex items-center gap-2 text-sm font-medium text-vellure-text"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-vellure-surface text-vellure-primary">
                  <Icon className="h-4 w-4" aria-hidden />
                </div>
                <span>{method.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import {
  Truck,
  CreditCard,
  ShieldCheck,
  Headphones,
  Gift,
  Wrench,
} from 'lucide-react';

const badges = [
  { icon: Gift, label: 'Vellure Rewards' },
  { icon: CreditCard, label: 'Payment Solutions' },
  { icon: Truck, label: 'Same Day Delivery' },
  { icon: ShieldCheck, label: 'Secure Checkout' },
  { icon: Headphones, label: '24/7 Support' },
  { icon: Wrench, label: 'Home Services' },
];

export function ServiceBadges() {
  return (
    <section className="border-y bg-gray-50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
          {badges.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <Icon className="h-5 w-5 text-[#0057B8]" />
              </div>
              <span className="max-w-[100px] text-xs font-medium text-gray-700">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

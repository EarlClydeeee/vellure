import { Tag } from 'lucide-react';
import { promoVouchers } from '@/lib/data/marketing-content';

export function PromoVouchers() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-vellure-text md:text-3xl">
            Vouchers & Offers
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Apply codes at checkout for extra savings
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {promoVouchers.map((voucher) => (
            <article
              key={voucher.id}
              className="min-w-[260px] shrink-0 cursor-default rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-vellure-primary md:min-w-[280px]"
              tabIndex={0}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${voucher.accent} text-white`}
                >
                  <Tag className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <h3 className="font-semibold text-vellure-text">{voucher.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{voucher.description}</p>
                  <p className="mt-3 inline-block rounded-md bg-vellure-surface px-2.5 py-1 font-mono text-sm font-bold text-vellure-primary">
                    {voucher.code}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

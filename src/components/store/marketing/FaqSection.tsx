'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '@/lib/data/marketing-content';
import { cn } from '@/lib/utils';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(faqItems[0]?.id ?? null);

  return (
    <section id="faq" className="py-12 md:py-16">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl font-medium text-vellure-text md:text-3xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-slate-600">
            Everything you need to know before you buy.
          </p>
        </div>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
          {faqItems.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div key={item.id} id={`faq-${item.id}`}>
                <button
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : item.id)}
                  className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors duration-200 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-vellure-primary md:px-6 md:py-5"
                  aria-expanded={isOpen}
                >
                  <span className="font-semibold text-vellure-text">{item.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200',
                      isOpen && 'rotate-180'
                    )}
                    aria-hidden
                  />
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    isOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'
                  )}
                  role="region"
                  aria-hidden={!isOpen}
                >
                  <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600 md:px-6 md:pb-5">
                    {item.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { stickyCta } from '@/lib/data/marketing-content';

const SCROLL_SHOW = 400;
const FOOTER_HIDE_OFFSET = 120;

export function StickyShopCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    function onScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const viewHeight = window.innerHeight;
      const nearBottom = scrollY + viewHeight >= docHeight - FOOTER_HIDE_OFFSET;

      setVisible(scrollY > SCROLL_SHOW && !nearBottom);
    }

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [dismissed]);

  if (dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] md:hidden"
      role="region"
      aria-label="Quick shop"
    >
      <div className="flex items-center gap-3">
        <Button
          asChild
          className="h-11 flex-1 cursor-pointer rounded-full bg-vellure-cta text-white hover:bg-vellure-cta/90"
        >
          <Link href={stickyCta.href} className="inline-flex items-center justify-center gap-2">
            <ShoppingBag className="h-4 w-4" aria-hidden />
            {stickyCta.label}
          </Link>
        </Button>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-full text-slate-500 transition-colors duration-200 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-vellure-primary"
          aria-label={stickyCta.dismissLabel}
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

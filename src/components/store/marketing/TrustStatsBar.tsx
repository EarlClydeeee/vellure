'use client';

import { useEffect, useRef, useState } from 'react';
import { trustStats } from '@/lib/data/marketing-content';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function useCountUp(target: number, duration: number, active: boolean, decimals = 0) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let frame: number;

    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Number((target * eased).toFixed(decimals)));
      if (progress < 1) frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, active, decimals]);

  return value;
}

function StatItem({
  label,
  value,
  suffix,
  decimals = 0,
  active,
}: {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
  active: boolean;
}) {
  const count = useCountUp(value, 1200, active, decimals);

  return (
    <div className="text-center">
      <p className="text-3xl font-bold text-vellure-text md:text-4xl">
        {decimals > 0 ? count.toFixed(decimals) : Math.round(count)}
        <span className="text-vellure-primary">{suffix}</span>
      </p>
      <p className="mt-1 text-sm text-slate-600 md:text-base">{label}</p>
    </div>
  );
}

export function TrustStatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-y border-sky-100 bg-vellure-surface py-10 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {trustStats.map((stat) => (
            <StatItem
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              decimals={'decimals' in stat ? stat.decimals : 0}
              active={active && !reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

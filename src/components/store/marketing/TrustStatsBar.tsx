'use client';

import { useEffect, useRef, useState } from 'react';
import { trustStats } from '@/lib/data/marketing-content';
import { useReducedMotion } from '@/hooks/useReducedMotion';

function useCountUp(
  target: number,
  duration: number,
  active: boolean,
  decimals = 0
) {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!active) {
      setValue(target);
      return;
    }

    setValue(0);
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

function formatStatDisplay(
  count: number,
  decimals: number,
  label: string
): string {
  if (label === 'Same-Day Cutoff') {
    const hours = Math.round(count);
    return `${hours.toString().padStart(2, '0')}:00`;
  }

  return decimals > 0 ? count.toFixed(decimals) : Math.round(count).toString();
}

function StatItem({
  label,
  value,
  suffix,
  decimals = 0,
  animate,
}: {
  label: string;
  value: number;
  suffix: string;
  decimals?: number;
  animate: boolean;
}) {
  const count = useCountUp(value, 1200, animate, decimals);
  const display = formatStatDisplay(count, decimals, label);

  return (
    <div className="text-center">
      <p className="min-h-[2.5rem] text-3xl font-bold tabular-nums text-vellure-text md:min-h-[3rem] md:text-4xl">
        {display}
        {label !== 'Same-Day Cutoff' && (
          <span className="text-vellure-primary">{suffix}</span>
        )}
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
    <section
      ref={ref}
      className="border-y border-sky-100 bg-vellure-surface py-10 md:py-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {trustStats.map((stat) => (
            <StatItem
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              decimals={'decimals' in stat ? stat.decimals : 0}
              animate={active && !reduced}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

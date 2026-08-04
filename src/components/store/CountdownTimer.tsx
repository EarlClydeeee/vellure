'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: string | Date;
  expiredMessage?: string;
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function pad(num: number) {
  return num.toString().padStart(2, '0');
}

function getTimeLeft(target: number): TimeLeft | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  };
}

function Unit({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="min-w-[80px] rounded-xl border border-white/10 bg-[#111111] px-6 py-5 text-center text-4xl font-bold tabular-nums text-white shadow-lg sm:min-w-[80px]">
        {value}
      </div>
      <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </div>
  );
}

export function CountdownTimer({
  targetDate,
  expiredMessage = "Time's Up!",
  className,
}: CountdownTimerProps) {
  const target = new Date(targetDate).getTime();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(() =>
    getTimeLeft(target)
  );

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!timeLeft) {
    return (
      <div className={cn('text-center text-4xl font-bold text-[#FF00CC]', className)}>
        {expiredMessage}
      </div>
    );
  }

  return (
    <div className={cn('flex items-start gap-3 sm:gap-4', className)}>
      <Unit value={pad(timeLeft.days)} label="Days" />
      <Unit value={pad(timeLeft.hours)} label="Hours" />
      <Unit value={pad(timeLeft.minutes)} label="Minutes" />
      <Unit value={pad(timeLeft.seconds)} label="Seconds" />
    </div>
  );
}

export function getDefaultDealsEndDate(): string {
  if (process.env.NEXT_PUBLIC_DEALS_END_DATE) {
    return process.env.NEXT_PUBLIC_DEALS_END_DATE;
  }
  const d = new Date();
  d.setDate(d.getDate() + ((7 - d.getDay()) % 7 || 7));
  d.setHours(23, 59, 0, 0);
  return d.toISOString();
}

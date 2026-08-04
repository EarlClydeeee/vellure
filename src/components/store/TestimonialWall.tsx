'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  VELLURE_TESTIMONIALS,
  VellureTestimonial,
} from '@/lib/data/vellure-testimonials';

interface TestimonialWallProps {
  testimonials?: VellureTestimonial[];
  title?: string;
  className?: string;
}

function TestimonialCard({ testimonial }: { testimonial: VellureTestimonial }) {
  return (
    <div className="min-w-[320px] w-[320px] shrink-0 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="mb-4 flex items-center gap-3">
        <Image
          src={testimonial.avatar}
          alt={testimonial.name}
          width={48}
          height={48}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold text-[#111111]">{testimonial.name}</p>
          <p className="text-sm text-gray-500">{testimonial.handle}</p>
        </div>
      </div>
      <p className="text-left text-sm leading-relaxed text-gray-700">
        {testimonial.text}
      </p>
    </div>
  );
}

function MarqueeRow({
  items,
  direction,
}: {
  items: VellureTestimonial[];
  direction: 'left' | 'right';
}) {
  const doubled = [...items, ...items];

  return (
    <div className="group relative overflow-hidden py-6">
      <div
        className={cn(
          'flex w-max gap-6',
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        )}
        style={{ animationDuration: '40s' }}
      >
        {doubled.map((t, i) => (
          <TestimonialCard key={`${t.handle}-${i}`} testimonial={t} />
        ))}
      </div>
    </div>
  );
}

export function TestimonialWall({
  testimonials = VELLURE_TESTIMONIALS,
  title = 'What customers say about Vellure',
  className,
}: TestimonialWallProps) {
  const row1 = testimonials.slice(0, Math.ceil(testimonials.length / 2));
  const row2 = testimonials.slice(Math.ceil(testimonials.length / 2));

  return (
    <section className={cn('overflow-hidden py-12', className)}>
      <style jsx global>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right linear infinite;
        }
        .group:hover .animate-marquee-left,
        .group:hover .animate-marquee-right {
          animation-play-state: paused;
        }
      `}</style>
      <div className="container mx-auto mb-8 px-4">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h2>
      </div>
      <MarqueeRow items={row1.length ? row1 : testimonials} direction="left" />
      <MarqueeRow items={row2.length ? row2 : testimonials} direction="right" />
    </section>
  );
}

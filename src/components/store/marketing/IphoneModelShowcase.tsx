'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { iphoneModelShowcase } from '@/lib/data/marketing-content';

export function IphoneModelShowcase() {
  const [activeId, setActiveId] = useState<string>(iphoneModelShowcase.models[0].id);
  const activeModel =
    iphoneModelShowcase.models.find((m) => m.id === activeId) ??
    iphoneModelShowcase.models[0];

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid items-center gap-10 md:grid-cols-[auto_1fr_auto] md:gap-12 lg:gap-16">
          <p
            className="text-brand-label hidden text-vellure-ink md:block md:[writing-mode:vertical-rl] md:[text-orientation:mixed]"
            aria-hidden
          >
            {iphoneModelShowcase.sidebarLabel}
          </p>
          <p className="text-brand-label text-center text-vellure-ink md:hidden">
            {iphoneModelShowcase.sidebarLabel}
          </p>

          <div className="relative mx-auto w-full max-w-md">
            <div
              className="absolute inset-0 translate-x-3 translate-y-3 bg-slate-200 shadow-md"
              aria-hidden
            />
            <div
              className="absolute inset-0 translate-x-6 translate-y-6 bg-slate-100"
              aria-hidden
            />

            <div className="relative z-10 aspect-[4/5] overflow-hidden bg-white shadow-xl">
              {iphoneModelShowcase.models.map((model, index) => {
                const isActive = model.id === activeId;
                return (
                  <div
                    key={model.id}
                    className={cn(
                      'absolute inset-0 transition-opacity duration-[400ms] ease-out',
                      isActive ? 'opacity-100' : 'pointer-events-none opacity-0'
                    )}
                    aria-hidden={!isActive}
                  >
                    <Image
                      src={model.image}
                      alt={isActive ? model.label : ''}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 100vw, 400px"
                      priority={index === 0}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col justify-between md:min-h-[420px]">
            <ul className="space-y-4 md:space-y-6" role="listbox" aria-label="iPhone models">
              {iphoneModelShowcase.models.map((model) => {
                const isActive = model.id === activeId;
                return (
                  <li key={model.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={isActive}
                      className={cn(
                        'font-display cursor-pointer text-left text-2xl font-medium transition-colors duration-200 md:text-3xl lg:text-4xl',
                        isActive ? 'text-vellure-ink' : 'text-gray-400 hover:text-gray-600'
                      )}
                      onMouseEnter={() => setActiveId(model.id)}
                      onFocus={() => setActiveId(model.id)}
                      onClick={() => setActiveId(model.id)}
                    >
                      {model.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            <Link
              href={activeModel.href}
              className="btn-ghost-brand mt-10 self-start md:mt-0"
            >
              {iphoneModelShowcase.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

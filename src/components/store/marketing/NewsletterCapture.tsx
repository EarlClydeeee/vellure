'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { newsletter } from '@/lib/data/marketing-content';
import { cn } from '@/lib/utils';

interface NewsletterCaptureProps {
  variant?: 'inline' | 'footer';
  className?: string;
}

export function NewsletterCapture({ variant = 'inline', className }: NewsletterCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? newsletter.errorMessage);

      setStatus('success');
      setMessage(newsletter.successMessage);
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : newsletter.errorMessage);
    }
  }

  if (variant === 'footer') {
    return (
      <form onSubmit={handleSubmit} className={cn('flex flex-col gap-2 sm:flex-row', className)}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={newsletter.footerPlaceholder}
          required
          aria-label="Email address"
          className="flex-1 rounded-lg border border-white/20 bg-white/10 px-4 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-vellure-primary"
        />
        <Button
          type="submit"
          disabled={status === 'loading'}
          className="cursor-pointer rounded-lg bg-vellure-cta text-white hover:bg-vellure-cta/90"
        >
          {status === 'loading' ? newsletter.loadingLabel : newsletter.submitLabel}
        </Button>
        {message && (
          <p
            className={cn(
              'w-full text-xs',
              status === 'success' ? 'text-green-300' : 'text-red-300'
            )}
            role="status"
          >
            {message}
          </p>
        )}
      </form>
    );
  }

  return (
    <section className={cn('bg-vellure-surface py-12 md:py-16', className)}>
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-vellure-primary/10 text-vellure-primary">
            <Mail className="h-6 w-6" aria-hidden />
          </div>
          <h2 className="text-2xl font-bold text-vellure-text md:text-3xl">
            {newsletter.headline}
          </h2>
          <p className="mt-2 text-slate-600">{newsletter.subcopy}</p>
          <p className="mt-1 text-sm font-medium text-vellure-cta">{newsletter.incentive}</p>

          <form
            onSubmit={handleSubmit}
            className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={newsletter.inlinePlaceholder}
              required
              aria-label="Email address"
              className="flex-1 rounded-full border border-sky-200 bg-white px-5 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-vellure-primary"
            />
            <Button
              type="submit"
              disabled={status === 'loading'}
              className="cursor-pointer rounded-full bg-vellure-cta px-8 text-white hover:bg-vellure-cta/90"
            >
              {status === 'loading' ? newsletter.loadingLabel : newsletter.submitLabel}
            </Button>
          </form>

          {message && (
            <p
              className={cn(
                'mt-3 text-sm',
                status === 'success' ? 'text-emerald-600' : 'text-red-600'
              )}
              role="status"
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

import { Mail, MessageCircle } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Contact Us | Vellure',
  description: 'Get in touch with Vellure support for orders, warranty, and product questions.',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12 md:py-16">
      <h1 className="font-display text-3xl font-medium text-vellure-text md:text-4xl">
        Contact Us
      </h1>
      <p className="mt-3 text-muted-foreground">
        We&apos;re here to help with orders, delivery, and product questions across the
        Philippines.
      </p>

      <div className="mt-10 space-y-6">
        <a
          href="mailto:hello@vellure.com"
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-vellure-primary/30"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vellure-surface text-vellure-primary">
            <Mail className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block font-medium text-vellure-text">Email</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              hello@vellure.com
            </span>
          </span>
        </a>

        <Link
          href="/#faq-support"
          className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-6 transition-colors hover:border-vellure-primary/30"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-vellure-surface text-vellure-primary">
            <MessageCircle className="h-5 w-5" aria-hidden />
          </span>
          <span>
            <span className="block font-medium text-vellure-text">Support FAQ</span>
            <span className="mt-1 block text-sm text-muted-foreground">
              Chat, email assistance, and common questions
            </span>
          </span>
        </Link>
      </div>
    </div>
  );
}

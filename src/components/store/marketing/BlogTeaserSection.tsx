import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { blogTeasers } from '@/lib/data/marketing-content';

export function BlogTeaserSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-vellure-text md:text-3xl">
              Latest from Vellure
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Guides, stories, and tips from our team
            </p>
          </div>
          <Link
            href="/blog"
            className="hidden cursor-pointer items-center gap-1 text-sm font-semibold text-vellure-primary transition-colors duration-200 hover:text-vellure-primary/80 sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {blogTeasers.map((post) => (
            <Link
              key={post.id}
              href={post.href}
              className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-6 transition-colors duration-200 hover:border-vellure-primary/30 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-vellure-primary"
            >
              <h3 className="font-semibold text-vellure-text group-hover:text-vellure-primary">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{post.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-vellure-primary">
                Read more <ArrowRight className="h-3.5 w-3.5" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

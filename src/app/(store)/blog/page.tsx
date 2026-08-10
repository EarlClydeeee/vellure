import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { ShopHero } from '@/components/store/ShopHero';
import { blogPosts } from '@/lib/data/blog-posts';

export const dynamic = 'force-dynamic';

export default function BlogPage() {
  return (
    <div>
      <ShopHero title="Blog" tagline="Stories from Vellure" />
      <div className="container mx-auto px-4 pb-12 pt-20 md:pt-24">
        <p className="max-w-2xl text-muted-foreground">
          Welcome to the Vellure blog. Stories about our products, team, and
          curated lifestyle tips.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-md"
            >
              {post.image && (
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="font-display text-lg font-medium text-vellure-text group-hover:text-vellure-primary">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-vellure-primary">
                  Read more <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

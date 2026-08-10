import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { ShopHero } from '@/components/store/ShopHero';
import {
  blogPosts,
  getBlogPost,
  getBlogPostSlugs,
} from '@/lib/data/blog-posts';

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBlogPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: `${post.title} | Vellure Blog`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const paragraphs = post.body.split('\n\n').filter(Boolean);

  return (
    <div>
      <ShopHero title={post.title} tagline={post.excerpt} />
      <article className="container mx-auto max-w-3xl px-4 pb-16 pt-20 md:pt-24">
        <Link
          href="/blog"
          className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-vellure-primary transition-colors hover:text-vellure-primary/80"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Blog
        </Link>

        {post.image && (
          <div className="relative mb-8 aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
            />
          </div>
        )}

        <p className="text-sm text-muted-foreground">
          {new Date(post.publishedAt).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-700">
          {paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
}

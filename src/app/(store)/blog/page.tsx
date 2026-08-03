import { ShopHero } from '@/components/store/ShopHero';

export const dynamic = 'force-dynamic';

export default function BlogPage() {
  return (
    <div>
      <ShopHero title="Blog" tagline="Stories from Vellure" />
      <div className="container mx-auto px-4 pb-12 pt-20 md:pt-24">
        <p className="max-w-2xl text-muted-foreground">
          Welcome to the Vellure blog. Stories about our products, team, and
          curated lifestyle tips are coming soon.
        </p>

        <div className="mt-10 space-y-6">
          {[
            {
              title: 'Meet The Team',
              excerpt: 'Get to know the people behind Vellure.',
            },
            {
              title: 'New Arrivals This Season',
              excerpt: 'Discover what is new in our shop.',
            },
            {
              title: 'How We Curate Premium Products',
              excerpt: 'Our process for selecting every item we sell.',
            },
          ].map((post) => (
            <article
              key={post.title}
              className="rounded-lg border p-6 transition-shadow hover:shadow-sm"
            >
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

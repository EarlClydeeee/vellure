export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  image?: string;
  body: string;
  publishedAt: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'meet-the-team',
    title: 'Meet The Team',
    excerpt: 'Get to know the people behind Vellure.',
    image: '/meet-the-team/Earl.webp',
    publishedAt: '2026-03-01',
    body: `Vellure started as a passion project to bring premium Apple products and curated tech to shoppers in the Philippines — with honest pricing, fast fulfillment, and a store experience that feels as polished as the devices we sell.

I'm Earl, the founder and developer behind Vellure. I built the entire platform — from product catalog and checkout to admin tools and this storefront — because I wanted a shopping experience that matches the quality of the products on the shelf.

When you shop with us, you're supporting a small team that cares about every detail: verified stock, clear product specs, and support that actually responds.`,
  },
  {
    slug: 'new-arrivals-this-season',
    title: 'New Arrivals This Season',
    excerpt: 'Discover what is new in our shop.',
    image: '/iphone/iphone17pro/iphone_17pro__t1j902iw6kya_large.jpg',
    publishedAt: '2026-02-15',
    body: `This season brings fresh inventory across our iPhone lineup — from the latest iPhone 17 series to essential accessories that complete your setup.

We refresh our catalog regularly so you always see what's actually in stock. New arrivals land with full spec sheets, high-quality photos, and competitive PHP pricing.

Browse the shop to see what's new, or filter by New Arrival on the products page to catch the latest drops first.`,
  },
  {
    slug: 'how-we-curate-premium-products',
    title: 'How We Curate Premium Products',
    excerpt: 'Our process for selecting every item we sell.',
    image: '/iphone/iphone17pro/iphone_17__fb1277oq3eaa_large.jpg',
    publishedAt: '2026-01-20',
    body: `Every product on Vellure passes a simple test: would we recommend it to a friend?

We prioritize authentic Apple devices and trusted accessories, verify supplier reliability, and only list items we can fulfill with accurate stock counts. Specs are checked against official sources, and pricing is kept transparent — no hidden fees at checkout.

That curation layer is why our catalog stays focused. Fewer, better products beat an endless scroll of questionable listings every time.`,
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getBlogPostSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

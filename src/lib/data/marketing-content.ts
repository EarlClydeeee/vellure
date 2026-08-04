export const locale = {
  currency: 'PHP',
  symbol: '₱',
  country: 'PH',
  freeShippingThreshold: 5000,
} as const;

export const heroCopy = {
  title: 'Vellure',
  subtitle:
    'Authorized gadgets and premium tech, delivered fast across the Philippines. Shop with confidence.',
  tagline: 'Give All You Need',
  primaryCta: { label: 'Shop Now', href: '/products' },
  secondaryCta: { label: 'View Deals', href: '/products?sort=price_asc' },
} as const;

export const announcementBar = {
  message: `Free shipping on orders ${locale.symbol}${locale.freeShippingThreshold.toLocaleString()}+`,
  submessage: 'Order by 2 PM for same-day dispatch in Metro Manila',
  tagalog: `Libreng shipping sa orders ${locale.symbol}${locale.freeShippingThreshold.toLocaleString()}+`,
} as const;

export const trustStats = [
  { label: 'Products', value: 500, suffix: '+' },
  { label: 'Happy Customers', value: 2000, suffix: '+' },
  { label: 'Average Rating', value: 4.9, suffix: '/5', decimals: 1 },
  { label: 'Same-Day Cutoff', value: 14, suffix: ':00' },
] as const;

export type ServiceBadgeIcon =
  | 'gift'
  | 'credit-card'
  | 'truck'
  | 'shield-check'
  | 'headphones'
  | 'badge-check';

export const serviceBadges: {
  id: string;
  icon: ServiceBadgeIcon;
  label: string;
  description: string;
  href: string;
}[] = [
  {
    id: 'rewards',
    icon: 'gift',
    label: 'Vellure Rewards',
    description: 'Earn points on every purchase',
    href: '/#faq',
  },
  {
    id: 'payments',
    icon: 'credit-card',
    label: 'Flexible Payments',
    description: 'GCash, Maya, COD, and cards',
    href: '/#faq-payment',
  },
  {
    id: 'delivery',
    icon: 'truck',
    label: 'Fast PH Delivery',
    description: 'Same-day in Metro Manila before 2 PM',
    href: '/#faq-shipping',
  },
  {
    id: 'secure',
    icon: 'shield-check',
    label: 'Secure Checkout',
    description: 'Encrypted payments and buyer protection',
    href: '/#faq',
  },
  {
    id: 'support',
    icon: 'headphones',
    label: '24/7 Support',
    description: 'Chat and email assistance',
    href: '/#faq-support',
  },
  {
    id: 'warranty',
    icon: 'badge-check',
    label: 'Official Warranty',
    description: 'Authorized products with manufacturer coverage',
    href: '/#faq-warranty',
  },
];

export const promoBanners = [
  {
    id: 'shop-all',
    title: 'Shop All Tech',
    subtitle: 'Latest gadgets and accessories',
    href: '/products',
    image: '/images/shop-hero.jpg',
    large: true,
  },
  {
    id: 'iphones',
    title: 'iPhone Collection',
    subtitle: 'New arrivals in stock',
    href: '/products?category=Smartphones',
    image: '/iphone/iphone17/iphone_17pro__t1j902iw6kya_large.jpg',
    large: false,
  },
  {
    id: 'deals',
    title: 'Hot Deals',
    subtitle: 'Limited-time savings',
    href: '/products?sort=price_asc',
    image: '/iphone/iphone17/iphone_air__b5qmgl05ojyq_large.jpg',
    large: false,
  },
] as const;

export const promoVouchers = [
  {
    id: 'welcome',
    code: 'WELCOME10',
    title: '10% Off First Order',
    description: `New customers only. Min. spend ${locale.symbol}2,500.`,
    accent: 'bg-sky-500',
  },
  {
    id: 'tech',
    code: 'TECH88',
    title: '8.8 Tech Sale',
    description: 'Extra 8% off selected electronics this week.',
    accent: 'bg-orange-500',
  },
  {
    id: 'ship',
    code: 'FREESHIP',
    title: 'Free Shipping',
    description: `On orders over ${locale.symbol}${locale.freeShippingThreshold.toLocaleString()} nationwide.`,
    accent: 'bg-emerald-500',
  },
  {
    id: 'bundle',
    code: 'BUNDLE15',
    title: 'Bundle & Save 15%',
    description: 'Mix accessories with any device purchase.',
    accent: 'bg-violet-500',
  },
] as const;

export const whyVellureItems = [
  {
    id: 'curated',
    title: 'Curated Selection',
    description:
      'Every product is sourced from authorized distributors — authentic gadgets with official warranty, no gray-market risks.',
  },
  {
    id: 'delivery',
    title: 'Fast PH Delivery',
    description:
      'Order before 2 PM for same-day dispatch in Metro Manila. Nationwide delivery in 2–5 business days.',
  },
  {
    id: 'secure',
    title: 'Pay Your Way',
    description:
      'Checkout with GCash, Maya, Cash on Delivery, or credit/debit cards. Secure, encrypted, and buyer-protected.',
  },
] as const;

export type PaymentMethodIcon = 'smartphone' | 'wallet' | 'banknote' | 'credit-card';

export const paymentMethods: {
  id: string;
  label: string;
  icon: PaymentMethodIcon;
}[] = [
  { id: 'gcash', label: 'GCash', icon: 'smartphone' },
  { id: 'maya', label: 'Maya', icon: 'wallet' },
  { id: 'cod', label: 'Cash on Delivery', icon: 'banknote' },
  { id: 'cards', label: 'Credit & Debit Cards', icon: 'credit-card' },
];

export const deliveryZones = [
  {
    id: 'ncr',
    zone: 'Metro Manila',
    timeframe: 'Same-day if ordered before 2 PM',
  },
  {
    id: 'luzon',
    zone: 'Luzon',
    timeframe: '2–3 business days',
  },
  {
    id: 'vismin',
    zone: 'Visayas & Mindanao',
    timeframe: '3–5 business days',
  },
] as const;

export const faqItems = [
  {
    id: 'shipping',
    question: 'How long does shipping take in the Philippines?',
    answer:
      'Metro Manila: same-day dispatch for orders placed before 2 PM (delivery typically next day). Luzon: 2–3 business days. Visayas and Mindanao: 3–5 business days. Free shipping applies on orders over ₱5,000.',
  },
  {
    id: 'returns',
    question: 'What is your return policy?',
    answer:
      'Unopened items in original packaging may be returned within 7 days for a full refund. Defective products are covered under official manufacturer warranty — contact support with your order number for assistance.',
  },
  {
    id: 'payment',
    question: 'Which payment methods do you accept?',
    answer:
      'We accept GCash, Maya, Cash on Delivery (COD), credit and debit cards, and bank transfer. Choose your preferred method at checkout.',
  },
  {
    id: 'authentic',
    question: 'Are your products authentic?',
    answer:
      'Yes. All electronics are sourced from authorized distributors in the Philippines. Every device includes official manufacturer warranty coverage and authentic packaging.',
  },
  {
    id: 'warranty',
    question: 'Do products come with warranty?',
    answer:
      'Yes. All devices include official manufacturer warranty as stated on the product page. Warranty terms vary by brand — Apple, Samsung, and other brands follow their standard PH warranty policies.',
  },
  {
    id: 'support',
    question: 'How can I contact support?',
    answer:
      'Email us at support@vellure.com or hello@vellure.com. We respond within 24 hours on business days. Include your order number for faster assistance.',
  },
] as const;

export const testimonialAggregate = {
  rating: 4.9,
  count: 2000,
} as const;

export const newsletter = {
  headline: 'Get Deals in Your Inbox',
  subcopy: 'Subscribe for exclusive offers, new arrivals, and early access to sales.',
  incentive: 'Use code WELCOME10 for 10% off your first order.',
  successMessage: 'Thanks for subscribing! Check your inbox for your welcome offer.',
  errorMessage: 'Something went wrong. Please try again.',
  footerPlaceholder: 'Your email',
  inlinePlaceholder: 'you@example.com',
  submitLabel: 'Subscribe',
  loadingLabel: 'Subscribing...',
} as const;

export const blogTeasers = [
  {
    id: 'team',
    title: 'Meet The Team',
    excerpt: 'Get to know the people behind Vellure.',
    href: '/blog',
  },
  {
    id: 'arrivals',
    title: 'New Arrivals This Season',
    excerpt: 'Discover what is new in our shop.',
    href: '/blog',
  },
  {
    id: 'curate',
    title: 'How We Curate Premium Products',
    excerpt: 'Our process for selecting every item we sell.',
    href: '/blog',
  },
] as const;

export const finalCta = {
  headline: 'Ready to Shop?',
  subcopy: `Discover premium tech at great prices. Free shipping on orders over ${locale.symbol}${locale.freeShippingThreshold.toLocaleString()}.`,
  buttonLabel: 'Browse All Products',
  href: '/products',
} as const;

export const stickyCta = {
  label: 'Shop Now',
  href: '/products',
  dismissLabel: 'Dismiss shop banner',
} as const;

export const trustStrip = [
  'Authorized distributor products',
  'Official manufacturer warranty',
  'GCash, Maya, and COD accepted',
  `Free shipping over ${locale.symbol}${locale.freeShippingThreshold.toLocaleString()}`,
] as const;

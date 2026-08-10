# Landing Page Overrides — Vellure

Overrides `design-system/vellure/MASTER.md` for `/`.

## Editorial hero (Troubadour-inspired)

- **Background:** [`/landing/intro-1700559910.jpg`](/landing/intro-1700559910.jpg) — full-bleed lifestyle photo
- **Headline:** two uppercase lines, `tracking-[0.2em]`, white text, no giant logo overlay
- **CTA:** ghost button — transparent, white border, uppercase; no orange pill on hero
- **Overlay:** light bottom gradient only (`from-black/40`); keep photo warm and visible
- **AnnouncementBar:** hidden on landing

## Header (landing only)

- White background, no blur border
- Centered **VELLURE** wordmark — Cormorant Garamond, uppercase, wide tracking
- Nav row below logo: Shop · iPhone · Blog · Why Vellure
- Utility icons (search, cart, account) top-right
- Other routes keep compact sticky header unchanged

## Colors (below-the-fold marketing)

- Primary trust: `#0EA5E9` (sky blue bands, links)
- CTA accent: `#F97316` (Shop Now, See More, sticky CTA)
- Surface alternate: `#F0F9FF`
- Marketing text: `#0C4A6E`

## Typography

- Display logo: Cormorant Garamond (`font-display`)
- Headings: Rubik
- Body: Nunito Sans

## Market

- Philippines-first copy (PHP, GCash/Maya/COD)

## Section order

LandingHero → TrustStats → Categories → PromoBanners → ServiceBadges → PaymentTrustStrip → Deals → WhyVellure → iPhone Gallery → Vouchers → Masonry → Testimonials → Newsletter → BlogTeaser → FAQ → Final CTA

## UX rules

- Lucide icons only
- `cursor-pointer` on interactive cards
- `transition-colors duration-200` on hovers
- `prefers-reduced-motion`: disable masonry scroll + testimonial marquee
- Sticky CTA hides near footer

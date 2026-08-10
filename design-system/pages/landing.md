# Landing Page Overrides — Vellure

Overrides `design-system/vellure/MASTER.md` for `/`.

## Editorial hero (Troubadour-inspired)

- **Background:** [`/landing/intro-1700559910.jpg`](/landing/intro-1700559910.jpg) — full viewport below header
- **Headline:** two uppercase lines, `tracking-[0.2em]`, white text, no giant logo overlay
- **CTA:** ghost button — transparent, white border, uppercase; no orange pill on hero
- **Overlay:** light bottom gradient only (`from-black/40`); keep photo warm and visible
- **AnnouncementBar:** hidden on landing
- **TrustStatsBar:** removed from landing

## Header (landing only)

- White background, no blur border
- Centered **VELLURE** wordmark — Cormorant Garamond, uppercase, wide tracking
- Nav row below logo: Shop · iPhone · Blog · Why Vellure
- Utility icons (search, cart, account) top-right
- Other routes keep compact sticky header unchanged

## Troubadour feature sections

### IphoneModelShowcase
- Vertical sidebar: `A NEW APPROACH TO PREMIUM TECH`
- Center: stacked card image swap on hover/tap
- Right rail: iPhone 17, iPhone 17 Pro, iPhone Air, iPhone 17e
- Active label `#111111`, inactive `#9ca3af`
- Ghost outline CTA: Shop Vellure

### IphoneFeaturePress
- Vertical sidebar: `HOT OFF THE PRESS`
- 3 cards: Pro Camera, All-Day Battery, Ultra-Thin Design
- Outline CTA buttons `#1C1917` border, uppercase

### VellureMissionBand
- Background: `#1a3d2e` (forest green)
- Split layout: headline + pillars left, lifestyle photo right
- Ghost white Learn more CTA

## Colors (below-the-fold marketing)

- Primary trust: `#0EA5E9` (sky blue bands, links)
- CTA accent: `#F97316` (Deals, sticky CTA)
- Surface alternate: `#F0F9FF`
- Marketing text: `#0C4A6E`

## Typography

- Display logo: Cormorant Garamond (`font-display`)
- Headings: Rubik
- Body: Nunito Sans
- Sidebar labels: `text-xs tracking-[0.25em] uppercase`

## Market

- Philippines-first copy (PHP, GCash/Maya/COD)

## Section order

LandingHero → IphoneModelShowcase → IphoneFeaturePress → VellureMissionBand → Categories → Deals → ExpandingGallery → Vouchers → Masonry → Testimonials → Newsletter → BlogTeaser → FAQ → Final CTA

## UX rules

- Lucide icons only
- `cursor-pointer` on interactive cards
- `transition-colors duration-200` on hovers
- Model showcase: hover on desktop, tap on mobile
- `prefers-reduced-motion`: disable masonry scroll + testimonial marquee
- Sticky CTA hides near footer

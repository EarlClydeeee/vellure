# Vellure Clone Task — Design Context

**Source**: Mockup image (Stuffus-style, rebranded to Vellure)  
**Target route**: `/products` (Shop page)  
**Framework**: Next.js 16 App Router + Tailwind v4 + shadcn/ui + motion

## Section Map

1. **Header** — wordmark left, centered nav (Branda · Shop · Blog), search + profile icons right
2. **Shop hero** — full-width blurred interior photo, large white "Shop" title
3. **Sidebar** (~240px) — category list with count badges, filters (New Arrival, Best Seller, On Discount)
4. **Main column** — pill search bar + black Search button, 3-column product grid
5. **Product card** — category pill top-right, image, name, star rating, price, Add to Cart (outline) + Buy Now (solid black)
6. **Pagination** — Previous / numbered pages / Next
7. **Recommendations** — horizontal carousel, "Explore our recommendations"
8. **Footer** — dark newsletter CTA band, About/Support columns, social icons

## Design Tokens

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--vellure-black` | `#111111` | Primary buttons, Search button |
| `--footer-bg` | `#1a1a1a` | Newsletter band, footer dark section |
| `--badge-red` | `#ef4444` | Category count badges |
| `--card-border` | `#e5e7eb` | Product card borders |
| `--muted-text` | `#6b7280` | Secondary text, nav links |
| `--star-yellow` | `#fbbf24` | Rating stars |

### Typography
- Display hero: `text-5xl md:text-6xl font-bold text-white`
- Product name: `text-sm font-semibold`
- Nav links: `text-sm font-medium`
- Section titles: `text-2xl font-bold`

### Spacing
- Sidebar width: `240px` (`w-60`)
- Grid gap: `24px` (`gap-6`)
- Card padding: `16px` (`p-4`)
- Container: `max-w-7xl mx-auto px-4`

### Components
- Search: rounded-full input + rounded-full black button
- Buttons: `rounded-full`, outline vs solid black pair
- Pagination: rounded pill buttons, active page filled black
- Cards: white bg, subtle border, rounded-lg

## Assets
- `public/images/shop-hero.jpg` — shop hero background (gradient fallback if missing)
- Mockup reference: `screenshots/mockup-shop-desktop.png`

## Loading UX
- **Splash**: Vellure wordmark, once per session (`sessionStorage`)
- **Skeletons**: hero, sidebar, product grid (6–9 cards)
- **Navigation**: top progress bar + `loading.tsx` per route

## Component Checklist
- [x] VellureSplash
- [x] NavigationProgress + NavLink
- [x] ShopHero, ShopSidebar, Pagination, RecommendationsCarousel
- [x] ProductCardSkeleton, ShopSidebarSkeleton, ProductGridSkeleton
- [x] loading.tsx (store routes)
- [x] Header, Footer, SearchBar refactor
- [x] Blog placeholder page

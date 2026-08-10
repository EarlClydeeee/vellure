# Abenson Clone Guide — Vellure Landing Adaptation

**Reference**: https://www.abenson.com/  
**Target**: `/` landing page (Vellure storefront)  
**Screenshots**: `screenshots/abenson-hero.png`, `screenshots/abenson-deals.png`

## Section Map

| Order | Abenson | Vellure component |
|-------|---------|-------------------|
| 1 | Blue header + search | Header + ShopHero |
| 2 | Circular category icons | CategoryCards (abenson variant) |
| 3 | Service badges row | ServiceBadges |
| 4 | Appliance Fest + countdown + product scroll | DealsSection + CountdownTimer |
| 5 | iPhone / product showcase | ExpandingGallery |
| 6 | Visual masonry gallery | MasonryWrapperLanding |
| 7 | Social proof | TestimonialWall |

## Design Tokens

| Token | Abenson | Vellure |
|-------|---------|---------|
| Promo blue | `#0057B8` | `#0057B8` (deals band) |
| Primary dark | — | `#111111` |
| Card bg | `#FFFFFF` | `#FFFFFF` |
| Sale badge | red | `#ef4444` |
| Fest title | white bold uppercase | white bold uppercase |

## Assets

All masonry/gallery images from `/public`:
- `/images/shop-hero.jpg`
- `/iphone/iphone17/*.jpg` (4 files)

## Checklist

- [x] CountdownTimer — React client component
- [x] ExpandingGallery — iPhone mockups
- [x] MasonryWrapperLanding — public gallery manifest
- [x] TestimonialWall — Vellure testimonials
- [x] DealsSection — fest band + product scroll
- [x] Landing page composition

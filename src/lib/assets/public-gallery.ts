import { IPHONE_MOCKUP_IMAGES } from '@/lib/assets/iphone-mockups';

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
  href?: string;
}

export interface ExpandingGalleryItem {
  src: string;
  title: string;
  description: string;
  href: string;
}

export interface MasonryTileData {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  href?: string;
}

export const PUBLIC_GALLERY_IMAGES: GalleryImage[] = [
  {
    src: '/images/shop-hero.jpg',
    alt: 'Vellure lifestyle',
    title: 'Shop Vellure',
    subtitle: 'Premium curated for you',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17,
    alt: 'iPhone 17',
    title: 'iPhone 17',
    subtitle: 'Latest from Apple',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17Pro,
    alt: 'iPhone 17 Pro',
    title: 'iPhone 17 Pro',
    subtitle: 'Pro performance',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17e,
    alt: 'iPhone 17e',
    title: 'iPhone 17e',
    subtitle: 'Essential features',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphoneAir,
    alt: 'iPhone Air',
    title: 'iPhone Air',
    subtitle: 'Ultra-thin design',
    href: '/products',
  },
];

export const IPHONE_GALLERY_ITEMS: ExpandingGalleryItem[] = [
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17BlackWebp,
    title: 'iPhone 17',
    description: 'Advanced camera, all-day battery, stunning display',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17Pro,
    title: 'iPhone 17 Pro',
    description: 'Titanium design with pro camera and fastest chip',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17LavenderWebp,
    title: 'iPhone 17 Lavender',
    description: 'Bold color, premium build, everyday power',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphoneAirSkyBlueWebp,
    title: 'iPhone Air',
    description: 'Ultra-thin design meets pro capability',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17SageWebp,
    title: 'iPhone 17 Sage',
    description: 'Essential iPhone features at incredible value',
    href: '/products',
  },
];

export const MASONRY_IPHONE_TILES: MasonryTileData[] = [
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17Pro,
    alt: 'iPhone 17 Pro',
    title: 'iPhone 17 Pro',
    subtitle: 'Pro camera system',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17BlackWebp,
    alt: 'iPhone 17 Black',
    title: 'Midnight Black',
    subtitle: 'Classic finish',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17WhiteWebp,
    alt: 'iPhone 17 White',
    title: 'Starlight White',
    subtitle: 'Clean and timeless',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17LavenderWebp,
    alt: 'iPhone 17 Lavender',
    title: 'Lavender',
    subtitle: 'Express yourself',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17SageWebp,
    alt: 'iPhone 17 Sage',
    title: 'Sage Green',
    subtitle: 'Natural tone',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphoneAirSkyBlueWebp,
    alt: 'iPhone Air Sky Blue',
    title: 'Sky Blue',
    subtitle: 'Light and airy',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphoneAirCloudWhiteWebp,
    alt: 'iPhone Air Cloud White',
    title: 'Cloud White',
    subtitle: 'Pure and minimal',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphoneAirLightGoldWebp,
    alt: 'iPhone Air Light Gold',
    title: 'Light Gold',
    subtitle: 'Warm metallic',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphoneAirSpaceBlackWebp,
    alt: 'iPhone Air Space Black',
    title: 'Space Black',
    subtitle: 'Premium matte finish',
    href: '/products',
  },
];

export function distributeImagesToColumns(
  images: GalleryImage[],
  columnCount: number
): GalleryImage[][] {
  const columns: GalleryImage[][] = Array.from({ length: columnCount }, () => []);
  images.forEach((image, index) => {
    columns[index % columnCount].push(image);
  });
  return columns.map((col) => [...col, ...col]);
}

export function distributeMasonryToColumns(
  tiles: MasonryTileData[],
  columnCount: number
): MasonryTileData[][] {
  const columns: MasonryTileData[][] = Array.from(
    { length: columnCount },
    () => []
  );
  tiles.forEach((tile, index) => {
    columns[index % columnCount].push(tile);
  });
  return columns;
}

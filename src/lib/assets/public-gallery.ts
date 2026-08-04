import { IPHONE_MOCKUP_IMAGES } from '@/lib/assets/iphone-mockups';

export interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  subtitle?: string;
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

export interface ExpandingGalleryItem {
  src: string;
  title: string;
  description: string;
  href: string;
}

export const IPHONE_GALLERY_ITEMS: ExpandingGalleryItem[] = [
  {
    src: IPHONE_MOCKUP_IMAGES.iphone17,
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
    src: IPHONE_MOCKUP_IMAGES.iphone17e,
    title: 'iPhone 17e',
    description: 'Essential iPhone features at incredible value',
    href: '/products',
  },
  {
    src: IPHONE_MOCKUP_IMAGES.iphoneAir,
    title: 'iPhone Air',
    description: 'Ultra-thin design meets pro capability',
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
  // Duplicate each column for seamless scroll loop
  return columns.map((col) => [...col, ...col]);
}

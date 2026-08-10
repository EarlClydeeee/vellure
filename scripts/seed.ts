/**
 * Seed script using the anon/publishable key (works with current RLS policies).
 * Run: npm run seed
 * Requires: 001_initial_schema.sql + 003_tier1_commerce.sql applied first.
 */
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createClient } from '@supabase/supabase-js';

function loadEnv() {
  try {
    const envPath = resolve(process.cwd(), '.env.local');
    const content = readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // .env.local optional if vars already set
  }
}

loadEnv();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or Supabase key (NEXT_PUBLIC_SUPABASE_ANON_KEY / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) in .env.local'
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const IPHONE_IMAGES = {
  iphone17: '/iphone/iphone17pro/iphone_17__fb1277oq3eaa_large.jpg',
  iphone17Pro: '/iphone/iphone17pro/iphone_17pro__t1j902iw6kya_large.jpg',
  iphone17e: '/iphone/iphone17pro/iphone_17e__cq5ygzct314y_large.jpg',
  iphoneAir: '/iphone/iphone17pro/iphone_air__b5qmgl05ojyq_large.jpg',
} as const;

const categories = [
  { name: 'For Home' },
  { name: 'For Music' },
  { name: 'For Phone' },
  { name: 'For Storage' },
];

async function seed() {
  const { error: pingError } = await supabase.from('categories').select('id').limit(1);
  if (pingError) {
    console.error(
      'Database not ready. Run supabase/migrations in Supabase SQL Editor first.\n',
      pingError.message
    );
    process.exit(1);
  }

  console.log('Clearing existing products...');
  await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (deleteError) {
    console.error('Error clearing products:', deleteError.message);
    process.exit(1);
  }

  console.log('Seeding categories...');
  const { data: insertedCategories, error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'name' })
    .select();

  if (catError) {
    console.error('Error seeding categories:', catError.message);
    process.exit(1);
  }

  const categoryMap: Record<string, string> = {};
  for (const cat of insertedCategories ?? []) {
    categoryMap[cat.name] = cat.id;
  }

  const products = [
    {
      name: 'iPhone 17',
      description:
        'The latest iPhone with advanced camera system, all-day battery, and stunning display.',
      price: 45999,
      compare_at_price: 49999,
      specs: { Storage: '256GB', Display: '6.3" Super Retina', Chip: 'A19' },
      stock_quantity: 32,
      sales_count: 120,
      image_url: IPHONE_IMAGES.iphone17,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'iPhone 17 Pro',
      description:
        'Pro-grade performance with titanium design, pro camera, and the fastest chip.',
      price: 65999,
      compare_at_price: 69999,
      specs: { Storage: '512GB', Display: '6.9" ProMotion', Chip: 'A19 Pro' },
      stock_quantity: 24,
      sales_count: 85,
      image_url: IPHONE_IMAGES.iphone17Pro,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'iPhone 17e',
      description:
        'Essential iPhone features at an incredible value. Powerful, durable, and easy to love.',
      price: 32999,
      specs: { Storage: '128GB', Display: '6.1"', Chip: 'A18' },
      stock_quantity: 40,
      sales_count: 45,
      image_url: IPHONE_IMAGES.iphone17e,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'iPhone Air',
      description:
        'Ultra-thin design meets pro capability. Light in hand, heavy on innovation.',
      price: 54999,
      compare_at_price: 57999,
      specs: { Storage: '256GB', Weight: '165g', Thickness: '5.6mm' },
      stock_quantity: 18,
      sales_count: 30,
      image_url: IPHONE_IMAGES.iphoneAir,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'Headsound Pro',
      description:
        'Premium wireless headphones with spatial audio and active noise cancellation.',
      price: 12999,
      specs: { 'Battery Life': '30 hours', ANC: 'Yes', Connectivity: 'Bluetooth 5.3' },
      stock_quantity: 45,
      sales_count: 60,
      image_url: IPHONE_IMAGES.iphone17,
      category_id: categoryMap['For Music'],
      status: 'Active',
    },
    {
      name: 'Smart Home Hub',
      description:
        'Control your entire home from one elegant hub. Works with all major smart devices.',
      price: 6499,
      stock_quantity: 30,
      image_url: IPHONE_IMAGES.iphone17Pro,
      category_id: categoryMap['For Home'],
      status: 'Active',
    },
    {
      name: 'CloudVault 2TB',
      description:
        'Fast external storage with hardware encryption. Backup and access files anywhere.',
      price: 4999,
      specs: { Capacity: '2TB', Interface: 'USB-C 3.2', Encryption: 'AES-256' },
      stock_quantity: 55,
      sales_count: 22,
      image_url: IPHONE_IMAGES.iphone17e,
      category_id: categoryMap['For Storage'],
      status: 'Active',
    },
    {
      name: 'Phone Holder Sakti',
      description:
        'Magnetic phone mount for desk and car. Adjustable angle, secure grip.',
      price: 899,
      stock_quantity: 100,
      image_url: IPHONE_IMAGES.iphoneAir,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'iPhone 17 — Midnight',
      description: 'iPhone 17 in Midnight finish. Same great phone, bold new color.',
      price: 45999,
      compare_at_price: 47999,
      specs: { Storage: '256GB', Color: 'Midnight' },
      stock_quantity: 15,
      sales_count: 10,
      image_url: IPHONE_IMAGES.iphone17,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'Wireless Earbuds Pro',
      description:
        'True wireless earbuds with ANC, transparency mode, and 24-hour battery with case.',
      price: 3499,
      compare_at_price: 3999,
      specs: { 'Battery Life': '24 hours', ANC: 'Yes', Connectivity: 'Bluetooth 5.3' },
      stock_quantity: 60,
      sales_count: 35,
      image_url: IPHONE_IMAGES.iphone17Pro,
      category_id: categoryMap['For Music'],
      status: 'Active',
    },
  ];

  console.log('Seeding products...');
  const { data: insertedProducts, error: prodError } = await supabase
    .from('products')
    .insert(products)
    .select();

  if (prodError) {
    console.error('Error seeding products:', prodError.message);
    console.error('Tip: Apply supabase/migrations/003_tier1_commerce.sql if columns are missing.');
    process.exit(1);
  }

  console.log('Seeding product gallery images...');
  for (const product of insertedProducts ?? []) {
    const gallery: string[] = [product.image_url as string];
    if (product.name.includes('Pro')) {
      gallery.push(IPHONE_IMAGES.iphone17Pro, IPHONE_IMAGES.iphoneAir);
    } else if (product.name.includes('iPhone')) {
      gallery.push(IPHONE_IMAGES.iphone17e);
    }
    const unique = [...new Set(gallery.filter(Boolean))];
    await supabase.from('product_images').insert(
      unique.map((url, i) => ({
        product_id: product.id,
        url,
        sort_order: i,
      }))
    );
  }

  console.log(`Done! Inserted ${insertedProducts?.length ?? 0} products with Tier 1 data.`);
  console.log('Refresh http://localhost:3000/products to see them.');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

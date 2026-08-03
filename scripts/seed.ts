import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

/** Local mockup assets in /public/iphone/iphone17 */
const IPHONE_IMAGES = {
  iphone17: '/iphone/iphone17/iphone_17__fb1277oq3eaa_large.jpg',
  iphone17Pro: '/iphone/iphone17/iphone_17pro__t1j902iw6kya_large.jpg',
  iphone17e: '/iphone/iphone17/iphone_17e__cq5ygzct314y_large.jpg',
  iphoneAir: '/iphone/iphone17/iphone_air__b5qmgl05ojyq_large.jpg',
} as const;

const categories = [
  { name: 'For Home' },
  { name: 'For Music' },
  { name: 'For Phone' },
  { name: 'For Storage' },
];

async function seed() {
  console.log('Clearing existing products...');
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (deleteError) {
    console.error('Error clearing products:', deleteError);
    process.exit(1);
  }

  console.log('Seeding categories...');
  const { data: insertedCategories, error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'name' })
    .select();

  if (catError) {
    console.error('Error seeding categories:', catError);
    process.exit(1);
  }

  console.log(`Upserted ${insertedCategories.length} categories`);

  const categoryMap: Record<string, string> = {};
  for (const cat of insertedCategories) {
    categoryMap[cat.name] = cat.id;
  }

  const products = [
    {
      name: 'iPhone 17',
      description:
        'The latest iPhone with advanced camera system, all-day battery, and stunning display.',
      price: 799.0,
      stock_quantity: 32,
      image_url: IPHONE_IMAGES.iphone17,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'iPhone 17 Pro',
      description:
        'Pro-grade performance with titanium design, pro camera, and the fastest chip.',
      price: 999.0,
      stock_quantity: 24,
      image_url: IPHONE_IMAGES.iphone17Pro,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'iPhone 17e',
      description:
        'Essential iPhone features at an incredible value. Powerful, durable, and easy to love.',
      price: 599.0,
      stock_quantity: 40,
      image_url: IPHONE_IMAGES.iphone17e,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'iPhone Air',
      description:
        'Ultra-thin design meets pro capability. Light in hand, heavy on innovation.',
      price: 899.0,
      stock_quantity: 18,
      image_url: IPHONE_IMAGES.iphoneAir,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'Headsound Pro',
      description:
        'Premium wireless headphones with spatial audio and active noise cancellation.',
      price: 249.0,
      stock_quantity: 45,
      image_url: IPHONE_IMAGES.iphone17,
      category_id: categoryMap['For Music'],
      status: 'Active',
    },
    {
      name: 'Smart Home Hub',
      description:
        'Control your entire home from one elegant hub. Works with all major smart devices.',
      price: 129.0,
      stock_quantity: 30,
      image_url: IPHONE_IMAGES.iphone17Pro,
      category_id: categoryMap['For Home'],
      status: 'Active',
    },
    {
      name: 'CloudVault 2TB',
      description:
        'Fast external storage with hardware encryption. Backup and access files anywhere.',
      price: 89.0,
      stock_quantity: 55,
      image_url: IPHONE_IMAGES.iphone17e,
      category_id: categoryMap['For Storage'],
      status: 'Active',
    },
    {
      name: 'Phone Holder Sakti',
      description:
        'Magnetic phone mount for desk and car. Adjustable angle, secure grip.',
      price: 29.9,
      stock_quantity: 100,
      image_url: IPHONE_IMAGES.iphoneAir,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
    {
      name: 'iPhone 17 — Midnight',
      description: 'iPhone 17 in Midnight finish. Same great phone, bold new color.',
      price: 799.0,
      stock_quantity: 15,
      image_url: IPHONE_IMAGES.iphone17,
      category_id: categoryMap['For Phone'],
      status: 'Active',
    },
  ];

  console.log('Seeding products...');
  const { data: insertedProducts, error: prodError } = await supabase
    .from('products')
    .insert(products)
    .select();

  if (prodError) {
    console.error('Error seeding products:', prodError);
    process.exit(1);
  }

  console.log(`Inserted ${insertedProducts.length} products`);
  console.log('Seed completed successfully!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

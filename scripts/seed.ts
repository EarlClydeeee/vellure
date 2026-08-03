import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const categories = [
  { name: 'Electronics' },
  { name: 'Clothing' },
  { name: 'Home & Garden' },
  { name: 'Sports' },
  { name: 'Books' },
];

async function seed() {
  console.log('Seeding categories...');
  const { data: insertedCategories, error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'name' })
    .select();

  if (catError) {
    console.error('Error seeding categories:', catError);
    process.exit(1);
  }

  console.log(`Inserted ${insertedCategories.length} categories`);

  const categoryMap: Record<string, string> = {};
  for (const cat of insertedCategories) {
    categoryMap[cat.name] = cat.id;
  }

  const products = [
    {
      name: 'Wireless Bluetooth Headphones',
      description: 'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
      price: 149.99,
      stock_quantity: 25,
      image_url: 'https://placehold.co/400x400?text=Headphones',
      category_id: categoryMap['Electronics'],
      status: 'Active',
    },
    {
      name: 'Smart Watch Pro',
      description: 'Feature-rich smartwatch with heart rate monitor, GPS, and water resistance.',
      price: 299.99,
      stock_quantity: 15,
      image_url: 'https://placehold.co/400x400?text=SmartWatch',
      category_id: categoryMap['Electronics'],
      status: 'Active',
    },
    {
      name: 'USB-C Charging Cable 3-Pack',
      description: 'Durable braided USB-C cables, 6ft length, fast charging compatible.',
      price: 19.99,
      stock_quantity: 100,
      image_url: 'https://placehold.co/400x400?text=USB-C+Cable',
      category_id: categoryMap['Electronics'],
      status: 'Active',
    },
    {
      name: 'Classic Denim Jacket',
      description: 'Timeless denim jacket with a modern fit. Available in multiple sizes.',
      price: 89.99,
      stock_quantity: 40,
      image_url: 'https://placehold.co/400x400?text=Denim+Jacket',
      category_id: categoryMap['Clothing'],
      status: 'Active',
    },
    {
      name: 'Cotton Crew Neck T-Shirt',
      description: '100% organic cotton t-shirt, soft and breathable for everyday wear.',
      price: 24.99,
      stock_quantity: 200,
      image_url: 'https://placehold.co/400x400?text=T-Shirt',
      category_id: categoryMap['Clothing'],
      status: 'Active',
    },
    {
      name: 'Winter Puffer Jacket',
      description: 'Insulated puffer jacket for cold weather. Lightweight yet extremely warm.',
      price: 179.99,
      stock_quantity: 0,
      image_url: 'https://placehold.co/400x400?text=Puffer+Jacket',
      category_id: categoryMap['Clothing'],
      status: 'Out of Stock',
    },
    {
      name: 'Indoor Plant Pot Set',
      description: 'Set of 3 ceramic plant pots in minimalist design. Includes drainage trays.',
      price: 39.99,
      stock_quantity: 60,
      image_url: 'https://placehold.co/400x400?text=Plant+Pots',
      category_id: categoryMap['Home & Garden'],
      status: 'Active',
    },
    {
      name: 'LED Desk Lamp',
      description: 'Adjustable LED desk lamp with 5 brightness levels and USB charging port.',
      price: 54.99,
      stock_quantity: 35,
      image_url: 'https://placehold.co/400x400?text=Desk+Lamp',
      category_id: categoryMap['Home & Garden'],
      status: 'Active',
    },
    {
      name: 'Garden Tool Set',
      description: 'Complete 5-piece garden tool set with ergonomic handles and carrying bag.',
      price: 44.99,
      stock_quantity: 20,
      image_url: 'https://placehold.co/400x400?text=Garden+Tools',
      category_id: categoryMap['Home & Garden'],
      status: 'Inactive',
    },
    {
      name: 'Yoga Mat Premium',
      description: 'Non-slip yoga mat with alignment marks. 6mm thick for extra cushioning.',
      price: 49.99,
      stock_quantity: 80,
      image_url: 'https://placehold.co/400x400?text=Yoga+Mat',
      category_id: categoryMap['Sports'],
      status: 'Active',
    },
    {
      name: 'Adjustable Dumbbells Set',
      description: 'Space-saving adjustable dumbbells from 5 to 52.5 lbs each.',
      price: 399.99,
      stock_quantity: 10,
      image_url: 'https://placehold.co/400x400?text=Dumbbells',
      category_id: categoryMap['Sports'],
      status: 'Active',
    },
    {
      name: 'Running Shoes Ultra',
      description: 'Lightweight running shoes with responsive cushioning and breathable mesh upper.',
      price: 129.99,
      stock_quantity: 45,
      image_url: 'https://placehold.co/400x400?text=Running+Shoes',
      category_id: categoryMap['Sports'],
      status: 'Active',
    },
    {
      name: 'The Art of Programming',
      description: 'Comprehensive guide to software engineering principles and best practices.',
      price: 49.99,
      stock_quantity: 150,
      image_url: 'https://placehold.co/400x400?text=Programming+Book',
      category_id: categoryMap['Books'],
      status: 'Active',
    },
    {
      name: 'Modern Design Patterns',
      description: 'Essential reference for scalable and maintainable software architecture.',
      price: 39.99,
      stock_quantity: 75,
      image_url: 'https://placehold.co/400x400?text=Design+Patterns',
      category_id: categoryMap['Books'],
      status: 'Active',
    },
    {
      name: 'Portable Bluetooth Speaker',
      description: 'Waterproof portable speaker with 360-degree sound and 12-hour playtime.',
      price: 79.99,
      stock_quantity: 55,
      image_url: 'https://placehold.co/400x400?text=Speaker',
      category_id: categoryMap['Electronics'],
      status: 'Inactive',
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

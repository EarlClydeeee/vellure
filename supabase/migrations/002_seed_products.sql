-- Seed categories and iPhone mockup products for Vellure store
-- Safe to re-run: clears products first, upserts categories

DELETE FROM products;

INSERT INTO categories (name) VALUES
  ('For Home'),
  ('For Music'),
  ('For Phone'),
  ('For Storage')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (name, description, price, stock_quantity, image_url, category_id, status) VALUES
(
  'iPhone 17',
  'The latest iPhone with advanced camera system, all-day battery, and stunning display.',
  799.00, 32,
  '/iphone/iphone17/iphone_17__fb1277oq3eaa_large.jpg',
  (SELECT id FROM categories WHERE name = 'For Phone'),
  'Active'
),
(
  'iPhone 17 Pro',
  'Pro-grade performance with titanium design, pro camera, and the fastest chip.',
  999.00, 24,
  '/iphone/iphone17/iphone_17pro__t1j902iw6kya_large.jpg',
  (SELECT id FROM categories WHERE name = 'For Phone'),
  'Active'
),
(
  'iPhone 17e',
  'Essential iPhone features at an incredible value. Powerful, durable, and easy to love.',
  599.00, 40,
  '/iphone/iphone17/iphone_17e__cq5ygzct314y_large.jpg',
  (SELECT id FROM categories WHERE name = 'For Phone'),
  'Active'
),
(
  'iPhone Air',
  'Ultra-thin design meets pro capability. Light in hand, heavy on innovation.',
  899.00, 18,
  '/iphone/iphone17/iphone_air__b5qmgl05ojyq_large.jpg',
  (SELECT id FROM categories WHERE name = 'For Phone'),
  'Active'
),
(
  'Headsound Pro',
  'Premium wireless headphones with spatial audio and active noise cancellation.',
  249.00, 45,
  '/iphone/iphone17/iphone_17__fb1277oq3eaa_large.jpg',
  (SELECT id FROM categories WHERE name = 'For Music'),
  'Active'
),
(
  'Smart Home Hub',
  'Control your entire home from one elegant hub. Works with all major smart devices.',
  129.00, 30,
  '/iphone/iphone17/iphone_17pro__t1j902iw6kya_large.jpg',
  (SELECT id FROM categories WHERE name = 'For Home'),
  'Active'
),
(
  'CloudVault 2TB',
  'Fast external storage with hardware encryption. Backup and access files anywhere.',
  89.00, 55,
  '/iphone/iphone17/iphone_17e__cq5ygzct314y_large.jpg',
  (SELECT id FROM categories WHERE name = 'For Storage'),
  'Active'
),
(
  'Phone Holder Sakti',
  'Magnetic phone mount for desk and car. Adjustable angle, secure grip.',
  29.90, 100,
  '/iphone/iphone17/iphone_air__b5qmgl05ojyq_large.jpg',
  (SELECT id FROM categories WHERE name = 'For Phone'),
  'Active'
),
(
  'iPhone 17 — Midnight',
  'iPhone 17 in Midnight finish. Same great phone, bold new color.',
  799.00, 15,
  '/iphone/iphone17/iphone_17__fb1277oq3eaa_large.jpg',
  (SELECT id FROM categories WHERE name = 'For Phone'),
  'Active'
);

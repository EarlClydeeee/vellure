-- Tier 1 PH Commerce extensions

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(10,2),
  ADD COLUMN IF NOT EXISTS specs JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS sales_count INTEGER NOT NULL DEFAULT 0;

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS shipping_fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS discount DECIMAL(10,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS promo_code TEXT,
  ADD COLUMN IF NOT EXISTS shipping_zone TEXT,
  ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'cod_pending', 'failed', 'refunded')),
  ADD COLUMN IF NOT EXISTS payment_reference TEXT,
  ADD COLUMN IF NOT EXISTS tracking_number TEXT;

ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_payment_method_check;
ALTER TABLE orders ADD CONSTRAINT orders_payment_method_check
  CHECK (payment_method IN ('COD', 'GCash', 'Maya', 'Bank Transfer', 'E-Wallet', 'Card'));

CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS promotions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percent', 'fixed', 'free_shipping')),
  discount_value DECIMAL(10,2) NOT NULL DEFAULT 0,
  min_spend DECIMAL(10,2) NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shipping_zones (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  fee DECIMAL(10,2) NOT NULL DEFAULT 0,
  free_shipping_threshold DECIMAL(10,2),
  estimated_days TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  label TEXT NOT NULL DEFAULT 'Home',
  full_name TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  address_line TEXT NOT NULL,
  shipping_zone TEXT NOT NULL DEFAULT 'ncr',
  is_default BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('pending', 'published', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(product_id, customer_id, order_id)
);

CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

CREATE TABLE IF NOT EXISTS return_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'requested'
    CHECK (status IN ('requested', 'approved', 'rejected', 'refunded')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  channel TEXT NOT NULL DEFAULT 'email',
  event_type TEXT NOT NULL,
  recipient TEXT NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "product_images_public_read" ON product_images FOR SELECT USING (true);
CREATE POLICY "product_images_service_write" ON product_images FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "promotions_public_read" ON promotions FOR SELECT USING (active = true);
CREATE POLICY "promotions_service_all" ON promotions FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "shipping_zones_public_read" ON shipping_zones FOR SELECT USING (true);
CREATE POLICY "shipping_zones_service_all" ON shipping_zones FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "addresses_own" ON customer_addresses FOR ALL
  USING (auth.uid() = customer_id) WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "addresses_service_all" ON customer_addresses FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "reviews_public_read" ON product_reviews FOR SELECT USING (status = 'published');
CREATE POLICY "reviews_own_insert" ON product_reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "reviews_own_read" ON product_reviews FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "reviews_service_all" ON product_reviews FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "wishlist_own" ON wishlist_items FOR ALL
  USING (auth.uid() = customer_id) WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "wishlist_service_all" ON wishlist_items FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "returns_own_read" ON return_requests FOR SELECT USING (auth.uid() = customer_id);
CREATE POLICY "returns_own_insert" ON return_requests FOR INSERT WITH CHECK (auth.uid() = customer_id);
CREATE POLICY "returns_service_all" ON return_requests FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "notification_logs_service_all" ON notification_logs FOR ALL USING (true) WITH CHECK (true);

-- Seed shipping zones
INSERT INTO shipping_zones (id, name, fee, free_shipping_threshold, estimated_days, sort_order) VALUES
  ('ncr', 'Metro Manila', 99, 5000, 'Same-day if ordered before 2 PM', 1),
  ('luzon', 'Luzon', 149, 5000, '2–3 business days', 2),
  ('vismin', 'Visayas & Mindanao', 199, 5000, '3–5 business days', 3)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  fee = EXCLUDED.fee,
  free_shipping_threshold = EXCLUDED.free_shipping_threshold,
  estimated_days = EXCLUDED.estimated_days;

-- Seed promotions
INSERT INTO promotions (code, description, discount_type, discount_value, min_spend, active) VALUES
  ('WELCOME10', '10% off first order', 'percent', 10, 2500, true),
  ('TECH88', '8.8 Tech Sale extra 8%', 'percent', 8, 0, true),
  ('FREESHIP', 'Free shipping', 'free_shipping', 0, 5000, true),
  ('BUNDLE15', 'Bundle & save 15%', 'percent', 15, 0, true)
ON CONFLICT (code) DO UPDATE SET
  description = EXCLUDED.description,
  discount_type = EXCLUDED.discount_type,
  discount_value = EXCLUDED.discount_value,
  min_spend = EXCLUDED.min_spend,
  active = EXCLUDED.active;

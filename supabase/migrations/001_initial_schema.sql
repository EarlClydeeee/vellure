-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL CHECK (price > 0),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  image_url TEXT,
  category_id UUID REFERENCES categories(id),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Out of Stock')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Customers (extends Supabase auth.users)
CREATE TABLE customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT,
  email TEXT NOT NULL,
  contact_number TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Cart Items
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(customer_id, product_id)
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number SERIAL UNIQUE,
  customer_id UUID NOT NULL REFERENCES customers(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('COD', 'E-Wallet', 'Bank Transfer')),
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Preparing', 'Shipped', 'Completed', 'Cancelled')),
  notes TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10,2) NOT NULL
);

-- Trigger function to auto-create customer row on auth.users signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Categories: public read, authenticated write (admin handled via service role)
CREATE POLICY "categories_public_read" ON categories
  FOR SELECT USING (true);

CREATE POLICY "categories_service_write" ON categories
  FOR ALL USING (true) WITH CHECK (true);

-- Products: public read, authenticated write (admin handled via service role)
CREATE POLICY "products_public_read" ON products
  FOR SELECT USING (true);

CREATE POLICY "products_service_write" ON products
  FOR ALL USING (true) WITH CHECK (true);

-- Customers: users can read/update their own row
CREATE POLICY "customers_own_read" ON customers
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "customers_own_update" ON customers
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "customers_service_all" ON customers
  FOR ALL USING (true) WITH CHECK (true);

-- Cart Items: users can manage their own cart
CREATE POLICY "cart_items_own_select" ON cart_items
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "cart_items_own_insert" ON cart_items
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "cart_items_own_update" ON cart_items
  FOR UPDATE USING (auth.uid() = customer_id);

CREATE POLICY "cart_items_own_delete" ON cart_items
  FOR DELETE USING (auth.uid() = customer_id);

-- Orders: users can read their own orders
CREATE POLICY "orders_own_read" ON orders
  FOR SELECT USING (auth.uid() = customer_id);

CREATE POLICY "orders_own_insert" ON orders
  FOR INSERT WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "orders_service_all" ON orders
  FOR ALL USING (true) WITH CHECK (true);

-- Order Items: users can read items for their own orders
CREATE POLICY "order_items_own_read" ON order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "order_items_own_insert" ON order_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.customer_id = auth.uid()
    )
  );

CREATE POLICY "order_items_service_all" ON order_items
  FOR ALL USING (true) WITH CHECK (true);

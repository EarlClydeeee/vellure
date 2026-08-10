# Vellure - E-Commerce Website

CubeTech Web Development Intern Assessment submission — full-stack e-commerce with customer storefront and admin dashboard.

## Submission Links

| Resource | URL |
|----------|-----|
| **GitHub Repository** | https://github.com/EarlClydeeee/vellure.git |
| **Live Customer Site** | _Deploy to Vercel — see [Deployment](#deployment) below_ |
| **Live Admin Dashboard** | _Same deployment — `/admin/login`_ |

## Admin Login Credentials

- **Username:** `admin`
- **Password:** `admin123`

(Configurable via `ADMIN_USERNAME` and `ADMIN_PASSWORD` in `.env.local`)

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Customer Auth:** Supabase Auth (email/password)
- **Admin Auth:** Simulated session (environment variables)
- **Validation:** Zod
- **Node.js:** 20+ required for build

## Features

### Customer Website

- Home page: logo, navigation, promo banner, categories, featured products, footer with contact + social links
- Product listing (10+ products): search, category filter, price sorting, stock availability, View Details, Add to Cart
- Product details: gallery, specs, quantity selector, related products, Buy Now
- Shopping cart: guest (localStorage) + authenticated (Supabase); persists after refresh
- Checkout: login required; COD, E-Wallet, Bank Transfer; order confirmation with order number and summary
- Account hub: profile, addresses, orders with tracking timeline, wishlist

### Admin Dashboard

- Login with simulated credentials
- Dashboard: 6 summary cards (products, orders, pending, completed, customers, sales)
- Product CRUD with search/filter, delete confirmation
- Category CRUD with deletion protection when products assigned
- Order management with status updates and order details
- Customer list with order count, total purchases, account status

## Getting Started

### Prerequisites

- Node.js 20+
- Supabase project (free tier works)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/EarlClydeeee/vellure.git
   cd vellure
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment file:
   ```bash
   cp .env.local.example .env.local
   ```

4. Fill in Supabase credentials and admin credentials in `.env.local`

5. Run database migrations in Supabase SQL Editor (in order):
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/003_tier1_commerce.sql`

6. Seed sample data:
   ```bash
   npm run seed
   ```

7. Start development server:
   ```bash
   npm run dev
   ```

8. Open:
   - Customer site: http://localhost:3000
   - Admin login: http://localhost:3000/admin/login

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Import the GitHub repository
2. Add all environment variables from `.env.local`
3. Deploy — customer site and admin dashboard share the same URL
4. Update the **Live Customer Site** link above with your Vercel URL

```bash
npx vercel --prod
```

## System Flow

1. **Browse:** Guest or logged-in customer browses home, categories, and product listing (10+ products)
2. **Cart:** Add items to cart (localStorage for guests, Supabase for logged-in users); cart persists on refresh
3. **Checkout:** Login required at checkout; guest cart merges on login/signup
4. **Order:** Customer submits checkout form (name, email, contact, address, payment method, notes)
5. **Confirmation:** Order number and line-item summary displayed; E-Wallet/Bank Transfer show mock payment instructions
6. **Admin:** Admin logs in, views dashboard metrics, manages products/categories/orders/customers
7. **Sync:** Admin product/status changes reflect on customer site immediately (inactive products hidden, prices updated)
8. **Tracking:** Customer views order status timeline at `/account/orders/[id]`

## Screenshots

See [`docs/screenshots/README.md`](docs/screenshots/README.md) for required desktop and mobile captures for submission.

## Project Structure

```
src/
├── app/
│   ├── (store)/          # Customer storefront
│   │   ├── page.tsx      # Home
│   │   ├── products/     # Listing & details
│   │   ├── cart/         # Shopping cart
│   │   ├── checkout/     # Checkout & mock payment
│   │   ├── account/      # Profile, addresses, orders, wishlist
│   │   ├── login/        # Customer login
│   │   └── signup/       # Customer sign-up
│   ├── (admin)/admin/    # Admin dashboard
│   └── api/              # API routes
├── components/
│   ├── ui/               # shadcn/ui
│   ├── store/            # Customer components
│   └── admin/            # Admin components
├── lib/
│   ├── services/         # Database services
│   ├── validation/       # Zod schemas
│   └── cart/             # Guest cart & compare
└── middleware.ts         # Route protection
```

## Assessment Compliance

This project meets the CubeTech Simple E-Commerce Website requirements:

- Customer: home, PLP (10+ products), PDP, cart, checkout, order confirmation
- Admin: login, dashboard, product/category/order/customer management
- Cross-cutting: admin changes sync to customer site, responsive design, form validation

## License

MIT

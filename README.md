# Vellure - E-Commerce Website

## Overview

A full-stack e-commerce website built with Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui, and Supabase. Features a customer storefront and an admin dashboard.

## Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Customer Auth:** Supabase Auth (email/password)
- **Admin Auth:** Simulated (environment variables)
- **Validation:** Zod

## Features

### Customer Website

- Home page with promotional banner, categories, featured products
- Product listing with search, category filter, price sorting
- Product details with quantity selector, related products
- Shopping cart (database-persisted, survives refresh)
- Checkout with form validation (COD, E-Wallet, Bank Transfer)
- Order history and order details
- Responsive design (320px – 1920px)

### Admin Dashboard

- Login with simulated credentials
- Dashboard overview with 6 metric cards
- Product management (CRUD, search, filter by category/status)
- Category management (with deletion protection)
- Order management (view details, update status)
- Customer management (list with aggregates)
- Responsive design (768px – 1920px)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase project (free tier works)

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Copy environment file: `cp .env.local.example .env.local`
4. Fill in your Supabase credentials and admin credentials in `.env.local`
5. Run the database migration in your Supabase SQL Editor (from `supabase/migrations/001_initial_schema.sql`)
6. Seed the database: `npx tsx scripts/seed.ts`
7. Run development server: `npm run dev`

### Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (for seeding only)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

### Admin Login Credentials

- **Username:** admin
- **Password:** admin123

(configurable via environment variables)

## Project Structure

```
src/
├── app/
│   ├── (store)/          # Customer storefront
│   │   ├── page.tsx      # Home page
│   │   ├── products/     # Product listing & details
│   │   ├── cart/         # Shopping cart
│   │   ├── checkout/     # Checkout flow
│   │   ├── orders/       # Order history
│   │   ├── login/        # Customer login
│   │   └── signup/       # Customer sign-up
│   ├── (admin)/          # Admin dashboard
│   │   └── admin/
│   │       ├── dashboard/   # Overview metrics
│   │       ├── products/    # Product CRUD
│   │       ├── categories/  # Category CRUD
│   │       ├── orders/      # Order management
│   │       ├── customers/   # Customer list
│   │       └── login/       # Admin login
│   └── api/              # API routes
├── components/
│   ├── ui/               # shadcn/ui components
│   ├── store/            # Customer-facing components
│   ├── admin/            # Admin components
│   └── shared/           # Shared components
├── lib/
│   ├── auth/             # Auth utilities
│   ├── services/         # Service layer (DB queries)
│   ├── supabase/         # Supabase client setup
│   ├── types/            # TypeScript types
│   └── validation/       # Zod schemas
└── middleware.ts         # Route protection
```

## System Flow

1. Customers sign up/log in via Supabase Auth
2. Customers browse products, add to cart, and checkout
3. Orders are created with "Pending" status
4. Admin logs in with simulated credentials
5. Admin manages products, categories, and updates order statuses
6. Changes made in admin reflect on the customer storefront immediately

## Technologies Used

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui (Button, Card, Badge, Dialog, Table, Select, etc.)
- Supabase (PostgreSQL + Auth)
- Zod (form validation)
- Lucide React (icons)

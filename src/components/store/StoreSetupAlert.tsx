import { AlertCircle, Database } from 'lucide-react';

interface StoreSetupAlertProps {
  error?: string;
  empty?: boolean;
}

export function StoreSetupAlert({ error, empty }: StoreSetupAlertProps) {
  if (!error && !empty) return null;

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
      <div className="flex gap-3">
        {error ? (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
        ) : (
          <Database className="mt-0.5 h-5 w-5 shrink-0" />
        )}
        <div className="space-y-2 text-sm">
          {error ? (
            <>
              <p className="font-semibold">Database connection failed</p>
              <p className="text-amber-900/80">{error}</p>
              {error.includes('product_images') ? (
                <p>
                  The <code className="rounded bg-amber-100 px-1">product_images</code> table is
                  missing. Run migration{' '}
                  <code className="rounded bg-amber-100 px-1">003_tier1_commerce.sql</code> in the
                  Supabase SQL Editor (see steps below).
                </p>
              ) : (
                <p>
                  Check <code className="rounded bg-amber-100 px-1">.env.local</code> has the
                  correct Supabase URL and key, then restart the dev server.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="font-semibold">No products in the database yet</p>
              <p className="text-amber-900/80">
                Run the setup steps below to load your iPhone mockup catalog.
              </p>
            </>
          )}
          <ol className="list-decimal space-y-1 pl-4 text-amber-900/90">
            <li>
              Supabase Dashboard → SQL Editor → run{' '}
              <code className="rounded bg-amber-100 px-1">
                supabase/migrations/001_initial_schema.sql
              </code>
            </li>
            <li>
              Then run{' '}
              <code className="rounded bg-amber-100 px-1">
                supabase/migrations/003_tier1_commerce.sql
              </code>{' '}
              (creates <code className="rounded bg-amber-100 px-1">product_images</code> and
              other commerce tables)
            </li>
            <li>
              Seed products:{' '}
              <code className="rounded bg-amber-100 px-1">
                supabase/migrations/002_seed_products.sql
              </code>{' '}
              or <code className="rounded bg-amber-100 px-1">npm run seed</code>
            </li>
            <li>Refresh this page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

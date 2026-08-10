import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { StoreProviders } from '@/components/store/StoreProviders';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getCartItems } from '@/lib/services/cart';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userEmail: string | undefined;
  let cartItemCount = 0;
  let isAuthenticated = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      isAuthenticated = !!user;
      userEmail = user?.email;

      if (user) {
        const cartResult = await getCartItems(user.id);
        if (cartResult.success) {
          cartItemCount = cartResult.data.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
        }
      }
    } catch {
      // Allow storefront to render when Supabase is unavailable.
    }
  }

  return (
    <StoreProviders initialCartCount={cartItemCount} isAuthenticated={isAuthenticated}>
      <div className="flex min-h-screen flex-col">
        <Header userEmail={userEmail} />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
      </div>
    </StoreProviders>
  );
}

import { Header } from '@/components/store/Header';
import { Footer } from '@/components/store/Footer';
import { StoreProviders } from '@/components/store/StoreProviders';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getCartItems } from '@/lib/services/cart';

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let cartItemCount = 0;
  if (user) {
    const cartResult = await getCartItems(user.id);
    if (cartResult.success) {
      cartItemCount = cartResult.data.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
    }
  }

  return (
    <StoreProviders>
      <div className="flex min-h-screen flex-col">
        <Header userEmail={user?.email} cartItemCount={cartItemCount} />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </StoreProviders>
  );
}

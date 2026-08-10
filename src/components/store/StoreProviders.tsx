'use client';

import { VellureSplash } from '@/components/store/VellureSplash';
import { NavigationProgress } from '@/components/store/NavigationProgress';
import { CartProvider } from '@/components/store/CartProvider';
import { CompareBar } from '@/components/store/CompareBar';

interface StoreProvidersProps {
  children: React.ReactNode;
  initialCartCount?: number;
  isAuthenticated?: boolean;
}

export function StoreProviders({
  children,
  initialCartCount = 0,
  isAuthenticated = false,
}: StoreProvidersProps) {
  return (
    <CartProvider initialCount={initialCartCount} isAuthenticated={isAuthenticated}>
      <VellureSplash />
      <NavigationProgress />
      {children}
      <CompareBar />
    </CartProvider>
  );
}

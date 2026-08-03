'use client';

import { VellureSplash } from '@/components/store/VellureSplash';
import { NavigationProgress } from '@/components/store/NavigationProgress';

export function StoreProviders({ children }: { children: React.ReactNode }) {
  return (
    <>
      <VellureSplash />
      <NavigationProgress />
      {children}
    </>
  );
}

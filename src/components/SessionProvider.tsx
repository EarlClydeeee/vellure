'use client';

import { createContext, useContext } from 'react';
import type { AppSession, SessionRole } from '@/lib/types/auth';

const SessionContext = createContext<AppSession>({
  role: 'guest',
  email: null,
  userId: null,
});

export function SessionProvider({
  session,
  children,
}: {
  session: AppSession;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={session}>{children}</SessionContext.Provider>
  );
}

export function useSession(): AppSession {
  return useContext(SessionContext);
}

export function useSessionRole(): SessionRole {
  return useContext(SessionContext).role;
}

export function isLoggedIn(session: AppSession): boolean {
  return session.role === 'admin' || session.role === 'customer';
}

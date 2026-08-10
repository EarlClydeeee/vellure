export type SessionRole = 'guest' | 'customer' | 'admin';

export interface AppSession {
  role: SessionRole;
  email: string | null;
  userId: string | null;
}

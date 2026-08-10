const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

/** Reads ADMIN_EMAIL or legacy ADMIN_USERNAME from env */
export function getAdminConfigEmail(): string | null {
  const email =
    process.env.ADMIN_EMAIL?.trim() || process.env.ADMIN_USERNAME?.trim();
  return email || null;
}

export function getAdminConfigPassword(): string | null {
  return process.env.ADMIN_PASSWORD?.trim() || null;
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmail = getAdminConfigEmail();
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

export function credentialsMatchAdmin(
  identifier: string,
  password: string
): boolean {
  const adminEmail = getAdminConfigEmail();
  const adminPassword = getAdminConfigPassword();
  if (!adminEmail || !adminPassword) return false;
  return (
    identifier.toLowerCase() === adminEmail.toLowerCase() &&
    password === adminPassword
  );
}

export interface AdminSessionPayload {
  timestamp: number;
  email?: string;
  role: 'admin';
}

export function parseAdminSessionToken(
  token: string | undefined
): AdminSessionPayload | null {
  if (!token) return null;
  try {
    const decoded = JSON.parse(
      Buffer.from(token, 'base64').toString()
    ) as AdminSessionPayload;
    if (
      typeof decoded.timestamp !== 'number' ||
      Date.now() - decoded.timestamp > SESSION_DURATION_MS
    ) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}

export function validateAdminSessionToken(token: string | undefined): boolean {
  return parseAdminSessionToken(token) !== null;
}

export { SESSION_DURATION_MS };

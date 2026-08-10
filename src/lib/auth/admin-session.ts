const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const adminEmail = process.env.ADMIN_USERNAME?.trim();
  if (!adminEmail) return false;
  return email.toLowerCase() === adminEmail.toLowerCase();
}

function validateSessionToken(token: string): boolean {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString());
    if (Date.now() - decoded.timestamp > SESSION_DURATION_MS) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function validateAdminSessionToken(token: string | undefined): boolean {
  if (!token) return false;
  return validateSessionToken(token);
}

export { SESSION_DURATION_MS };

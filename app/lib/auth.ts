import { cookies } from 'next/headers';

export function isValidJwt(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const payloadStr = Buffer.from(parts[1], 'base64').toString('utf-8');
    const payload = JSON.parse(payloadStr);
    if (!payload || typeof payload !== 'object' || !payload.sub) return false;
    if (payload.exp && typeof payload.exp === 'number') {
      const nowSec = Math.floor(Date.now() / 1000);
      if (payload.exp < nowSec) return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth(nextPath: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('gc_token')?.value;
  return isValidJwt(token);
}

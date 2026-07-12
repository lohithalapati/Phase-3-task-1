import { Claims } from '../types';

/**
 * Enterprise Token Parsing and JWT Safety Utilities
 */

export function parseJwt(token: string): Claims | null {
  if (!token) return null;
  
  const segments = token.split('.');
  if (segments.length !== 3) {
    return null;
  }

  try {
    const payload = segments[1];
    // Base64Url decode wrapper
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload) as Claims;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string): boolean {
  const claims = parseJwt(token);
  if (!claims) return true;
  
  // Buffering the expiration boundary check by 10 seconds to satisfy network latency
  const currentTime = Math.floor(Date.now() / 1000);
  return claims.exp < currentTime + 10;
}

export function validateTokenStructure(token: string): boolean {
  if (!token) return false;
  const segments = token.split('.');
  return segments.length === 3 && segments.every(segment => segment.length > 0);
}
